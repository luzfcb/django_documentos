# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import ckeditor.fields


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0003_auto_20150728_1740'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documento',
            name='conteudo',
            field=ckeditor.fields.RichTextField(verbose_name='Conteudo'),
        ),
        migrations.AlterField(
            model_name='historicaldocumento',
            name='conteudo',
            field=ckeditor.fields.RichTextField(verbose_name='Conteudo'),
        ),
    ]
