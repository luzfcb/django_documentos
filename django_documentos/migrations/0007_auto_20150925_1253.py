# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0006_auto_20150922_1412'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documento',
            name='assinatura_removida_por',
            field=models.ForeignKey(related_name='django_documentos_documento_assinatura_removida_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
