# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='documentolock',
            name='bloqueado_por_full_name',
            field=models.CharField(max_length=500, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='documentolock',
            name='bloqueado_por_user_name',
            field=models.CharField(max_length=500, editable=False, blank=True),
        ),
    ]
