# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.conf import settings
from django.db import models
from django.db.models import Max
from django.utils import timezone
from django.utils.six import python_2_unicode_compatible
from model_utils import tracker
from redactor.fields import RedactorField

from simple_history.models import HistoricalRecords
from simple_history.views import MissingHistoryRecordsField

USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')


class BaseModeloVersionado(models.Model):
    criado_em = models.DateTimeField(default=timezone.now, blank=True, editable=False)
    criado_por = models.ForeignKey(to=USER_MODEL,
                                   related_name="%(app_label)s_%(class)s_criado_por", null=True,
                                   blank=True, on_delete=models.SET_NULL, editable=False)

    modificado_em = models.DateField(auto_now=True, blank=True, null=True, editable=False)
    modificado_por = models.ForeignKey(to=USER_MODEL,
                                       related_name="%(app_label)s_%(class)s_modificado_por", null=True,
                                       blank=True, on_delete=models.SET_NULL, editable=False)

    revertido_em = models.DateField(blank=True, null=True, editable=False)
    revertido_por = models.ForeignKey(to=USER_MODEL,
                                      related_name="%(app_label)s_%(class)s_revertido_por", null=True,
                                      blank=True, on_delete=models.SET_NULL, editable=False)
    revertido_da_versao = models.IntegerField(null=True, default=None, auto_created=True, editable=False, blank=True)

    esta_ativo = models.NullBooleanField(default=True, editable=False)
    esta_bloqueado = models.NullBooleanField(default=False, editable=False)

    content_tracker = tracker.FieldTracker()

    versao_numero = models.IntegerField(default=1, auto_created=True, editable=False)

    def __init__(self, *args, **kwargs):
        super(BaseModeloVersionado, self).__init__(*args, **kwargs)
        if not hasattr(self._meta, 'simple_history_manager_attribute'):
            raise MissingHistoryRecordsField(
                "The model %(cls)s does not have a HistoryRecords field. Define a HistoryRecords()"
                " field into %(cls)s model class."
                "\neg.:"
                "\nhistory = HistoryRecords()"
                "\n\nafter do this, run:"
                "\npython manage.py makemigrations %(app_label)s"
                "\npython manage.py migrate %(app_label)s"
                "\npython manage.py populate_history %(app_label)s.%(cls)s " % {
                    'app_label': self._meta.app_label,
                    'cls': self.__class__.__name__
                })

    @property
    def _history_user(self):
        return self.modificado_por

    @_history_user.setter
    def _history_user(self, value):
        self.modificado_por = value

    def save(self, *args, **kwargs):

        if self.pk:
            if hasattr(self._meta, 'simple_history_manager_attribute'):
                history_manager = getattr(self, self._meta.simple_history_manager_attribute)
                max_db_value = history_manager.aggregate(Max('versao_numero')).values()[0]
                self.versao_numero = max_db_value + 1 if max_db_value >= self.versao_numero else self.versao_numero + 1
            else:
                raise MissingHistoryRecordsField(
                    "The model %(cls)s does not have a HistoryRecords field. Define a HistoryRecords()"
                    " field into %(cls)s model class."
                    "\neg.:"
                    "\nhistory = HistoryRecords()"
                    "\n\nafter do this, run:"
                    "\npython manage.py makemigrations %(app_label)s"
                    "\npython manage.py migrate %(app_label)s"
                    "\npython manage.py populate_history %(app_label)s.%(cls)s " % {
                        'app_label': self._meta.app_label,
                        'cls': self.__class__.__name__
                    })
        super(BaseModeloVersionado, self).save(*args, **kwargs)

    class Meta:
        abstract = True


@python_2_unicode_compatible
class Documento(BaseModeloVersionado):
    titulo = models.CharField(blank=True, max_length=500)
    conteudo = RedactorField(
        verbose_name=u'conteudo',
        allow_file_upload=True,
        allow_image_upload=True
    )
    versoes = HistoricalRecords()

    def __str__(self):
        return self.titulo

    class Meta:
        db_table = ''

#
# class DocumentoConteudo(BaseModeloVersionado):
#     documento = models.OneToOneField('Documento', related_name="conteudo", null=True, on_delete=models.SET_NULL,
#                                      editable=False)
#     titulo = models.CharField(blank=True, max_length=500)
#     conteudo = models.TextField(blank=True)
#     versoes = HistoricalRecords()
