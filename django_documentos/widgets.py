from django import forms
from django.core import validators
from django.core.exceptions import ValidationError
from django.forms import widgets


class SplitedHashWidget(widgets.MultiWidget):
    def __init__(self, attrs=None, step=4):
        assert isinstance(step, int) and step > 0
        self.step = step
        _widgets = [widgets.TextInput(attrs=attrs) for __ in range(0, self.step)]
        super(SplitedHashWidget, self).__init__(widgets=_widgets, attrs=attrs)

    def decompress(self, value):
        if value:
            return [value[i: i + self.step] for i in range(0, len(value), self.step)]
        return [None for __ in range(0, self.step)]


class SplitedHashField(forms.MultiValueField):
    def __init__(self, step=4, *args, **kwargs):
        assert isinstance(step, int) and step > 0
        self.max_length = step
        self.min_length = step
        self.step = step
        super(SplitedHashField, self).__init__(*args, **kwargs)
        self.widget = SplitedHashWidget(step=self.step)
        if self.max_length is not None:
            self.validators.append(validators.MinLengthValidator(int(self.max_length)))
        if self.min_length is not None:
            self.validators.append(validators.MaxLengthValidator(int(self.min_length)))

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
