# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='documentoconteudo',
            name='criado_por',
        ),
        migrations.RemoveField(
            model_name='documentoconteudo',
            name='documento',
        ),
        migrations.RemoveField(
            model_name='documentoconteudo',
            name='modificado_por',
        ),
        migrations.RemoveField(
            model_name='documentoconteudo',
            name='revertido_por',
        ),
        migrations.RemoveField(
            model_name='historicaldocumentoconteudo',
            name='criado_por',
        ),
        migrations.RemoveField(
            model_name='historicaldocumentoconteudo',
            name='documento',
        ),
        migrations.RemoveField(
            model_name='historicaldocumentoconteudo',
            name='history_user',
        ),
        migrations.RemoveField(
            model_name='historicaldocumentoconteudo',
            name='modificado_por',
        ),
        migrations.RemoveField(
            model_name='historicaldocumentoconteudo',
            name='revertido_por',
        ),
        migrations.AddField(
            model_name='documento',
            name='conteudo',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocumento',
            name='conteudo',
            field=models.TextField(blank=True),
        ),
        migrations.DeleteModel(
            name='DocumentoConteudo',
        ),
        migrations.DeleteModel(
            name='HistoricalDocumentoConteudo',
        ),
    ]
