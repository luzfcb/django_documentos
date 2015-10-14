# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Processo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('data', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='ProcessoDocumento',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('data', models.DateTimeField(auto_now_add=True)),
                ('documento', models.ForeignKey(to='django_documentos.Documento')),
                ('processo', models.ForeignKey(to='test_app.Processo')),
            ],
        ),
        migrations.AddField(
            model_name='processo',
            name='documentos',
            field=models.ManyToManyField(to='django_documentos.Documento', through='test_app.ProcessoDocumento'),
        ),
    ]
