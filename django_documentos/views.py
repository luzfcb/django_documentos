# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.core.urlresolvers import reverse_lazy
from django.views import generic
from simple_history.views import HistoryRecordListViewMixin, RevertFromHistoryRecordViewMixin

from .forms import DocumentoFormCreate, DocumentoRevertForm
from .models import Documento


class DocumentoGeneralDashboardView(generic.TemplateView):
    template_name = 'django_documentos/dashboard_general.html'


class DocumentoDashboardView(generic.TemplateView):
    template_name = 'django_documentos/dashboard.html'

    def get_context_data(self, **kwargs):
        context = super(DocumentoDashboardView, self).get_context_data(**kwargs)
        context['quantidade_documentos_cadastrados'] = Documento.objects.all().count()
        context['quantidade_meus_documentos'] = Documento.objects.all().filter(criado_por=self.request.user).count()
        return context


class DocumentoListView(generic.ListView):
    template_name = 'django_documentos/documento_list.html'
    model = Documento


class DocumentoCreateView(generic.CreateView):
    template_name = 'django_documentos/documento_create.html'
    model = Documento
    form_class = DocumentoFormCreate
    success_url = reverse_lazy('documentos:list')

    def form_valid(self, form):
        obj = form.save(commit=False)
        obj.criado_por = self.request.user
        return super(DocumentoCreateView, self).form_valid(form)


class DocumentoDetailView(generic.DetailView):
    template_name = 'django_documentos/documento_detail.html'
    model = Documento


class DocumentoUpdateView(generic.UpdateView):
    template_name = 'django_documentos/documento_update.html'
    model = Documento
    form_class = DocumentoFormCreate
    success_url = reverse_lazy('documentos:list')

    def form_valid(self, form):
        obj = form.save(commit=False)
        obj.modificado_por = self.request.user
        return super(DocumentoUpdateView, self).form_valid(form)


class DocumentoHistoryView(HistoryRecordListViewMixin, generic.DetailView):
    template_name = 'django_documentos/documento_detail_with_versions.html'
    model = Documento
    history_records_paginate_by = 2


class DocumentoRevertView(RevertFromHistoryRecordViewMixin, generic.UpdateView):
    template_name = 'django_documentos/documento_revert.html'
    model = Documento
    form_class = DocumentoRevertForm

    def get_success_url(self):
        sucess_url = reverse_lazy('documentos:detail', {'pk': self.get_object().pk})
        print(sucess_url)
        return sucess_url

    def form_valid(self, form):
        obj = form.save(commit=False)
        obj.revertido_por = self.request.user
        obj.revertido_da_versao = obj.versao_numero
        return super(DocumentoRevertView, self).form_valid(form)
