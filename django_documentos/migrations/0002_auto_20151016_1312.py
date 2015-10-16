# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documento',
            name='titulo',
            field=models.CharField(max_length=500, blank=True),
        ),
        migrations.AlterField(
            model_name='historicaldocumento',
            name='titulo',
            field=models.CharField(max_length=500, blank=True),
        ),
    ]
