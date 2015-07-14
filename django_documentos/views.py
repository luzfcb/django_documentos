# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.core.urlresolvers import reverse_lazy
from django.views import generic

from django_documentos.forms import DocumentoForm, DocumentoRevertForm
from simple_history.views import HistoryRecordListViewMixin, RevertFromHistoryRecordViewMixin

from .models import Documento


class DocumentoHomeView(generic.TemplateView):
    template_name = 'django_documentos/home.html'


class DocumentoListView(generic.ListView):
    model = Documento


class DocumentoCreateView(generic.CreateView):
    model = Documento
    form_class = DocumentoForm
    success_url = reverse_lazy('documento_list')


class DocumentoDetailView(generic.DetailView):
    model = Documento


class DocumentoUpdateView(generic.UpdateView):
    model = Documento
    form_class = DocumentoForm
    success_url = reverse_lazy('documento_list')


class DocumentoHistoryView(HistoryRecordListViewMixin, generic.DetailView):
    model = Documento


class DocumentoRevertView(RevertFromHistoryRecordViewMixin, generic.UpdateView):
    model = Documento
    form_class = DocumentoRevertForm

    def get_success_url(self):
        return reverse_lazy('documento_detail', {'pk': self.get_object().pk})
