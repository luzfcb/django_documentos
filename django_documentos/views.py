# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
from tempfile import NamedTemporaryFile
from django.conf import settings

from django.contrib import messages
from django.contrib.auth.models import AnonymousUser
from django.core import signing
from django.core.exceptions import ImproperlyConfigured
from django.core.urlresolvers import reverse, reverse_lazy
from django.http import JsonResponse
from django.shortcuts import redirect, resolve_url
# from django.utils.http import is_safe_url
from django.template.response import TemplateResponse
from django.utils.encoding import smart_text
from django.views import generic
from django.views.generic import TemplateView
from django.views.generic.detail import SingleObjectTemplateResponseMixin, SingleObjectMixin, BaseDetailView
from wkhtmltopdf import wkhtmltopdf, make_absolute_paths
from wkhtmltopdf.views import PDFResponse

from simple_history.views import HistoryRecordListViewMixin, RevertFromHistoryRecordViewMixin

from .forms import DocumentoFormCreate, DocumentoRevertForm, DocumetoValidarForm
from .models import Documento
from .samples_html import BIG_SAMPLE_HTML  # noqa
from .utils import add_querystrings_to_url


# from wkhtmltopdf.views import PDFTemplateView


# from .models import DocumentoConteudo

class AjaxableResponseMixin(object):
    """
    Mixin to add AJAX support to a form.
    Must be used with an object-based FormView (e.g. CreateView)
    """

    def form_invalid(self, form):
        response = super(AjaxableResponseMixin, self).form_invalid(form)
        if self.request.is_ajax():
            return JsonResponse(form.errors, status=400)
        else:
            return response

    def form_valid(self, form):
        # We make sure to call the parent's form_valid() method because
        # it might do some processing (in the case of CreateView, it will
        # call form.save() for example).
        response = super(AjaxableResponseMixin, self).form_valid(form)
        if self.request.is_ajax():
            print('eh ajax')
            data = {
                'pk': self.object.pk,
            }
            return JsonResponse(data)
        else:
            return response


class DocumentoGeneralDashboardView(generic.TemplateView):
    template_name = 'django_documentos/dashboard_general.html'


class DocumentoDashboardView(generic.TemplateView):
    template_name = 'django_documentos/dashboard.html'

    def get_context_data(self, **kwargs):
        context = super(DocumentoDashboardView, self).get_context_data(**kwargs)
        quantidade_documentos_cadastrados = None
        quantidade_meus_documentos = None
        if self.request.user.is_authenticated():
            quantidade_meus_documentos = Documento.objects.all().filter(criado_por=self.request.user).count()
            quantidade_documentos_cadastrados = Documento.objects.all().count()
        context['quantidade_documentos_cadastrados'] = quantidade_documentos_cadastrados
        context['quantidade_meus_documentos'] = quantidade_meus_documentos
        return context


class NextURLMixin(generic.View):
    next_kwarg_name = 'next'
    next_page_url = None

    def get_next_kwarg_name(self):
        if not hasattr(self, 'next_kwarg_name'):
            raise ImproperlyConfigured(
                '{0} is missing an next_kwarg_name.'
                ' Define '
                '{0}.next_kwarg_name or override '
                '{0}.get_next_kwarg_name().'.format(
                    self.__class__.__name__))
        return self.next_kwarg_name

    def get_next_page_url(self):
        next_kwarg_name = self.get_next_kwarg_name()
        next_page = None

        if not hasattr(self, 'next_page_url'):
            raise ImproperlyConfigured(
                '{0} is missing an next_page_url '
                'url to redirect to. Define '
                '{0}.next_page_url or override '
                '{0}.get_next_page_url().'.format(
                    self.__class__.__name__))

        if self.next_page_url is not None:
            print('if self.next_page_url is not None:')
            next_page = resolve_url(self.next_page_url)

        if next_kwarg_name in self.request.POST or next_kwarg_name in self.request.GET:
            print('if next_kwarg_name in self.request.POST or next_kwarg_name in self.request.GET: id:', id(self))
            next_page = self.request.POST.get(next_kwarg_name,
                                              self.request.GET.get(next_kwarg_name))
            # Security check -- don't allow redirection to a different host.
            # if not is_safe_url(url=next_page, host=self.request.get_host()):
            #     next_page = self.request.path

        return next_page

    # def dispatch(self, request, *args, **kwargs):
    #     ret = super(NextURLMixin, self).dispatch(request, *args, **kwargs)
    #
    #
    #     return ret
    def form_valid(self, form):
        self.next_page_url = form.cleaned_data.get('proximo')
        return super(NextURLMixin, self).form_valid(form)

    def get_initial(self):
        initial = super(NextURLMixin, self).get_initial()
        initial.update({'proximo': self.get_next_page_url()})
        return initial

    def post(self, request, *args, **kwargs):
        ret = super(NextURLMixin, self).post(request, *args, **kwargs)
        self.next_page_url = self.get_next_page_url()
        return ret

    #
    def get(self, *args, **kwargs):
        ret = super(NextURLMixin, self).get(*args, **kwargs)
        self.next_page_url = self.get_next_page_url()
        return ret

    def get_context_data(self, **kwargs):
        context = super(NextURLMixin, self).get_context_data(**kwargs)
        context['next_kwarg_name'] = self.next_kwarg_name  # self.get_next_kwarg_name()
        context['next_page_url'] = self.next_page_url or self.get_next_page_url()
        # context['next_url2'] = self.request.build_absolute_uri(self.get_next_page_url())
        return context


