# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
from captcha.fields import CaptchaField

from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit

# from redactor.widgets import RedactorEditor
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
    # next = forms.CharField(widget=forms.HiddenInput())
    # proximo = forms.CharField()
    class Meta:
        model = Documento
        fields = '__all__'
        exclude = ['criado_por', 'modificado_por']
        # widgets = {
        #     'conteudo': RedactorEditor()
        # }


class DocumentoFormUpdate(SaveHelperFormMixin, forms.ModelForm):
    class Meta:
        model = Documento
        fields = '__all__'
        exclude = ['criado_por', 'modificado_por']
        # widgets = {
        #     'conteudo': RedactorEditor()
        # }


class DocumentoRevertForm(RevertHelperFormMixin, forms.ModelForm):
    class Meta:
        model = Documento
        fields = '__all__'


class DocumetoValidarForm(forms.Form):
    codigo_verificador = forms.CharField()
    codigo_crc = forms.CharField()
    captcha = CaptchaField()
