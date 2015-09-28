from django import forms
from .utils import intercalar


class SplitedHashWidget(forms.MultiWidget):
    def __init__(self, *args, **kwargs):
        super(SplitedHashWidget, self).__init__(*args, **kwargs)
        self.widgets = [
            forms.TextInput(),
            forms.TextInput(),
            forms.TextInput(),
            forms.TextInput()
        ]

    def decompress(self, value):
        if value:
            return intercalar(value, a_cada=4, caracter='.')
        return [None, None, None, None]


class SplitedHashField(forms.MultiValueField):
    widget = SplitedHashWidget
