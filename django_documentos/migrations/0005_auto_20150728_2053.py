# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0004_auto_20150728_2041'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documento',
            name='conteudo',
            field=models.TextField(verbose_name='Conteudo', blank=True),
        ),
        migrations.AlterField(
            model_name='historicaldocumento',
            name='conteudo',
            field=models.TextField(verbose_name='Conteudo', blank=True),
        ),
    ]
