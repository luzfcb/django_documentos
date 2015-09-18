# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.conf.urls import include, url

from django_documentos.views import (
    CloseView, DocumentoCreateView, DocumentoDashboardView, DocumentoDetailView, DocumentoGeneralDashboardView,
    DocumentoHistoryView, DocumentoListView, DocumentoRevertView, DocumentoUpdateView, DocumentoValidacaoView,
    PDFRenderView, PDFViewer,
    PDFRenderView2)

from .settings import DJANGO_DOCUMENTOS_ENABLE_GENERAL_DASHBOARD

urlpatterns = [
    url(r'^$',
        DocumentoDashboardView.as_view(),
        name='dashboard'
        ),
    url(r'^list/$',
        DocumentoListView.as_view(),
        name='list'
        ),
    # url(r'^create/$',
    #     DocumentoCreateView.as_view(),
    #     name='create'
    #     ),
    url(r'^d/create/$',
        DocumentoCreateView.as_view(),
        name='create'
        ),
    url(r'^detail/(?P<pk>\d+)/$',
        DocumentoDetailView.as_view(),
        name='detail'
        ),
    url(r'^update/(?P<pk>\d+)/$',
        DocumentoUpdateView.as_view(),
        name='update'
        ),
    url(r'^history/(?P<pk>\d+)/$',
        DocumentoHistoryView.as_view(),
        name='history'
        ),
    url(r'^revert/(?P<pk>\d+)/$',
        DocumentoRevertView.as_view(),
        name='revert'
        ),
    url(r'^close/$',
        CloseView.as_view(),
        name='close'
        ),
    url(r'^captcha/$',
        include('captcha.urls'),
        name='captcha'
        ),
    url(r'^v|validar/$',
        DocumentoValidacaoView.as_view(),
        name='validar'
        ),
    url(r'^pdf-file/$',
        PDFViewer.as_view(),
        name='pdf_view'
        ),
    url(r'^pdf/(?P<pk>\d+)/$',
        PDFRenderView.as_view(),
        name='pdf_view'
        ),
    url(r'^pdf2/(?P<pk>\d+)/$',
        PDFRenderView2.as_view(),
        name='pdf_view2'
        )
]

if DJANGO_DOCUMENTOS_ENABLE_GENERAL_DASHBOARD:
    urlpatterns += [
        url(r'^all$',
            DocumentoGeneralDashboardView.as_view(),
            name='dashboard_general'
            ),
    ]
