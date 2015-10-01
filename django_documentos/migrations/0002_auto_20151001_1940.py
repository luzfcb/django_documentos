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
            name='assinado_em',
        ),
        migrations.RemoveField(
            model_name='documento',
            name='assinado_por',
        ),
        migrations.RemoveField(
            model_name='documento',
            name='assinatura_hash',
        ),
        migrations.RemoveField(
            model_name='documento',
            name='assinatura_removida_em',
        ),
        migrations.RemoveField(
            model_name='documento',
            name='assinatura_removida_por',
        ),
        migrations.RemoveField(
            model_name='documento',
            name='esta_assinado',
        ),
        migrations.RemoveField(
            model_name='historicaldocumento',
            name='assinado_em',
        ),
        migrations.RemoveField(
            model_name='historicaldocumento',
            name='assinado_por',
        ),
        migrations.RemoveField(
            model_name='historicaldocumento',
            name='assinatura_hash',
        ),
        migrations.RemoveField(
            model_name='historicaldocumento',
            name='assinatura_removida_em',
        ),
        migrations.RemoveField(
            model_name='historicaldocumento',
            name='assinatura_removida_por',
        ),
        migrations.RemoveField(
            model_name='historicaldocumento',
            name='esta_assinado',
        ),
    ]
