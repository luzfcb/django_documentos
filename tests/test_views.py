#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import os
import shutil
import unittest

from django.test import RequestFactory, TestCase

"""
test_django_documentos
------------

Tests for `django_documentos` models module.
# flake8: noqa
"""




factory = RequestFactory()


class TestDjango_documentos(TestCase):

    def setUp(self):
        from django_documentos import views
        self.view = views.DocumentoDashboardView.as_view()

    def test_something(self):
        pass

    def tearDown(self):
        pass
