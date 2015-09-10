# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='documento',
            name='cabecalho',
        ),
        migrations.RemoveField(
            model_name='documento',
            name='rodape',
        ),
        migrations.RemoveField(
            model_name='historicaldocumento',
            name='cabecalho',
        ),
        migrations.RemoveField(
            model_name='historicaldocumento',
            name='rodape',
        ),
    ]
