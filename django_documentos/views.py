# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.core.urlresolvers import reverse_lazy
from django.views import generic
from simple_history.views import HistoryRecordListViewMixin, RevertFromHistoryRecordViewMixin

from . import forms, models


class DocumentoHomeView(generic.TemplateView):
    pass


class DocumentoListView(generic.ListView):
    model = models.Documento


class DocumentoCreateView(generic.CreateView):
    model = models.Documento
    form_class = forms.DocumentoForm
    success_url = reverse_lazy('documento_list')


class DocumentoDetailView(generic.DetailView):
    model = models.Documento

class DocumentoUpdateView(generic.UpdateView):
    model = models.Documento
    form_class = forms.DocumentoForm
    success_url = reverse_lazy('documento_list')

class DocumentoHistoryView(HistoryRecordListViewMixin, generic.DetailView):
    model = models.Documento



class DocumentoRevertView(RevertFromHistoryRecordViewMixin, generic.UpdateView):
    model = models.Documento
    form_class = forms.DocumentoRevertForm

    def get_success_url(self):
        return reverse_lazy('documento_detail', {'pk': self.get_object().pk})
