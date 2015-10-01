# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('django_documentos', '0007_auto_20151001_2008'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='docteste',
            name='assinado_por',
        ),
        migrations.RemoveField(
            model_name='docteste',
            name='assinatura_removida_por',
        ),
        migrations.RemoveField(
            model_name='docteste',
            name='bloqueado_por',
        ),
        migrations.RemoveField(
            model_name='docteste',
            name='criado_por',
        ),
        migrations.RemoveField(
            model_name='docteste',
            name='modificado_por',
        ),
        migrations.RemoveField(
            model_name='docteste',
            name='revertido_por',
        ),
        migrations.RemoveField(
            model_name='historicaldocteste',
            name='assinado_por',
        ),
        migrations.RemoveField(
            model_name='historicaldocteste',
            name='assinatura_removida_por',
        ),
        migrations.RemoveField(
            model_name='historicaldocteste',
            name='bloqueado_por',
        ),
        migrations.RemoveField(
            model_name='historicaldocteste',
            name='criado_por',
        ),
        migrations.RemoveField(
            model_name='historicaldocteste',
            name='history_user',
        ),
        migrations.RemoveField(
            model_name='historicaldocteste',
            name='modificado_por',
        ),
        migrations.RemoveField(
            model_name='historicaldocteste',
            name='revertido_por',
        ),
        migrations.AlterModelOptions(
            name='documento',
            options={},
        ),
        migrations.AddField(
            model_name='documento',
            name='assinado_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='documento',
            name='assinado_por',
            field=models.ForeignKey(related_name='django_documentos_documento_assinado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='documento',
            name='assinatura_hash',
            field=models.TextField(editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='documento',
            name='assinatura_removida_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='documento',
            name='assinatura_removida_por',
            field=models.ForeignKey(related_name='django_documentos_documento_assinatura_removida_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='documento',
            name='esta_assinado',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='historicaldocumento',
            name='assinado_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocumento',
            name='assinado_por',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='historicaldocumento',
            name='assinatura_hash',
            field=models.TextField(editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocumento',
            name='assinatura_removida_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocumento',
            name='assinatura_removida_por',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='historicaldocumento',
            name='esta_assinado',
            field=models.BooleanField(default=False),
        ),
        migrations.DeleteModel(
            name='DocTeste',
        ),
        migrations.DeleteModel(
            name='HistoricalDocTeste',
        ),
    ]
