#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import os
import shutil
import unittest

from django.core.urlresolvers import reverse
from django.test import RequestFactory
from test_plus.test import CBVTestCase, TestCase

from django_documentos.utils import add_querystrings_to_url
from django_documentos.views import DocumentoCreateView, DocumentoListView

"""
test_django_documentos
------------

Tests for `django_documentos` models module.
# flake8: noqa
"""

factory = RequestFactory()


class TestDjangoDocumentos(CBVTestCase):
    def setUp(self):
        # from django_documentos import views
        # self.view = views.DocumentoDashboardView.as_view()
        pass

    def test_create_view_normal(self):
        url = add_querystrings_to_url(reverse('documentos:create'), {'next': '/list/'})
        # response = self.get(DocumentoCreateView, kwargs={'next': '/list/'})
        # self.assertInContext('next_page_url')
        pass

    def test_create_view_popup(self):
        url = add_querystrings_to_url(reverse('documentos:create'), {'popup': 1})
        a = {u'conteudo': u'<p>vaca</p>', u'csrfmiddlewaretoken': u'j2R1FgUclXiSPd4qSxpehtSzkWgkj6Vt', u'proximo': u'/list/?teste=1', u'is_popup': u'True'}

        b = self.post(DocumentoCreateView, data=a)
        print(b)
        # self.assertInContext('next_page_url')

    # def test_special_method(self):
    #     url = add_querystrings_to_url(reverse('documentos:create'), {'popup': 1})
    #     request = RequestFactory().get(url)
    #     instance = self.get_instance(DocumentoCreateView, request=request)
    #
    #     # invoke a MyClass method
    #     result = instance.special_method()
    #
    #     # make assertions
    #     self.assertTrue(result)

    def tearDown(self):
        pass
