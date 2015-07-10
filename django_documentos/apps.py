# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class DjangoDocumentosAppConfig(AppConfig):
    name = 'django_documentos'
    verbose_name = _('Documentos')
