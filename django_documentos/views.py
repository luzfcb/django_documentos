# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ImproperlyConfigured
from django.core.urlresolvers import reverse, reverse_lazy
from django.http import JsonResponse
from django.shortcuts import resolve_url
# from django.utils.http import is_safe_url
from django.views import generic

from simple_history.views import HistoryRecordListViewMixin, RevertFromHistoryRecordViewMixin

from .forms import DocumentoFormCreate, DocumentoRevertForm
from .models import Documento
from .utils import add_querystrings_to_url


TEXTO_TESTE = """
<p style="text-align:center"><img alt="" src="data:image/png;base64,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" style="height:97px; margin-bottom:0px; margin-left:0px; margin-right:0px; margin-top:0px; width:95px" /></p>

<p style="text-align:center">DEFENSORIA P&Uacute;BLICA DO ESTADO DO TOCANTINS</p>

<p style="text-align:center">Quadra 502 Sul, Avenida Joaquim Teot&ocirc;nio Segurado - Bairro Plano Diretor Sul - CEP 77021-654 - Palmas - TO - www.defensoria.to.gov.br</p>

<p style="text-align:center"><strong>MEMORANDO</strong></p>

<p>&nbsp;</p>

<p>&nbsp;</p>

<p>Texto Normal, seguido de um texto <strong>negrito</strong>, um texto em <em>it&aacute;lico</em>, um texto <u>sublinhado</u>&nbsp;e uma imagem&nbsp;</p>

<p>&nbsp;</p>

<p>&nbsp;</p>

<p>&nbsp;</p>

<hr />
<table border="0" cellpadding="2" cellspacing="0" style="width:100%">
    <tbody>
        <tr>
            <td>15.0.000000315-5</td>
            <td style="text-align: right;">0011187v3</td>
            </tr>
        </tbody>
</table>

"""  # noqa


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
        initial.update({'is_popup': self.get_is_popup(), 'conteudo': TEXTO_TESTE})
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


class DocumentoUpdateView(AuditavelViewMixin, generic.UpdateView):
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

    def form_valid(self, form):
        if hasattr(self.request, 'user') and not isinstance(self.request.user, AnonymousUser):
            form.instance.revertido_por = self.request.user
            form.instance.revertido_da_versao = form.instance.versao_numero
        return super(DocumentoRevertView, self).form_valid(form)