class DocumentoListView(generic.ListView):
    template_name = 'django_documentos/documento_list.html'
    model = Documento

    def render_to_response(self, context, **response_kwargs):
        rend = super(DocumentoListView, self).render_to_response(context, **response_kwargs)
        return rend


class AuditavelViewMixin(object):
    def form_valid(self, form):
        if hasattr(self.request, 'user') and not isinstance(self.request.user, AnonymousUser):
            if not form.instance.criado_por:
                form.instance.criado_por = self.request.user
            form.instance.modificado_por = self.request.user
        return super(AuditavelViewMixin, self).form_valid(form)


# def set_query_parameter(url, pairs):
#     """Given a URL, set or replace a query parameter and return the
#     modified URL.
#
#     >>> set_query_parameter('http://example.com?foo=bar&biz=baz', 'foo', 'stuff')
#     'http://example.com?foo=stuff&biz=baz'
#
#     """
#
#     # url2 = uri_to_iri(url)
#     scheme, netloc, path, query_string, fragment = urlsplit(url)
#     query_params = parse_qs(query_string)
#
#     # query_params[param_name] = [param_value]
#     query_params.update(
#         pairs
#     )
#     new_query_string = urlencode(query_params, doseq=True)
#     # teste = uri_to_iri(new_query_string)
#
#     new_url = urlunsplit((scheme, netloc, path, new_query_string, fragment))
#     print('--------------')
#     pprint(locals())
#     print('--------------')
#     return new_url


# def url_path_join(*parts):
#     """Normalize url parts and join them with a slash."""
#     schemes, netlocs, paths, queries, fragments = zip(*(urlsplit(part) for part in parts))
#     scheme, netloc, query, fragment = first_of_each(schemes, netlocs, queries, fragments)
#     path = '/'.join(x.strip('/') for x in paths if x)
#     return urlunsplit((scheme, netloc, path, query, fragment))
#
#
# def first_of_each(*sequences):
#     return (next((x for x in sequence if x), '') for sequence in sequences)

# def add_get_args_to_url(url, arg_dict):
#     # import urllib
#     # urllib.quote_plus()
#     url_parts = urlparse(url)
#
#     qs_args = parse_qs(url_parts[4])
#     qs_args.update(arg_dict)
#
#     new_qs = urlencode(qs_args, True)
#
#     ret = urlunparse(list(url_parts[0:4]) + [new_qs] + list(url_parts[5:]))
#     #pprint(locals(), indent=4)
#     return ret

