# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.core.urlresolvers import reverse_lazy, reverse
from django.http import JsonResponse
from django.shortcuts import redirect
from django.utils.encoding import iri_to_uri
from django.views import generic
from extra_views import CreateWithInlinesView, InlineFormSet, UpdateWithInlinesView

from simple_history.views import HistoryRecordListViewMixin, RevertFromHistoryRecordViewMixin

from .forms import DocumentoFormCreate, DocumentoRevertForm
from .models import Documento


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


class NextURLMixin(object):
    next_kwarg = 'next'
    next_url = None

    def get_next_kwarg(self):
        return self.next_kwarg

    def get_next_url(self):
        next_kwarg = self.get_next_kwarg()
        next_url = self.kwargs.get(next_kwarg) or self.request.GET.get(next_kwarg)
        return next_url

    def dispatch(self, request, *args, **kwargs):
        ret = super(NextURLMixin, self).dispatch(request, *args, **kwargs)
        self.next_url = self.get_next_url()
        if self.request.method in ('POST', 'PUT'):
            print('self.kwargs: {}'.format(self.kwargs))
            print('self.request.GET: {}'.format(self.request.GET))
        else:
            print('eh get')
        return ret

    def get_context_data(self, **kwargs):
        context = super(NextURLMixin, self).get_context_data(**kwargs)
        context['next_kwarg'] = self.get_next_kwarg()
        context['next_url'] = self.get_next_url()
        context['next_url2'] = self.request.build_absolute_uri(self.get_next_url())
        return context


class DocumentoListView(generic.ListView):
    template_name = 'django_documentos/documento_list.html'
    model = Documento

    def render_to_response(self, context, **response_kwargs):
        rend = super(DocumentoListView, self).render_to_response(context, **response_kwargs)
        return rend


class AuditavelViewMixin(object):
    def form_valid(self, form):
        if not form.instance.criado_por:
            form.instance.criado_por = self.request.user
        form.instance.modificado_por = self.request.user
        return super(AuditavelViewMixin, self).form_valid(form)


from urllib import urlencode
from urlparse import parse_qs, urlsplit, urlunsplit


def set_query_parameter(url, pairs):
    """Given a URL, set or replace a query parameter and return the
    modified URL.

    >>> set_query_parameter('http://example.com?foo=bar&biz=baz', 'foo', 'stuff')
    'http://example.com?foo=stuff&biz=baz'

    """
    scheme, netloc, path, query_string, fragment = urlsplit(url)
    query_params = parse_qs(query_string)

    #query_params[param_name] = [param_value]
    query_params.update(
        pairs
    )
    new_query_string = urlencode(query_params, doseq=True)

    return urlunsplit((scheme, netloc, path, new_query_string, fragment))


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
        # print("get_success_url of {}".format(id(self)))
        # document_param = "?document={}".format(self.object.pk)

        document_param_name = 'document'
        document_param_value = self.object.pk

        doc = {
            document_param_name: document_param_value
        }
        next_url = set_query_parameter(self.get_next_url(), doc)
        if not self.is_popup and self.get_next_url():
            return next_url

        if not self.get_next_url():
            return reverse('documentos:detail', {'pk': self.object.pk})

        close_view_url = set_query_parameter(reverse_lazy('documentos:close'), {self.next_kwarg: next_url})
        close_view_url = self.request.build_absolute_uri(close_view_url)
        return close_view_url

    def form_valid(self, form):
        self.next_url = form.cleaned_data.get('proximo')
        return super(NextURLMixin, self).form_valid(form)

    def get_is_popup(self):
        if self.request.GET.get('popup', False):
            self.is_popup = True
        else:
            self.is_popup = False
        return self.is_popup

    def get_initial(self):
        initial = super(DocumentoCreateView, self).get_initial()
        initial.update({'proximo': self.get_next_url(), 'is_popup': self.get_is_popup()})
        return initial

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
        sucess_url = reverse_lazy('documentos:detail', {'pk': self.get_object().pk}, )
        print(sucess_url)
        return sucess_url

    def form_valid(self, form):
        form.instance.revertido_por = self.request.user
        form.instance.revertido_da_versao = form.instance.versao_numero
        return super(DocumentoRevertView, self).form_valid(form)
