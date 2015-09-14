# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0002_auto_20150910_1813'),
    ]

    operations = [
        migrations.AddField(
            model_name='documento',
            name='assinado',
            field=models.BooleanField(default=False, editable=False),
        ),
        migrations.AddField(
            model_name='historicaldocumento',
            name='assinado',
            field=models.BooleanField(default=False, editable=False),
        ),
    ]
