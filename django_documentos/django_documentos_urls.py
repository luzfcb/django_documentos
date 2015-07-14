# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.conf.urls import url

from django_documentos.views import (
    DocumentoCreateView, DocumentoDetailView, DocumentoHistoryView, DocumentoHomeView, DocumentoListView,
    DocumentoRevertView, DocumentoUpdateView,
)

urlpatterns = [
    url(r'^$',
        DocumentoHomeView.as_view(),
        name='documento_home'
        ),
    url(r'^list/$',
        DocumentoListView.as_view(),
        name='documento_list'
        ),
    url(r'^create/$',
        DocumentoCreateView.as_view(),
        name='documento_create'
        ),
    url(r'^detail/(?P<pk>\d+)/$',
        DocumentoDetailView.as_view(),
        name='documento_detail'
        ),
    url(r'^update/(?P<pk>\d+)/$',
        DocumentoUpdateView.as_view(),
        name='documento_update'
        ),
    url(r'^history/(?P<pk>\d+)/$',
        DocumentoHistoryView.as_view(),
        name='documento_history'
        ),
    url(r'^revert/(?P<pk>\d+)/$',
        DocumentoRevertView.as_view(),
        name='documento_revert'
        ),

]
