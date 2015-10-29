# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0002_auto_20151016_1312'),
    ]

    operations = [
        migrations.AddField(
            model_name='documento',
            name='assinatura_salto',
            field=models.TextField(unique=True, null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocumento',
            name='assinatura_salto',
            field=models.TextField(db_index=True, null=True, editable=False, blank=True),
        ),
        migrations.AlterField(
            model_name='documento',
            name='assinatura_hash',
            field=models.TextField(unique=True, null=True, editable=False, blank=True),
        ),
        migrations.AlterField(
            model_name='historicaldocumento',
            name='assinatura_hash',
            field=models.TextField(db_index=True, null=True, editable=False, blank=True),
        ),
    ]
