from pprint import pprint
from django import forms
from django.core import validators
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.forms import widgets
from django.utils.translation import ugettext

import re

ascii_e_numeros_re = re.compile(r'^[a-zA-Z0-9]+\Z')

validate_ascii_e_numeros = RegexValidator(ascii_e_numeros_re,
                                          ugettext('Conteudo invalido. Deve conter somente letras e numeros'),
                                          'invalid')


class SplitWidget(widgets.MultiWidget):
    def __init__(self, attrs=None, split_into=4, value_size=None):
        assert isinstance(split_into, int) and split_into > 0, '"split_into" parameter expect a positive integer'
        if value_size is None:
            self.value_size = self.split_into
        assert isinstance(value_size, int) and split_into > -1, '"value_size" parameter expect a positive integer'
        self.split_into = split_into
        self.value_size = value_size

        _widgets = [widgets.TextInput(attrs=attrs) for __ in range(0, self.value_size, self.split_into)]
        super(SplitWidget, self).__init__(widgets=_widgets, attrs=attrs)
        # print(self.__class__.__name__)
        # pprint(dir(self), depth=2)
        # pprint(dir(self), depth=2)

    def decompress(self, value):
        if value:
            return [value[i: i + self.split_into] for i in range(0, len(value), self.split_into)]
        return [None for __ in range(0, self.value_size, self.split_into)]

    def value_from_datadict(self, data, files, name):
        print('value_from_datadict:')
        pprint(locals())
        return super(SplitWidget, self).value_from_datadict(data, files, name)


class SplitedHashField2(forms.MultiValueField):
    default_validators = [validate_ascii_e_numeros]

    def __init__(self, split_into=4, fields=(), *args, **kwargs):
        assert isinstance(split_into, int) and split_into > 0, '"split_into" parameter expect a positive integer'
        value_size = len(kwargs.get('initial')) if kwargs.get('initial', None) else None
        self.max_length = split_into
        self.min_length = split_into
        self.split_into = split_into
        if not fields:
            fields = [forms.RegexField(regex=ascii_e_numeros_re, max_length=self.max_length, min_length=self.min_length) for _ in range(0, self.split_into)]
        super(SplitedHashField2, self).__init__(fields, *args, **kwargs)

        self.widget = SplitWidget(split_into=self.split_into, value_size=value_size)
        # if self.max_length is not None:
        #     self.validators.append(validators.MinLengthValidator(int(self.max_length)))
        # if self.min_length is not None:
        #     self.validators.append(validators.MaxLengthValidator(int(self.min_length)))
        # print(self.__class__.__name__)
        # pprint(dir(self), depth=2)

    def clean(self, value):
        pre_clean = super(SplitedHashField2, self).clean(value)
        print('clean', value)
        # if pre_clean:
        #     for data in pre_clean:
        #         if data and len(data) < self.split_into:
        #             raise ValidationError(self.error_messages['required'], code='required')
        #         else:
        #             raise ValidationError(self.error_messages['required'], code='required')
        return ''.join(pre_clean)

    def to_python(self, value):
        print('pre_to_python:', value)
        # value = ''.join(value)
        ret = super(SplitedHashField2, self).to_python(value)
        print('to_python:', value)
        return ret

    def validate(self, value):
        print('validate:', value)
        # if value:
        #     for data in value:
        #         if data and len(data) < self.split_into:
        #             raise ValidationError(self.error_messages['required'], code='required')
        #         else:
        #             raise ValidationError(self.error_messages['required'], code='required')
        return super(SplitedHashField2, self).validate(value)

    def compress(self, data_list):
        return ''.join(data_list)


class SplitedHashWidget(widgets.MultiWidget):
    def __init__(self, attrs=None, step=4):
        assert isinstance(step, int) and step > 0, '"split_into" parameter expect a positive integer'
        self.step = step
        _widgets = [widgets.TextInput(attrs=attrs) for __ in range(0, self.step)]
        super(SplitedHashWidget, self).__init__(widgets=_widgets, attrs=attrs)

    def decompress(self, value):
        if value:
            return [value[i: i + self.step] for i in range(0, len(value), self.step)]
        return [None for __ in range(0, self.step)]


class SplitedHashField(forms.MultiValueField):
    def __init__(self, step=4, *args, **kwargs):
        assert isinstance(step, int) and step > 0, '"split_into" parameter expected positive integer'
        self.max_length = step
        self.min_length = step
        self.step = step
        super(SplitedHashField, self).__init__(*args, **kwargs)
        self.widget = SplitedHashWidget(step=self.step)
        if self.max_length is not None:
            self.validators.append(validators.MinLengthValidator(int(self.max_length)))
        if self.min_length is not None:
            self.validators.append(validators.MaxLengthValidator(int(self.min_length)))
        # print(self)

    def widget_attrs(self, widget):
        attrs = super(SplitedHashField, self).widget_attrs(widget)
        if self.max_length is not None:
            # The HTML attribute is maxlength, not max_length.
            attrs.update({'maxlength': str(self.max_length)})
        return attrs

    def validate(self, value):
        print('value:', value, 'len:', len(value))

        return super(SplitedHashField, self).validate(value)

    def compress(self, data_list):
        if data_list:
            for data in data_list:
                if data and len(data) < self.step:
                    raise ValidationError(self.error_messages['required'], code='required')
                else:
                    raise ValidationError(self.error_messages['required'], code='required')
        return ''.join(data_list)


class SplitField2(forms.MultiValueField):
    widget = SplitedHashWidget

    def __init__(self, step=4, fields=(), *args, **kwargs):
        assert isinstance(step, int) and step > 0
        self.step = step
        fields = tuple(
            [forms.CharField(max_length=self.step, min_length=self.step) for __ in range(0, self.step)]
        )
        super(SplitField2, self).__init__(fields=fields, *args, **kwargs)

    def widget_attrs(self, widget):
        a = widget

        ret = super(SplitField2, self).widget_attrs(widget)
        ret.update(
            {
                'onkeyup': "saltaCampo(this,4,5);"
            }
        )
        return ret
