from django import forms
from django.forms import widgets


class SplitedHashWidget(widgets.MultiWidget):
    def __init__(self, attrs=None, step=4):
        assert isinstance(step, int) and step > 0
        self.step = step
        _widgets = [widgets.TextInput(attrs=attrs) for _ in range(0, self.step)]
        super(SplitedHashWidget, self).__init__(widgets=_widgets, attrs=attrs)

    def decompress(self, value):
        if value:
            return [value[i: i + self.step] for i in range(0, len(value), self.step)]
        return [None for _ in range(0, self.step)]


class SplitedHashField(forms.MultiValueField):
    def __init__(self, *args, **kwargs):
        super(SplitedHashField, self).__init__(*args, **kwargs)
        self.widget = SplitedHashWidget()

    def compress(self, data_list):
        return ''.join(data_list)
