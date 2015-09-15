# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0004_auto_20150914_1356'),
    ]

    operations = [
        migrations.AddField(
            model_name='documento',
            name='assinatura',
            field=models.TextField(editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocumento',
            name='assinatura',
            field=models.TextField(editable=False, blank=True),
        ),
    ]
