# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('django_documentos', '0005_auto_20150915_1345'),
    ]

    operations = [
        migrations.RenameField(
            model_name='documento',
            old_name='assinado',
            new_name='esta_assinado',
        ),
        migrations.RenameField(
            model_name='historicaldocumento',
            old_name='assinado',
            new_name='esta_assinado',
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
            name='assinatura_removida_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='documento',
            name='assinatura_removida_por',
            field=models.ForeignKey(related_name='django_documentos_documento_assinatura_removida_pors', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='documento',
            name='bloqueado_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='documento',
            name='bloqueado_por',
            field=models.ForeignKey(related_name='django_documentos_documento_bloqueado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True),
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
            name='bloqueado_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocumento',
            name='bloqueado_por',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AlterField(
            model_name='documento',
            name='modificado_em',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='documento',
            name='revertido_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AlterField(
            model_name='historicaldocumento',
            name='modificado_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AlterField(
            model_name='historicaldocumento',
            name='revertido_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
    ]
