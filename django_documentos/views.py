# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import json

from captcha.helpers import captcha_image_url
from captcha.models import CaptchaStore
from django.contrib import messages
from django.contrib.auth.models import AnonymousUser
from django.core import signing
from django.core.exceptions import ImproperlyConfigured
from django.core.urlresolvers import reverse, reverse_lazy
from django.http import HttpResponse, JsonResponse, HttpResponseForbidden
from django.shortcuts import redirect, resolve_url
# from django.utils.http import is_safe_url
from django.views import generic
from django.views.generic.detail import SingleObjectMixin, BaseDetailView

from simple_history.views import HistoryRecordListViewMixin, RevertFromHistoryRecordViewMixin

from .forms import AssinarDocumento, DocumentoFormCreate, DocumentoRevertForm, DocumetoValidarForm
from .models import Documento
from .samples_html import BIG_SAMPLE_HTML  # noqa
from .utils import add_querystrings_to_url


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


class DocumentoAssinadoRedirectMixin(object):
    def get(self, request, *args, **kwargs):
        ret = super(DocumentoAssinadoRedirectMixin, self).get(request, *args, **kwargs)
        if self.object and self.object.esta_ativo:
            # if self.object.esta_assinado:
                detail_url = reverse('documentos:detail', kwargs={'pk': self.object.pk})
                messages.add_message(request, messages.INFO,
                                     'Documentos assinados só podem ser visualizados - {}'.format(self.__class__.__name__))
                return redirect(detail_url, permanent=False)
        return ret


class DocumentoUpdateView(DocumentoAssinadoRedirectMixin, AuditavelViewMixin, generic.UpdateView):
    template_name = 'django_documentos/documento_update.html'
    model = Documento
    form_class = DocumentoFormCreate
    success_url = reverse_lazy('documentos:list')


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
    success_url = reverse_lazy('documentos:validar')

    def get(self, request, *args, **kwargs):
        if self.request.is_ajax() and request.GET and 'refresh_captcha' in request.GET:
            to_json_responce = dict()
            to_json_responce['new_cptch_key'] = CaptchaStore.generate_key()
            to_json_responce['new_cptch_image'] = captcha_image_url(to_json_responce['new_cptch_key'])

            return HttpResponse(json.dumps(to_json_responce), content_type='application/json')
        return super(DocumentoValidacaoView, self).get(request, *args, **kwargs)

    def get_initial(self):
        initial = super(DocumentoValidacaoView, self).get_initial()
        # initial.update({
        #     'codigo_crc': 'ABCD' * 4
        # })
        return initial


class PDFViewer(generic.TemplateView):
    template_name = 'django_documentos/pdf_viewer.html'


class AssinarDocumentoView(DocumentoAssinadoRedirectMixin, AuditavelViewMixin, generic.UpdateView):
    template_name = 'django_documentos/documento_assinar.html'
    form_class = AssinarDocumento
    model = Documento

    success_url = reverse_lazy('documentos:list')

    def get_initial(self):
        initial = super(AssinarDocumentoView, self).get_initial()
        # copia o dicionario, para evitar mudar acidentalmente um dicionario mutavel
        initial = initial.copy()
        user = getattr(self.request, 'user', None)
        if user and user.is_authenticated():
            initial.update({
                'assinado_por': user,
            }
            )
        return initial

    def get_form_kwargs(self):
        kwargs = super(AssinarDocumentoView, self).get_form_kwargs()
        current_logged_user = self.request.user
        kwargs['current_logged_user'] = current_logged_user
        return kwargs

    def form_valid(self, form):
        ret = super(AssinarDocumentoView, self).form_valid(form)
        assinado_por = form.cleaned_data.get('assinado_por', None)

        msg = 'Documento n°{} assinado com sucesso por {}'.format(self.object.identificador_versao,
                                                                  assinado_por.get_full_name().title())
        messages.add_message(self.request, messages.INFO, msg)
        return ret

    def get_success_url(self):
        detail_url = reverse('documentos:assinar', kwargs={'pk': self.object.pk})
        return detail_url


class AssinarDocumentoView2(generic.UpdateView):
    template_name = 'django_documentos/documento_assinar.html'
    # form_class = AssinarDocumento
    model = Documento
    fields = ('conteudo', )

    success_url = reverse_lazy('documentos:list')

    def get_form_kwargs(self):
        kwargs = super(AssinarDocumentoView2, self).get_form_kwargs()
        current_logged_user = self.request.user
        # kwargs['current_logged_user'] = current_logged_user
        return kwargs

