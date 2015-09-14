# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0003_auto_20150914_1354'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documento',
            name='assinado',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='historicaldocumento',
            name='assinado',
            field=models.BooleanField(default=False),
        ),
    ]
