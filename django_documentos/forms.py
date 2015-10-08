# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
import autocomplete_light

from captcha.fields import CaptchaField
from django import forms
# from redactor.widgets import RedactorEditor

from ckeditor.widgets import CKEditorWidget
from crispy_forms.helper import FormHelper
from crispy_forms.layout import HTML, Submit
from django.contrib.auth.hashers import check_password
from django.utils.translation import ugettext_lazy as _
from djangular.forms import NgModelFormMixin, NgModelForm, NgFormValidationMixin
from djangular.forms import NgDeclarativeFieldsMetaclass
from django_documentos.utils.module_loading import get_real_user_model_class
from django_documentos.widgets import SplitWidget, SplitedHashField2, SplitedHashField3
from . import settings
from .models import Documento


class SaveHelper(FormHelper):
    def __init__(self, form=None):
        super(SaveHelper, self).__init__(form)
        self.layout.append(Submit(name='save', value='Salvar'))
        self.form_method = 'post'
        self.form_show_errors = True
        self.render_required_fields = True
        self.render_unmentioned_fields = True


class SaveHelperFormMixin(object):
    def __init__(self, *args, **kwargs):
        super(SaveHelperFormMixin, self).__init__(*args, **kwargs)
        self.helper = SaveHelper(self)


class RevertHelper(FormHelper):
    def __init__(self, form=None):
        super(RevertHelper, self).__init__(form)
        self.layout.append(Submit(name='revert', value='Reverter'))
        self.form_show_errors = True
        self.render_required_fields = True


class RevertHelperFormMixin(object):
    def __init__(self, *args, **kwargs):
        super(RevertHelperFormMixin, self).__init__(*args, **kwargs)
        self.helper = RevertHelper(self)


class IsPopUpMixin(forms.Form):
    is_popup = forms.NullBooleanField(required=False, widget=forms.HiddenInput())


class NextFormMixin(forms.Form):
    proximo = forms.CharField(required=False, widget=forms.HiddenInput())


class DocumentoFormCreate(SaveHelperFormMixin, NextFormMixin, IsPopUpMixin, forms.ModelForm):
    # cabecalho = ckeditor_fields.RichTextField(blank=True)
    conteudo = forms.CharField(widget=CKEditorWidget(), label='')

    # rodape = ckeditor_fields.RichTextField(blank=True)
    class Meta:
        model = Documento
        fields = '__all__'
        exclude = ['criado_por', 'modificado_por', 'esta_assinado']
        # widgets = {
        #     'conteudo': RedactorEditor()
        # }


class DocumentoFormUpdate(SaveHelperFormMixin, forms.ModelForm):
    class Meta:
        model = Documento
        fields = '__all__'
        exclude = ['criado_por', 'modificado_por', 'esta_assinado']
        # widgets = {
        #     'conteudo': RedactorEditor()
        # }


class DocumentoRevertForm(RevertHelperFormMixin, forms.ModelForm):
    class Meta:
        model = Documento
        fields = '__all__'


class ValidarHelper(FormHelper):
    def __init__(self, form=None):
        super(ValidarHelper, self).__init__(form)
        self.layout.append(
            HTML("""<a class="btn btn-mini" onclick="refresh_captcha()"><i class="icon-refresh"></i> Refresh</a>""")

        )

        self.layout.append(Submit(name='validar', value='Validar'))
        self.form_method = 'post'
        self.form_show_errors = True
        self.form_action = 'documentos:validar'
        self.render_required_fields = True
        self.render_unmentioned_fields = True


class ValidarHelperFormMixin(object):
    def __init__(self, *args, **kwargs):
        super(ValidarHelperFormMixin, self).__init__(*args, **kwargs)
        self.helper = ValidarHelper(self)

from parsley.decorators import parsleyfy


class DocumetoValidarForm(ValidarHelperFormMixin, forms.ModelForm):
    form_name = 'documento-validar-form'
    # id = forms.CharField()
    # codigo_crc = SplitedHashField(split_into=4)
    # codigo_crc = forms.CharField(widget=SplitWidget(), initial='ABCDABCDABCDABCD')
    # assinatura_hash = SplitedHashField2(label='Codigo CRC',
    #                                     initial='ABCDABCDABCDABCD'
    #                                     )
    assinatura_hash = SplitedHashField3(label='Codigo CRC',
                                        split_guide=(4, 3, 2),
                                        #initial='AAAABBBCCDDDDDD'
                                        )
    captcha = CaptchaField()
    class Meta:
        model = Documento
        fields = ('assinatura_hash', )
    # def clean_codigo_crc(self):
    #     codigo_crc = self.cleaned_data.get('codigo_crc')
    #     print('codigo_crc:', codigo_crc)
    #     return codigo_crc

