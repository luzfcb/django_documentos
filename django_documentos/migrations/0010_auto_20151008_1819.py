# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0009_auto_20151008_1819'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documento',
            name='assinatura_hash',
            field=models.TextField(editable=False, blank=True),
        ),
        migrations.AlterField(
            model_name='historicaldocumento',
            name='assinatura_hash',
            field=models.TextField(editable=False, blank=True),
        ),
    ]
