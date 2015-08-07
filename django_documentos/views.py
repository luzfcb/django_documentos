# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.core.urlresolvers import reverse_lazy, reverse
from django.http import JsonResponse
from django.shortcuts import redirect
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
        print('get_next_kwarg')
        return self.next_kwarg

    def get_next_url(self):
        next_kwarg = self.get_next_kwarg()
        next_url = self.kwargs.get(next_kwarg) or self.request.GET.get(next_kwarg)
        print('next_url: {}'.format(next_url))
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

        return context


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
        print("get_success_url of {}".format(id(self)))
        document_param = "?documment={}".format(self.object.pk)
        if not self.is_popup and self.next_url:
            return "{}{}".format(self.next_url, document_param)

        if not self.next_url:
            return reverse('documentos:detail', {'pk': self.object.pk})

        return '{}?{}={}'.format(reverse_lazy('documentos:close'), self.next_kwarg, "{}{}".format(self.next_url, document_param))

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
        print(form)
        return form


class CloseView(NextURLMixin, generic.TemplateView):
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
