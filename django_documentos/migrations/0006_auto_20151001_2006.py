# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import ckeditor.fields
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('django_documentos', '0005_auto_20151001_2005'),
    ]

    operations = [
        migrations.AddField(
            model_name='docteste',
            name='assinado_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='docteste',
            name='assinado_por',
            field=models.ForeignKey(related_name='django_documentos_docteste_assinado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='docteste',
            name='assinatura_hash',
            field=models.TextField(editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='docteste',
            name='assinatura_removida_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='docteste',
            name='assinatura_removida_por',
            field=models.ForeignKey(related_name='django_documentos_docteste_assinatura_removida_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='docteste',
            name='conteudo',
            field=ckeditor.fields.RichTextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='docteste',
            name='esta_assinado',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='docteste',
            name='titulo',
            field=models.CharField(max_length=500, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='assinado_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='assinado_por',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='assinatura_hash',
            field=models.TextField(editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='assinatura_removida_em',
            field=models.DateTimeField(null=True, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='assinatura_removida_por',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='conteudo',
            field=ckeditor.fields.RichTextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='esta_assinado',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='historicaldocteste',
            name='titulo',
            field=models.CharField(max_length=500, editable=False, blank=True),
        ),
    ]
