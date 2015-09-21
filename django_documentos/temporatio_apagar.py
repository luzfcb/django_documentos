# flake8: noqa
from django.conf import settings
from django.core import signing
from django.core.files.temp import NamedTemporaryFile
from django.template.response import TemplateResponse
from django.utils.encoding import smart_text
from django.views import generic
from django.views.generic.detail import BaseDetailView
from wkhtmltopdf import make_absolute_paths, wkhtmltopdf
from wkhtmltopdf.views import PDFResponse

from .models import Documento


class PDFTemplateResponse(TemplateResponse, PDFResponse):
    """Renders a Template into a PDF using wkhtmltopdf"""

    def __init__(self, request, template, context=None,
                 status=None, content_type=None, current_app=None,
                 filename=None, show_content_in_browser=None,
                 header_template=None, footer_template=None,
                 cmd_options=None, *args, **kwargs):

        super(PDFTemplateResponse, self).__init__(request=request,
                                                  template=template,
                                                  context=context,
                                                  status=status,
                                                  content_type=content_type,
                                                  current_app=None,
                                                  *args, **kwargs)
        self.set_filename(filename, show_content_in_browser)

        self.header_template = header_template
        self.footer_template = footer_template

        if cmd_options is None:
            cmd_options = {}
        self.cmd_options = cmd_options
        self.rendered_content()

    def render_to_temporary_file(self, template_name, mode='w+b', bufsize=-1,
                                 suffix='.html', prefix='tmp', dir=None,
                                 delete=True):
        template = self.resolve_template(template_name)

        context = self.resolve_context(self.context_data)

        content = smart_text(template.render(context))
        content = make_absolute_paths(content)

        try:
            # Python3 has 'buffering' arg instead of 'bufsize'
            tempfile = NamedTemporaryFile(mode=mode, buffering=bufsize,
                                          suffix=suffix, prefix=prefix,
                                          dir=dir, delete=delete)
        except TypeError:
            tempfile = NamedTemporaryFile(mode=mode, bufsize=bufsize,
                                          suffix=suffix, prefix=prefix,
                                          dir=dir, delete=delete)

        try:
            tempfile.write(content.encode('utf-8'))
            tempfile.flush()
            return tempfile
        except:
            # Clean-up tempfile if an Exception is raised.
            tempfile.close()
            raise

    def convert_to_pdf(self, filename,
                       header_filename=None, footer_filename=None):
        cmd_options = self.cmd_options.copy()
        # Clobber header_html and footer_html only if filenames are
        # provided. These keys may be in self.cmd_options as hardcoded
        # static files.
        if header_filename is not None:
            cmd_options['header_html'] = header_filename
        if footer_filename is not None:
            cmd_options['footer_html'] = footer_filename
        return wkhtmltopdf(pages=[filename], **cmd_options)

    @property
    def rendered_content(self):
        """Returns the freshly rendered content for the template and context
        described by the PDFResponse.

        This *does not* set the final content of the response. To set the
        response content, you must either call render(), or set the
        content explicitly using the value of this property.
        """
        debug = getattr(settings, 'WKHTMLTOPDF_DEBUG', settings.DEBUG)

        input_file = header_file = footer_file = None
        header_filename = footer_filename = None

        try:
            input_file = self.render_to_temporary_file(
                template_name=self.template_name,
                prefix='wkhtmltopdf', suffix='.html',
                delete=(not debug)
            )

            if self.header_template:
                header_file = self.render_to_temporary_file(
                    template_name=self.header_template,
                    prefix='wkhtmltopdf', suffix='.html',
                    delete=(not debug)
                )
                header_filename = header_file.name

            if self.footer_template:
                footer_file = self.render_to_temporary_file(
                    template_name=self.footer_template,
                    prefix='wkhtmltopdf', suffix='.html',
                    delete=(not debug)
                )
                footer_filename = footer_file.name

            return self.convert_to_pdf(filename=input_file.name,
                                       header_filename=header_filename,
                                       footer_filename=footer_filename)
        finally:
            # Clean up temporary files
            for f in filter(None, (input_file, header_file, footer_file)):
                f.close()


