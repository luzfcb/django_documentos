# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('django_documentos', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DocumentoLock',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('session_key', models.CharField(verbose_name='session key', max_length=40, null=True, editable=False, blank=True)),
                ('expire_date', models.DateTimeField(verbose_name='expire date')),
                ('bloqueado_por', models.ForeignKey(related_name='django_documentos_documentolock_bloqueado_por', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to=settings.AUTH_USER_MODEL, null=True)),
                ('documento', models.ForeignKey(related_name='django_documentos_documentolock_document', on_delete=django.db.models.deletion.SET_NULL, blank=True, editable=False, to='django_documentos.Documento', null=True)),
            ],
        ),
    ]
