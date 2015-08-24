# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import ckeditor.fields


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0007_auto_20150807_0126'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documento',
            name='conteudo',
            field=ckeditor.fields.RichTextField(),
        ),
        migrations.AlterField(
            model_name='documento',
            name='titulo',
            field=models.CharField(max_length=500, editable=False, blank=True),
        ),
        migrations.AlterField(
            model_name='historicaldocumento',
            name='conteudo',
            field=ckeditor.fields.RichTextField(),
        ),
        migrations.AlterField(
            model_name='historicaldocumento',
            name='titulo',
            field=models.CharField(max_length=500, editable=False, blank=True),
        ),
    ]
