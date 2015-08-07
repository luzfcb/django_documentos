# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.core.urlresolvers import reverse_lazy
from django.views import generic
from extra_views import CreateWithInlinesView, InlineFormSet, UpdateWithInlinesView

from simple_history.views import HistoryRecordListViewMixin, RevertFromHistoryRecordViewMixin

from .forms import DocumentoFormCreate, DocumentoRevertForm
from .models import Documento


# from .models import DocumentoConteudo

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
        super(NextURLMixin, self).dispatch(request, *args, **kwargs)
        self.next_url = self.get_next_url()


class DocumentoListView(generic.ListView):
    template_name = 'django_documentos/documento_list.html'
    model = Documento


class AuditavelViewMixin(object):
    def form_valid(self, form):
        if not form.instance.criado_por:
            form.instance.criado_por = self.request.user
        form.instance.modificado_por = self.request.user
        return super(AuditavelViewMixin, self).form_valid(form)


# class DocumentoConteudoInline(InlineFormSet):
#     model = DocumentoConteudo
#     can_delete = False


class DocumentoCreateView(NextURLMixin, AuditavelViewMixin, generic.CreateView):
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

        if self.is_popup:
            return reverse_lazy('documentos:close')
        if self.next_url:
            return self.next_url
        return super(DocumentoCreateView, self).get_success_url()

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


class CloseView(generic.TemplateView):
    template_name = 'django_documentos/fechar.html'


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
