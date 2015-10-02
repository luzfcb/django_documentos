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
from django_documentos.widgets import SplitedHashField, SplitField2, SplitWidget, SplitedHashField2
from . import settings
from .models import Documento


class SaveHelper(FormHelper):
    def __init__(self, form=None):
        super(SaveHelper, self).__init__(form)
        self.layout.append(Submit(name='save', value='Salvar'))
        self.form_show_errors = True
        self.render_required_fields = True


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
    assinatura_hash = SplitedHashField2(label='Codigo CRC',
                                        initial='ABCDABCDABCDABCD'
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


# class AuthenticationForm2(forms.Form):
#     """
#     Base class for authenticating users. Extend this to get a form that accepts
#     username/password logins.
#     """
#     username = forms.CharField(max_length=254)
#     password = forms.CharField(label=_("Password"), widget=forms.PasswordInput)
#
#     error_messages = {
#         'invalid_login': _("Please enter a correct %(username)s and password. "
#                            "Note that both fields may be case-sensitive."),
#         'inactive': _("This account is inactive."),
#     }
#
#     def __init__(self, request=None, *args, **kwargs):
#         """
#         The 'request' parameter is set for custom auth use by subclasses.
#         The form data comes in via the standard 'data' kwarg.
#         """
#         self.request = request
#         self.user_cache = None
#         super(AuthenticationForm2, self).__init__(*args, **kwargs)
#
#         # Set the label for the "username" field.
#         UserModel = get_user_model()
#         self.username_field = UserModel._meta.get_field(UserModel.USERNAME_FIELD)
#         if self.fields['username'].label is None:
#             self.fields['username'].label = capfirst(self.username_field.verbose_name)
#
#     def clean(self):
#         username = self.cleaned_data.get('username')
#         password = self.cleaned_data.get('password')
#
#         if username and password:
#             self.user_cache = authenticate(username=username,
#                                            password=password)
#             if self.user_cache is None:
#                 raise forms.ValidationError(
#                     self.error_messages['invalid_login'],
#                     code='invalid_login',
#                     params={'username': self.username_field.verbose_name},
#                 )
#             else:
#                 self.confirm_login_allowed(self.user_cache)
#
#         return self.cleaned_data
#
#     def confirm_login_allowed(self, user):
#         """
#         Controls whether the given User may log in. This is a policy setting,
#         independent of end-user authentication. This default behavior is to
#         allow login by active users, and reject login by inactive users.
#
#         If the given user cannot log in, this method should raise a
#         ``forms.ValidationError``.
#
#         If the given user may log in, this method should return None.
#         """
#         if not user.is_active:
#             raise forms.ValidationError(
#                 self.error_messages['inactive'],
#                 code='inactive',
#             )
#
#     def get_user_id(self):
#         if self.user_cache:
#             return self.user_cache.id
#         return None
#
#     def get_user(self):
#         return self.user_cache


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
