# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0006_auto_20151001_2006'),
    ]

    operations = [
        migrations.AddField(
            model_name='docteste',
            name='versao_numero',
            field=models.IntegerField(default=1, editable=False, auto_created=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='versao_numero',
            field=models.IntegerField(default=1, editable=False, auto_created=True),
        ),
    ]
