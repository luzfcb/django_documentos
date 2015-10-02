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
    def __init__(self, attrs=None, split_into=4, value_size=None, value=None, fields_max_length=None):
        assert isinstance(split_into, int) and split_into > 0, '"split_into" parameter expect a positive integer'
        self.split_into = split_into
        # assert isinstance(value_size, int) and split_into > -1, '"value_size" parameter expect a positive integer'
        self.value_size = value_size or self.split_into
        value = value

        attrs = attrs or {}
        attrbs = []
        fields_max_length = fields_max_length or [len(value[i: i + self.split_into]) for i in
                                                  range(0, len(value), self.split_into)]
        for max_length in fields_max_length:
            at = attrs.copy()
            patterns = r'^[A-Za-z0-9]{{{minlength},{maxlength}}}$'.format(minlength=max_length, maxlength=max_length)

            at.update({'maxlength': max_length, 'minlength': max_length,
                       'data-minlength': max_length,
                       'patterns': patterns,
                       # 'title': 'Insira o valor correto uai'
                       })
            attrbs.append(at)

        _widgets = [widgets.TextInput(attrs=at) for at in attrbs]
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
    # widget = SplitWidget

    def __init__(self, split_into=4, *args, **kwargs):
        assert isinstance(split_into, int) and split_into > 0, '"split_into" parameter expect a positive integer'
        kwargs.pop('widget', None)  # descarta qualquer widget
        value = kwargs.get('initial', None) or 'A' * split_into
        self.value_size = len(value)
        self.split_into = split_into

        fields_max_length = [len(value[i: i + self.split_into]) for i in
                             range(0, len(value), self.split_into)]
        regexes = {}
        fields = []
        for max_length in fields_max_length:
            if not regexes.get(max_length):
                regexes[max_length] = re.compile(
                    r'^[A-Za-z0-9]{{{minlength},{maxlength}}}$'.format(minlength=max_length, maxlength=max_length))
            fields.append(forms.RegexField(regex=regexes[max_length], max_length=max_length, min_length=max_length))

        self.widget = SplitWidget(split_into=self.split_into, value_size=self.value_size, value=value,
                                  fields_max_length=fields_max_length)
        super(SplitedHashField2, self).__init__(fields, *args, **kwargs)
        print('')


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

    def widget_attrs(self, widget):
        print('widget_attrs:', dir(widget))
        a = {
            'split_into': self.split_into, 'value_size': self.value_size
        }

        return a
        # return super(SplitedHashField2, self).widget_attrs(widget)


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
