# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.conf import settings
from django.contrib.auth.hashers import SHA1PasswordHasher
from django.db import models
from django.db.models import Max
from django.utils import timezone
from django.utils.six import python_2_unicode_compatible
from model_utils import tracker

from ckeditor import fields as ckeditor_fields
from simple_history.models import HistoricalRecords
from simple_history.views import MissingHistoryRecordsField

# from redactor.fields import RedactorField
import six
from django_documentos.utils import identificador
from django_documentos.utils.module_loading import get_real_user_model_class

USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')


# class BaseModeloVersionado(models.Model):
#     criado_em = models.DateTimeField(default=timezone.now, blank=True, editable=False)
#     criado_por = models.ForeignKey(to=USER_MODEL,
#                                    related_name="%(app_label)s_%(class)s_criado_por", null=True,
#                                    blank=True, on_delete=models.SET_NULL, editable=False)
#
#     modificado_em = models.DateTimeField(auto_now=True, blank=True, null=True, editable=False)
#     modificado_por = models.ForeignKey(to=USER_MODEL,
#                                        related_name="%(app_label)s_%(class)s_modificado_por", null=True,
#                                        blank=True, on_delete=models.SET_NULL, editable=False)
#
#     revertido_em = models.DateTimeField(blank=True, null=True, editable=False)
#     revertido_por = models.ForeignKey(to=USER_MODEL,
#                                       related_name="%(app_label)s_%(class)s_revertido_por", null=True,
#                                       blank=True, on_delete=models.SET_NULL, editable=False)
#     revertido_da_versao = models.IntegerField(null=True, default=None, auto_created=True, editable=False, blank=True)
#
#     esta_ativo = models.NullBooleanField(default=True, editable=False)
#
#     esta_bloqueado = models.NullBooleanField(default=False, editable=False)
#     bloqueado_em = models.DateTimeField(blank=True, null=True, editable=False)
#     bloqueado_por = models.ForeignKey(to=USER_MODEL,
#                                       related_name="%(app_label)s_%(class)s_bloqueado_por", null=True,
#                                       blank=True, on_delete=models.SET_NULL, editable=False)
#
#     content_tracker = tracker.FieldTracker()
#
#     versao_numero = models.IntegerField(default=1, auto_created=True, editable=False)
#
#     def __init__(self, *args, **kwargs):
#         super(BaseModeloVersionado, self).__init__(*args, **kwargs)
#         if not hasattr(self._meta, 'simple_history_manager_attribute'):
#             raise MissingHistoryRecordsField(
#                 "The model %(cls)s does not have a HistoryRecords field. Define a HistoryRecords()"
#                 " field into %(cls)s model class."
#                 "\neg.:"
#                 "\nhistory = HistoryRecords()"
#                 "\n\nafter do this, run:"
#                 "\npython manage.py makemigrations %(app_label)s"
#                 "\npython manage.py migrate %(app_label)s"
#                 "\npython manage.py populate_history %(app_label)s.%(cls)s " % {
#                     'app_label': self._meta.app_label,
#                     'cls': self.__class__.__name__
#                 })
#
#     @property
#     def _history_user(self):
#         return self.modificado_por
#
#     @_history_user.setter
#     def _history_user(self, value):
#         self.modificado_por = value
#
#     def save(self, *args, **kwargs):
#
#         if self.pk:
#             if hasattr(self._meta, 'simple_history_manager_attribute'):
#                 history_manager = getattr(self, self._meta.simple_history_manager_attribute)
#                 max_db_value = history_manager.aggregate(Max('versao_numero')).values()[0]
#                 self.versao_numero = max_db_value + 1 if max_db_value >= self.versao_numero else self.versao_numero + 1
#             else:
#                 raise MissingHistoryRecordsField(
#                     "The model %(cls)s does not have a HistoryRecords field. Define a HistoryRecords()"
#                     " field into %(cls)s model class."
#                     "\neg.:"
#                     "\nhistory = HistoryRecords()"
#                     "\n\nafter do this, run:"
#                     "\npython manage.py makemigrations %(app_label)s"
#                     "\npython manage.py migrate %(app_label)s"
#                     "\npython manage.py populate_history %(app_label)s.%(cls)s " % {
#                         'app_label': self._meta.app_label,
#                         'cls': self.__class__.__name__
#                     })
#         super(BaseModeloVersionado, self).save(*args, **kwargs)
#
#     class Meta:
#         ordering = ['criado_em']
#         abstract = True
#
#
# @python_2_unicode_compatible
# class Documento(BaseModeloVersionado):
#     titulo = models.CharField(blank=True, max_length=500, editable=False)
#     # conteudo = RedactorField(
#     #     verbose_name=u'conteudo',
#     #     allow_file_upload=True,
#     #     allow_image_upload=True
#     #
#     # )
#     # cabecalho = ckeditor_fields.RichTextField(blank=True)
#     conteudo = ckeditor_fields.RichTextField()
#
#     # assinatura_hash = models.TextField(blank=True, editable=False)
#     #
#     # esta_assinado = models.BooleanField(default=False, editable=True)
#     # assinado_em = models.DateTimeField(blank=True, null=True, editable=False)
#     # assinado_por = models.ForeignKey(to=USER_MODEL,
#     #                                  related_name="%(app_label)s_%(class)s_assinado_por",
#     #                                  null=True,
#     #                                  blank=True, on_delete=models.SET_NULL, editable=False)
#     #
#     # assinatura_removida_em = models.DateTimeField(blank=True, null=True, editable=False)
#     # assinatura_removida_por = models.ForeignKey(to=USER_MODEL,
#     #                                             related_name="%(app_label)s_%(class)s_assinatura_removida_por",
#     #                                             null=True,
#     #                                             blank=True, on_delete=models.SET_NULL, editable=False)
#
#     # rodape = ckeditor_fields.RichTextField(blank=True)
#
#     versoes = HistoricalRecords()
#
#     def save(self, *args, **kwargs):
#         # if self.esta_assinado:
#         #     self.assinar_documento(None)
#         # else:
#         #     self.remover_assinatura_documento(None)
#
#         super(Documento, self).save(self, *args, **kwargs)
#
#     @property
#     def identificador_versao(self):
#         return identificador.document(self.pk, self.versao_numero)
#
#     def __str__(self):
#         return '{}-{}-{}'.format(self.pk, self.versao_numero, getattr(self, 'esta_assinado', ''))
#
#     def assinar_documento(self, current_logged_user, *args, **kwargs):
#         # if current_logged_user:
#         #     self.assinado_por = current_logged_user
#         try:
#             self.assinado_em = timezone.now()
#             self.esta_assinado = True
#             para_hash = '{username}-{conteudo}-{assinado_em}'.format(  # username=self.assinado_por.username,
#                                                                        username=self.criado_por.username,
#                                                                        conteudo=self.conteudo,
#                                                                        assinado_em='asdasd'
#                                                                        # assinado_em=self.assinado_em
#                                                                        )
#             password_hasher = SHA1PasswordHasher()
#             self.assinatura_hash = password_hasher.encode(para_hash, 'djdocumentos')
#         except Exception:
#             print('deu pau aqui')
#             # self.save(*args, **kwargs)
#
#     def remover_assinatura_documento(self, current_logged_user, *args, **kwargs):
#         # if current_logged_user:
#         #     self.assinatura_removida_por = current_logged_user
#         self.assinatura_removida_em = timezone.now()
#         self.esta_assinado = False
#
#         self.assinado_em = None
#         self.assinado_por = None
#         self.assinatura_hash = ''
#         # self.save(*args, **kwargs)