class PDFRenderMixin(BaseDetailView):
    """Class-based view for HTML templates rendered to PDF."""

    # Filename for downloaded PDF. If None, the response is inline.
    pdf_filename = 'rendered_pdf.pdf'

    # Send file as attachement. If True render content in the browser.
    pdf_show_content_in_browser = False

    # Filenames for the content, header, and footer templates.
    pdf_template_name = None
    pdf_header_template = None
    pdf_footer_template = None

    # TemplateResponse classes for PDF and HTML
    pdf_response_class = PDFTemplateResponse
    pdf_html_response_class = TemplateResponse

    # Command-line options to pass to wkhtmltopdf
    pdf_cmd_options = {
        # 'orientation': 'portrait',
        # 'collate': True,
        # 'quiet': None,
        'print-media-type': True
    }

    def __init__(self, *args, **kwargs):
        super(PDFRenderMixin, self).__init__(*args, **kwargs)

        # Copy self.pdf_cmd_options to prevent clobbering the class-level object.
        self.pdf_cmd_options = self.pdf_cmd_options.copy()
        self.render_now = False

    def get(self, request, *args, **kwargs):
        response_class = self.pdf_response_class
        # try:
        if self.kwargs.get('pdf') or self.request.GET.get('pdf'):
            self.render_now = True
        else:
            self.render_now = False

        if request.GET.get('as', '') == 'html':
            # Use the html_response_class if HTML was requested.
            self.pdf_response_class = self.pdf_html_response_class
        return super(PDFRenderMixin, self).get(request,
                                               *args, **kwargs)
        # finally:  # Remove self.response_class
        #     self.pdf_response_class = response_class

    # Send file as attachement. If True render content in the browser.
    def get_pdf_show_content_in_browser(self):
        return self.pdf_show_content_in_browser

    # Filenames for the content, header, and footer templates.
    def get_pdf_template_name(self):
        return self.pdf_template_name

    def get_pdf_header_template(self):
        return self.pdf_header_template

    def get_pdf_footer_template(self):
        return self.pdf_footer_template

    # TemplateResponse classes for PDF and HTML
    def get_pdf_response_class(self):
        return self.pdf_response_class

    def get_pdf_html_response_class(self):
        return self.pdf_html_response_class

    def get_pdf_filename(self):
        return self.pdf_filename

    def get_pdf_cmd_options(self):
        return self.pdf_cmd_options

    def render_to_response(self, context, **response_kwargs):
        """
        Returns a PDF response with a template rendered with the given context.
        """
        pdf_filename = response_kwargs.pop('pdf_filename', None)
        pdf_cmd_options = response_kwargs.pop('pdf_cmd_options', None)

        if self.render_now:
            pdf_response_class = self.get_pdf_response_class()
            from pprint import pprint
            if issubclass(pdf_response_class, PDFTemplateResponse):
                if pdf_filename is None:
                    pdf_filename = self.get_pdf_filename()

                if pdf_cmd_options is None:
                    pdf_cmd_options = self.get_pdf_cmd_options()

                pdf_template_response = PDFTemplateResponse(
                    request=self.request,
                    template=self.pdf_template_name,
                    status=200,
                    context=context,
                    filename=pdf_filename,
                    show_content_in_browser=self.get_pdf_show_content_in_browser(),
                    header_template=self.get_pdf_header_template(),
                    footer_template=self.get_pdf_footer_template(),
                    cmd_options=pdf_cmd_options,
                    **response_kwargs
                )
                if not pdf_template_response:
                    print('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                pprint(dir(pdf_template_response))
                r = pdf_template_response.render() or None
                pdf_file = pdf_template_response.rendered_content()
                print("asdasd")
                print(type(pdf_file))
                # print(type(pdf_file))
                return pdf_template_response
        else:
            return super(PDFRenderMixin, self).render_to_response(
                context=context,
                **response_kwargs
            )


class PDFTemplateView(object):
    """Class-based view for HTML templates rendered to PDF."""

    # Filename for downloaded PDF. If None, the response is inline.
    filename = 'rendered_pdf.pdf'

    # Send file as attachement. If True render content in the browser.
    show_content_in_browser = False

    # Filenames for the content, header, and footer templates.
    template_name = None
    header_template = None
    footer_template = None

    # TemplateResponse classes for PDF and HTML
    response_class = PDFTemplateResponse
    html_response_class = TemplateResponse

    # Command-line options to pass to wkhtmltopdf
    cmd_options = {
        # 'orientation': 'portrait',
        # 'collate': True,
        # 'quiet': None,
    }

    def __init__(self, *args, **kwargs):
        super(PDFTemplateView, self).__init__(*args, **kwargs)

        # Copy self.cmd_options to prevent clobbering the class-level object.
        self.cmd_options = self.cmd_options.copy()

    def get(self, request, *args, **kwargs):
        response = super(PDFTemplateView, self).get(request, *args, **kwargs)
        # response_class = self.response_class

        if request.GET.get('as', '') == 'html':
            # Use the html_response_class if HTML was requested.
            self.response_class = self.html_response_class
        return response

    def get_filename(self):
        return self.filename

    def get_cmd_options(self):
        return self.cmd_options

    def render_to_response(self, context, **response_kwargs):
        """
        Returns a PDF response with a template rendered with the given context.
        """
        filename = response_kwargs.pop('filename', None)
        cmd_options = response_kwargs.pop('cmd_options', None)

        if issubclass(self.response_class, PDFTemplateResponse):
            if filename is None:
                filename = self.get_filename() or 'teste.pdf'

            if cmd_options is None:
                cmd_options = self.get_cmd_options()
            return PDFTemplateResponse(request=self.request, template=self.template_name, context=context,
                                       filename=filename, cmd_options=cmd_options)

        else:
            return super(PDFTemplateView, self).render_to_response(
                context=context,
                **response_kwargs
            )


class PDFRenderView(PDFRenderMixin, generic.DetailView):
    template_name = 'django_documentos/documento_detail.html'
    pdf_content_template_name = 'django_documentos/html_to_pdf_content.html'
    pdf_header_template_name = 'django_documentos/html_to_pdf_header.html'
    pdf_footer_template_name = 'django_documentos/html_to_pdf_footer.html'
    pdf_filename = 'arquivo.pdf'
    pdf_show_content_in_browser = True
    model = Documento

    def get_context_data(self, **kwargs):
        context = super(PDFRenderView, self).get_context_data(**kwargs)
        conteudo = "{}{}{}".format(self.object.conteudo, self.object.versao_numero, self.request.user.username)
        signer = signing.Signer("{}-{}-{}".format(self.object.pk,
                                                  self.object.versao_numero, self.request.user.username))
        documento = signer.sign(conteudo)

        context.update(
            {
                'conteudo': conteudo,
                'conteudo_sign': documento
            }
        )
        return context


class PDFRenderView2(PDFTemplateView, generic.DetailView):
    template_name = 'django_documentos/documento_detail.html'
    pdf_content_template_name = 'django_documentos/html_to_pdf_content.html'
    pdf_header_template_name = 'django_documentos/html_to_pdf_header.html'
    pdf_footer_template_name = 'django_documentos/html_to_pdf_footer.html'
    pdf_filename = 'arquivo.pdf'
    pdf_show_content_in_browser = True
    model = Documento

    def get(self, request, *args, **kwargs):
        return super(PDFRenderView2, self).get(request, *args, **kwargs)

        # def get_context_data(self, **kwargs):
        #     context = super(PDFRenderView2, self).get_context_data(**kwargs)
        #     conteudo = "{}{}{}".format(self.object.conteudo, self.object.versao_numero, self.request.user.username)
        #     signer = signing.Signer("{}-{}-{}".format(self.object.pk,
        #                                               self.object.versao_numero, self.request.user.username))
        #     documento = signer.sign(conteudo)
        #
        #     context.update(
        #         {
        #             'conteudo': conteudo,
        #             'conteudo_sign': documento
        #         }
        #     )
        #     return context
