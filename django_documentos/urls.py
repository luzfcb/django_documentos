# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^home/$',
        views.DocumentoHomeView.as_view(),
        name='documento_home'
        ),
    url(r'^list/$',
        views.DocumentoListView.as_view(),
        name='documento_list'
        ),
    url(r'^create/$',
        views.DocumentoCreateView.as_view(),
        name='documento_create'
        ),
    url(r'^detail/(?P<pk>\d+)/$',
        views.DocumentoDetailView.as_view(),
        name='documento_detail'
        ),
    url(r'^update/(?P<pk>\d+)/$',
        views.DocumentoUpdateView.as_view(),
        name='documento_update'
        ),
    url(r'^history/(?P<pk>\d+)/$',
        views.DocumentoHistoryView.as_view(),
        name='documento_history'
        ),
    url(r'^revert/(?P<pk>\d+)/$',
        views.DocumentoRevertView.as_view(),
        name='documento_revert'
        ),

]