@python_2_unicode_compatible
class Documento(models.Model):
    titulo = models.CharField(blank=True, max_length=500, editable=False)

    conteudo = ckeditor_fields.RichTextField()
    criado_em = models.DateTimeField(default=timezone.now, blank=True, editable=False)
    criado_por = models.ForeignKey(to=USER_MODEL,
                                   related_name="%(app_label)s_%(class)s_criado_por", null=True,
                                   blank=True, on_delete=models.SET_NULL, editable=False)

    modificado_em = models.DateTimeField(auto_now=True, blank=True, null=True, editable=False)
    modificado_por = models.ForeignKey(to=USER_MODEL,
                                       related_name="%(app_label)s_%(class)s_modificado_por", null=True,
                                       blank=True, on_delete=models.SET_NULL, editable=False)

    revertido_em = models.DateTimeField(blank=True, null=True, editable=False)
    revertido_por = models.ForeignKey(to=USER_MODEL,
                                      related_name="%(app_label)s_%(class)s_revertido_por", null=True,
                                      blank=True, on_delete=models.SET_NULL, editable=False)
    revertido_da_versao = models.IntegerField(null=True, default=None, auto_created=True, editable=False, blank=True)

    esta_ativo = models.NullBooleanField(default=True, editable=False)

    esta_bloqueado = models.NullBooleanField(default=False, editable=False)
    bloqueado_em = models.DateTimeField(blank=True, null=True, editable=False)
    bloqueado_por = models.ForeignKey(to=USER_MODEL,
                                      related_name="%(app_label)s_%(class)s_bloqueado_por", null=True,
                                      blank=True, on_delete=models.SET_NULL, editable=False)

    assinatura_hash = models.TextField(blank=True, editable=False)

    esta_assinado = models.BooleanField(default=False, editable=True)
    assinado_em = models.DateTimeField(blank=True, null=True, editable=False)
    assinado_por = models.ForeignKey(to=USER_MODEL,
                                     related_name="%(app_label)s_%(class)s_assinado_por",
                                     null=True,
                                     blank=True, on_delete=models.SET_NULL, editable=False)

    assinatura_removida_em = models.DateTimeField(blank=True, null=True, editable=False)
    assinatura_removida_por = models.ForeignKey(to=USER_MODEL,
                                                related_name="%(app_label)s_%(class)s_assinatura_removida_por",
                                                null=True,
                                                blank=True, on_delete=models.SET_NULL, editable=False)
    versao_numero = models.IntegerField(default=1, auto_created=True, editable=False)

    versoes = HistoricalRecords()

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
        # if self.esta_assinado:
        #     self.assinar_documento(None)
        # else:
        #     self.remover_assinatura_documento(None)
        super(Documento, self).save(*args, **kwargs)

    @property
    def _history_user(self):
        return self.modificado_por

    @_history_user.setter
    def _history_user(self, value):
        self.modificado_por = value

    @property
    def identificador_versao(self):
        return identificador.document(self.pk, self.versao_numero)

    def __str__(self):
        return '{}-{}-{}'.format(self.pk, self.versao_numero, getattr(self, 'esta_assinado', ''))

    def assinar_documento(self, current_logged_user, *args, **kwargs):
        # if current_logged_user:
        #     self.assinado_por = current_logged_user
        try:
            u = get_real_user_model_class().objects.all()[0]
            self.assinado_por = u
            self.assinado_em = timezone.now()
            self.esta_assinado = True
            print(locals())
            para_hash = '{username}-{conteudo}-{assinado_em}'.format(  # username=self.assinado_por.username,
                                                                       username=self.criado_por.username,
                                                                       conteudo=self.conteudo,
                                                                       assinado_em='asdasd'
                                                                       # assinado_em=self.assinado_em
                                                                       )
            password_hasher = SHA1PasswordHasher()
            self.assinatura_hash = password_hasher.encode(para_hash, 'djdocumentos')
        except Exception as e:

            print('deu pau aqui: ', e)
        self.save(*args, **kwargs)

    def remover_assinatura_documento(self, current_logged_user, *args, **kwargs):
        # if current_logged_user:
        #     self.assinatura_removida_por = current_logged_user
        self.assinatura_removida_em = timezone.now()
        self.esta_assinado = False

        self.assinado_em = None
        self.assinado_por = None
        self.assinatura_hash = ''
        self.save(*args, **kwargs)

    class Meta:
        ordering = ['criado_em']
        permissions = (
            ("pode_criar_documento", "Pode Criar documento"),
            ("pode_editar_documento", "Pode Editar documento"),
            ("pode_assinar_documento", "Pode Assinar documento"),
            ("pode_desativar_documento", "Pode Desativar documento"),
            ("pode_visualizar_versoes_anteriores_documento", "Pode Visualizar versoes anteriores de documento"),
            ("pode_reverter_para_uma_versao_anterior_documento", "Pode Reverter documento para uma versão anterior"),
            ("pode_imprimir", "Pode Imprimir documento"),
        )
