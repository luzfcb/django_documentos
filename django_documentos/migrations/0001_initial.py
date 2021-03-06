# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
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
                ('titulo', models.CharField(max_length=500, blank=True)),
                ('conteudo', ckeditor.fields.RichTextField()),
                ('criado_em', models.DateTimeField(default=django.utils.timezone.now, editable=False, blank=True)),
                ('modificado_em', models.DateTimeField(auto_now=True, null=True)),
                ('revertido_em', models.DateTimeField(null=True, editable=False, blank=True)),
                ('esta_ativo', models.NullBooleanField(default=True, editable=False)),
                ('esta_bloqueado', models.NullBooleanField(default=False, editable=False)),
                ('bloqueado_em', models.DateTimeField(null=True, editable=False, blank=True)),
                ('assinatura_hash', models.TextField(unique=True, null=True, editable=False, blank=True)),
                ('esta_assinado', models.BooleanField(default=False)),
                ('assinado_em', models.DateTimeField(null=True, editable=False, blank=True)),
                ('assinatura_removida_em', models.DateTimeField(null=True, editable=False, blank=True)),
                ('assinado_por', models.ForeignKey(related_name='django_documentos_documento_assinado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True)),
                ('assinatura_removida_por', models.ForeignKey(related_name='django_documentos_documento_assinatura_removida_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True)),
                ('bloqueado_por', models.ForeignKey(related_name='django_documentos_documento_bloqueado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True)),
                ('criado_por', models.ForeignKey(related_name='django_documentos_documento_criado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True)),
                ('modificado_por', models.ForeignKey(related_name='django_documentos_documento_modificado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True)),
                ('revertido_por', models.ForeignKey(related_name='django_documentos_documento_revertido_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'ordering': ['criado_em'],
                'permissions': (('pode_criar_documento', 'Pode Criar documento'), ('pode_editar_documento', 'Pode Editar documento'), ('pode_assinar_documento', 'Pode Assinar documento'), ('pode_desativar_documento', 'Pode Desativar documento'), ('pode_visualizar_versoes_anteriores_documento', 'Pode Visualizar versoes anteriores de documento'), ('pode_reverter_para_uma_versao_anterior_documento', 'Pode Reverter documento para uma vers\xe3o anterior'), ('pode_imprimir', 'Pode Imprimir documento')),
            },
        ),
        migrations.CreateModel(
            name='DocumentoLock',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('bloqueado_em', models.DateTimeField(default=django.utils.timezone.now, editable=False, blank=True)),
                ('session_key', models.CharField(verbose_name='session key', max_length=40, null=True, editable=False, blank=True)),
                ('expire_date', models.DateTimeField(verbose_name='expire date')),
                ('bloqueado_por', models.ForeignKey(related_name='django_documentos_documentolock_bloqueado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True)),
                ('documento', models.ForeignKey(related_name='django_documentos_documentolock_document', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to='django_documentos.Documento', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='HistoricalDocumento',
            fields=[
                ('id', models.IntegerField(verbose_name='ID', db_index=True, auto_created=True, blank=True)),
                ('versao_numero', models.IntegerField(default=1, editable=False, auto_created=True)),
                ('revertido_da_versao', models.IntegerField(default=None, editable=False, null=True, auto_created=True, blank=True)),
                ('titulo', models.CharField(max_length=500, blank=True)),
                ('conteudo', ckeditor.fields.RichTextField()),
                ('criado_em', models.DateTimeField(default=django.utils.timezone.now, editable=False, blank=True)),
                ('modificado_em', models.DateTimeField(null=True, editable=False, blank=True)),
                ('revertido_em', models.DateTimeField(null=True, editable=False, blank=True)),
                ('esta_ativo', models.NullBooleanField(default=True, editable=False)),
                ('esta_bloqueado', models.NullBooleanField(default=False, editable=False)),
                ('bloqueado_em', models.DateTimeField(null=True, editable=False, blank=True)),
                ('assinatura_hash', models.TextField(db_index=True, null=True, editable=False, blank=True)),
                ('esta_assinado', models.BooleanField(default=False)),
                ('assinado_em', models.DateTimeField(null=True, editable=False, blank=True)),
                ('assinatura_removida_em', models.DateTimeField(null=True, editable=False, blank=True)),
                ('history_id', models.AutoField(serialize=False, primary_key=True)),
                ('history_date', models.DateTimeField()),
                ('history_type', models.CharField(max_length=1, choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')])),
                ('assinado_por', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True)),
                ('assinatura_removida_por', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True)),
                ('bloqueado_por', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True)),
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
