# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('django_documentos', '0002_auto_20151001_1940'),
    ]

    operations = [
        migrations.CreateModel(
            name='DocTeste',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nome', models.TextField()),
            ],
        ),
    ]
