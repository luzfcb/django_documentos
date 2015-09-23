# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
import autocomplete_light

from captcha.fields import CaptchaField
from django import forms
# from redactor.widgets import RedactorEditor
from django.contrib.auth.forms import AuthenticationForm

from ckeditor.widgets import CKEditorWidget
from crispy_forms.helper import FormHelper
from crispy_forms.layout import HTML, Submit
from django.contrib.auth.hashers import check_password
from django.utils.translation import ugettext_lazy as _

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
    conteudo = forms.CharField(widget=CKEditorWidget())

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


class DocumetoValidarForm(ValidarHelperFormMixin, forms.Form):
    codigo_verificador = forms.CharField()
    codigo_crc = forms.CharField()
    captcha = CaptchaField()


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


class ValidatePasswordForm(forms.Form):
    user2 = autocomplete_light.ModelChoiceField('UserAutocomplete')

    password = forms.CharField(label="Sua senha",
                               widget=forms.PasswordInput)

    error_messages = {
        'invalid_login': _("Please enter a correct %(username)s and password. "
                           "Note that both fields may be case-sensitive."),
        'inactive': _("This account is inactive."),
    }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        super(ValidatePasswordForm, self).__init__(*args, **kwargs)

    def clean_password(self):
        password = self.cleaned_data.get('password')
        valid = check_password(password, self.user.password)
        if not valid:
            raise forms.ValidationError('Invalid password')

        return password


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


class AssinarDocumento(AssinarDocumentoHelperFormMixin, ValidatePasswordForm):
    pass
