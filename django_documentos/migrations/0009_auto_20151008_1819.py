# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0008_auto_20151001_2042'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='documento',
            options={'ordering': ['criado_em'], 'permissions': (('pode_criar_documento', 'Pode Criar documento'), ('pode_editar_documento', 'Pode Editar documento'), ('pode_assinar_documento', 'Pode Assinar documento'), ('pode_desativar_documento', 'Pode Desativar documento'), ('pode_visualizar_versoes_anteriores_documento', 'Pode Visualizar versoes anteriores de documento'), ('pode_reverter_para_uma_versao_anterior_documento', 'Pode Reverter documento para uma vers\xe3o anterior'), ('pode_imprimir', 'Pode Imprimir documento'))},
        ),
        migrations.AlterField(
            model_name='documento',
            name='assinatura_hash',
            field=models.CharField(max_length=40),
        ),
        migrations.AlterField(
            model_name='historicaldocumento',
            name='assinatura_hash',
            field=models.CharField(max_length=40),
        ),
    ]