# DocumetoValidarForm = parsleyfy(DocumetoValidarForm22)

class AssinarDocumentoHelper(FormHelper):
    def __init__(self, form=None):
        super(AssinarDocumentoHelper, self).__init__(form)
        # self.layout.append(
        #     HTML("""<a class="btn btn-mini" onclick="refresh_captcha()"><i class="icon-refresh"></i> Refresh</a>""")
        #
        # )
        self.layout.append(Submit(name='assinar', value='Assinar Documento'))
        self.form_id = 'form_assinar'
        self.form_method = 'post'
        self.form_show_errors = True
        # self.form_action = 'documentos:validar'
        self.render_required_fields = True
        self.render_unmentioned_fields = True


class AssinarDocumentoHelperFormMixin(object):
    def __init__(self, *args, **kwargs):
        super(AssinarDocumentoHelperFormMixin, self).__init__(*args, **kwargs)
        self.helper = AssinarDocumentoHelper(self)


class AssinarDocumento(AssinarDocumentoHelperFormMixin, forms.ModelForm):
    assinado_por = autocomplete_light.ModelChoiceField('UserAutocomplete', label='Usuario Assinante')
    # assinado_por = forms.ModelChoiceField(get_real_user_model_class().objects.all().order_by('username'))

    password = forms.CharField(label="Sua senha",
                               widget=forms.PasswordInput)

    error_messages = {
        'invalid_login': _("Please enter a correct %(username)s and password. "
                           "Note that both fields may be case-sensitive."),
        'inactive': _("This account is inactive."),
    }

    def __init__(self, *args, **kwargs):
        self.current_logged_user = kwargs.pop('current_logged_user')
        super(AssinarDocumento, self).__init__(*args, **kwargs)

    class Meta:
        model = Documento
        # fields = '__all__'
        fields = ('assinado_por', )

    def clean_password(self):
        password = self.cleaned_data.get('password')
        user = self.cleaned_data.get('assinado_por')
        valid = check_password(password, user.password)
        if not valid:
            raise forms.ValidationError('Invalid password')

        return password

    def save(self, commit=True):
        documento = super(AssinarDocumento, self).save(False)
        documento.esta_assinado = True
        documento.assinado_por = self.cleaned_data.get('assinado_por')
        documento.assinar_documento(current_logged_user=self.current_logged_user)
        return documento


class RemoverAssinaturaDocumento(AssinarDocumentoHelperFormMixin, forms.ModelForm):
    usuario_assinante = autocomplete_light.ModelChoiceField('UserAutocomplete')

    password = forms.CharField(label="Sua senha",
                               widget=forms.PasswordInput)

    error_messages = {
        'invalid_login': _("Please enter a correct %(username)s and password. "
                           "Note that both fields may be case-sensitive."),
        'inactive': _("This account is inactive."),
    }

    def __init__(self, *args, **kwargs):
        self.current_logged_user = kwargs.pop('current_logged_user')
        super(RemoverAssinaturaDocumento, self).__init__(*args, **kwargs)

    class Meta:
        model = Documento
        fields = ('id',)

    def clean_password(self):
        password = self.cleaned_data.get('password')
        user = self.cleaned_data.get('usuario_assinante')
        valid = check_password(password, user.password)
        if not valid:
            raise forms.ValidationError('Invalid password')

        return password

    def save(self, commit=True):
        documento = super(RemoverAssinaturaDocumento, self).save(False)

        documento.remover_assinatura_documento(current_logged_user=self.current_logged_user)
        return documento

# from django.contrib.auth.models import User
#
# class UserSelectForm(forms.Form):
#     user = forms.ModelChoiceField(queryset=None)
#
#     def __init__(self, *args, **kwargs):
#         user_queryset = kwargs.pop('user_queryset', User.objects.all())
#         user = kwargs.pop('user', None)
#         super(UserSelectForm, self).__init__(*args, **kwargs)
#         self.fields['user'].queryset = user_queryset
#         if user:
#             # how to select default
#             pass
