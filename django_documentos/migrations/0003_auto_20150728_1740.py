# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import redactor.fields


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0002_auto_20150728_1448'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documento',
            name='conteudo',
            field=redactor.fields.RedactorField(verbose_name='Conteudo'),
        ),
        migrations.AlterField(
            model_name='historicaldocumento',
            name='conteudo',
            field=redactor.fields.RedactorField(verbose_name='Conteudo'),
        ),
    ]
