# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('django_documentos', '0004_historicaldocteste'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='docteste',
            name='nome',
        ),
        migrations.RemoveField(
            model_name='historicaldocteste',
            name='nome',
        ),
        migrations.AddField(
            model_name='docteste',
            name='bloqueado_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='docteste',
            name='bloqueado_por',
            field=models.ForeignKey(related_name='django_documentos_docteste_bloqueado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='docteste',
            name='criado_em',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='docteste',
            name='criado_por',
            field=models.ForeignKey(related_name='django_documentos_docteste_criado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='docteste',
            name='esta_ativo',
            field=models.NullBooleanField(default=True, editable=False),
        ),
        migrations.AddField(
            model_name='docteste',
            name='esta_bloqueado',
            field=models.NullBooleanField(default=False, editable=False),
        ),
        migrations.AddField(
            model_name='docteste',
            name='modificado_em',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AddField(
            model_name='docteste',
            name='modificado_por',
            field=models.ForeignKey(related_name='django_documentos_docteste_modificado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='docteste',
            name='revertido_da_versao',
            field=models.IntegerField(default=None, editable=False, null=True, auto_created=True, blank=True),
        ),
        migrations.AddField(
            model_name='docteste',
            name='revertido_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='docteste',
            name='revertido_por',
            field=models.ForeignKey(related_name='django_documentos_docteste_revertido_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='bloqueado_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='bloqueado_por',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='criado_em',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='criado_por',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='esta_ativo',
            field=models.NullBooleanField(default=True, editable=False),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='esta_bloqueado',
            field=models.NullBooleanField(default=False, editable=False),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='modificado_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='modificado_por',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='revertido_da_versao',
            field=models.IntegerField(default=None, editable=False, null=True, auto_created=True, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='revertido_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='revertido_por',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
