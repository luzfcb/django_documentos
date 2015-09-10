# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import ckeditor.fields
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Documento',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('versao_numero', models.IntegerField(default=1, editable=False, auto_created=True)),
                ('revertido_da_versao', models.IntegerField(default=None, editable=False, null=True, auto_created=True, blank=True)),
                ('criado_em', models.DateTimeField(default=django.utils.timezone.now, editable=False, blank=True)),
                ('modificado_em', models.DateField(auto_now=True, null=True)),
                ('revertido_em', models.DateField(null=True, editable=False, blank=True)),
                ('esta_ativo', models.NullBooleanField(default=True, editable=False)),
                ('esta_bloqueado', models.NullBooleanField(default=False, editable=False)),
                ('titulo', models.CharField(max_length=500, editable=False, blank=True)),
                ('cabecalho', ckeditor.fields.RichTextField(blank=True)),
                ('conteudo', ckeditor.fields.RichTextField()),
                ('rodape', ckeditor.fields.RichTextField(blank=True)),
                ('criado_por', models.ForeignKey(related_name='django_documentos_documento_criado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True)),
                ('modificado_por', models.ForeignKey(related_name='django_documentos_documento_modificado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True)),
                ('revertido_por', models.ForeignKey(related_name='django_documentos_documento_revertido_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'ordering': ['criado_em'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='HistoricalDocumento',
            fields=[
                ('id', models.IntegerField(verbose_name='ID', db_index=True, auto_created=True, blank=True)),
                ('versao_numero', models.IntegerField(default=1, editable=False, auto_created=True)),
                ('revertido_da_versao', models.IntegerField(default=None, editable=False, null=True, auto_created=True, blank=True)),
                ('criado_em', models.DateTimeField(default=django.utils.timezone.now, editable=False, blank=True)),
                ('modificado_em', models.DateField(null=True, editable=False, blank=True)),
                ('revertido_em', models.DateField(null=True, editable=False, blank=True)),
                ('esta_ativo', models.NullBooleanField(default=True, editable=False)),
                ('esta_bloqueado', models.NullBooleanField(default=False, editable=False)),
                ('titulo', models.CharField(max_length=500, editable=False, blank=True)),
                ('cabecalho', ckeditor.fields.RichTextField(blank=True)),
                ('conteudo', ckeditor.fields.RichTextField()),
                ('rodape', ckeditor.fields.RichTextField(blank=True)),
                ('history_id', models.AutoField(serialize=False, primary_key=True)),
                ('history_date', models.DateTimeField()),
                ('history_type', models.CharField(max_length=1, choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')])),
                ('criado_por', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True)),
                ('history_user', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, null=True)),
                ('modificado_por', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True)),
                ('revertido_por', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
                'verbose_name': 'historical documento',
            },
        ),
    ]
