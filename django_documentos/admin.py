# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.contrib import admin

from simple_history.admin import SimpleHistoryAdmin

from . import models


@admin.register(models.Documento)
class DocumentContentAdmin(SimpleHistoryAdmin):
    list_display = ['titulo', ]