class DocumentoCreateView(AjaxableResponseMixin, NextURLMixin, AuditavelViewMixin, generic.CreateView):
    template_name = 'django_documentos/documento_create.html'
    model = Documento
    form_class = DocumentoFormCreate
    success_url = reverse_lazy('documentos:list')
    is_popup = False
    # inlines = [DocumentoConteudoInline, ]

    def __init__(self, *args, **kwargs):
        super(DocumentoCreateView, self).__init__(*args, **kwargs)
        print('id: {}'.format(id(self)))

    def get_success_url(self):
        next_kwarg_name = self.get_next_kwarg_name()
        next_page_url = self.get_next_page_url()
        is_popup = self.get_is_popup()

        document_param_name = 'document'
        document_param_value = self.object.pk

        doc = {
            document_param_name: document_param_value
        }

        next_url = add_querystrings_to_url(next_page_url, doc)
        if not is_popup and next_page_url:
            print('aqui')
            return next_url

        if not next_page_url:
            return reverse('documentos:detail', {'pk': self.object.pk})

        close_url = add_querystrings_to_url(reverse('documentos:close'), {next_kwarg_name: next_url})

        return close_url

    def get_initial(self):
        initial = super(DocumentoCreateView, self).get_initial()
        initial.update({'is_popup': self.get_is_popup(),
                        'conteudo': BIG_SAMPLE_HTML}
                       )
        return initial

    def get_is_popup(self):
        if self.request.GET.get('popup', False):
            self.is_popup = True
        else:
            self.is_popup = False
        return self.is_popup

    def get_context_data(self, **kwargs):
        context = super(DocumentoCreateView, self).get_context_data(**kwargs)
        context['popup'] = self.get_is_popup()
        return context

    def get_form(self, form_class=None):
        form = super(DocumentoCreateView, self).get_form(form_class=form_class)
        # print(form)
        return form


class CloseView(NextURLMixin, generic.TemplateView):
    template_name = 'django_documentos/fechar.html'

    def get_context_data(self, **kwargs):
        context = super(CloseView, self).get_context_data(**kwargs)

        return context


class DocumentoDetailView(generic.DetailView):
    template_name = 'django_documentos/documento_detail.html'
    model = Documento

    def get_context_data(self, **kwargs):
        context = super(DocumentoDetailView, self).get_context_data(**kwargs)
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


class DocumentoAssinadoRedirectMixin(generic.UpdateView):
    def dispatch(self, request, *args, **kwargs):
        ret = super(DocumentoAssinadoRedirectMixin, self).dispatch(request, *args, **kwargs)
        if self.object and self.object.esta_ativo and self.object.assinado:
            detail_url = reverse('documentos:detail', kwargs={'pk': self.object.pk})
            messages.add_message(request, messages.INFO, 'Documentos assinados só podem ser visualizados')
            return redirect(detail_url, permanent=False)
        return ret


class DocumentoUpdateView(DocumentoAssinadoRedirectMixin, AuditavelViewMixin, generic.UpdateView):
    template_name = 'django_documentos/documento_update.html'
    model = Documento
    form_class = DocumentoFormCreate
    success_url = reverse_lazy('documentos:list')
    # inlines = [DocumentoConteudoInline, ]


class DocumentoHistoryView(HistoryRecordListViewMixin, generic.DetailView):
    template_name = 'django_documentos/documento_detail_with_versions.html'
    model = Documento
    history_records_paginate_by = 2


class DocumentoRevertView(RevertFromHistoryRecordViewMixin, AuditavelViewMixin, generic.UpdateView):
    template_name = 'django_documentos/documento_revert.html'
    model = Documento
    form_class = DocumentoRevertForm
    # inlines = [DocumentoConteudoInline, ]

    def get_success_url(self):
        pk = self.get_object().pk
        sucess_url = reverse_lazy('documentos:detail', kwargs={'pk': pk})
        # print(sucess_url)
        return sucess_url

    def get_context_data(self, **kwargs):
        context = super(DocumentoRevertView, self).get_context_data(**kwargs)

        context.update({
            'object': self.object
        })
        return context

    def form_valid(self, form):
        if hasattr(self.request, 'user') and not isinstance(self.request.user, AnonymousUser):
            form.instance.revertido_por = self.request.user
            form.instance.revertido_da_versao = form.instance.versao_numero
        return super(DocumentoRevertView, self).form_valid(form)


class DocumentoValidacaoView(generic.FormView):
    template_name = 'django_documentos/documento_validacao.html'
    form_class = DocumetoValidarForm


#
# class DocumentoPDFView(PDFTemplateView, DocumentoDetailView):
#     pass

class PDFViewer(generic.TemplateView):
    template_name = 'django_documentos/pdf_viewer.html'


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
