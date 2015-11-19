from django.db import models

# Create your models here.
from django_documentos.models import Documento


class Processo(models.Model):
    documentos = models.ManyToManyField('django_documentos.Documento', through='ProcessoDocumento')
    data = models.DateTimeField(auto_now_add=True)

    @property
    def documento_nomes(self):
        return self.documentos.all().values('criado_por__username')


class ProcessoDocumento(models.Model):
    documento = models.ForeignKey('django_documentos.Documento')
    processo = models.ForeignKey('Processo')
    data = models.DateTimeField(auto_now_add=True)
