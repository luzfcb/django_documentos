# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import autocomplete_light

from .settings import USER_MODEL
from .utils.module_loading import get_real_model_class


class UserAutocomplete(autocomplete_light.AutocompleteModelBase):
    search_fields = ['^first_name', 'last_name']
    model = get_real_model_class(USER_MODEL)
    order_by = ['first_name', 'last_name']

    limit_choices = 10
    attrs = {
        'data-autcomplete-minimum-characters': 0,
        'placeholder': 'Pessoa que irá assinar',
    }
    # widget_attrs = {'data-widget-maximum-values': 3}

    def choice_label(self, choice):
        return choice.get_full_name()

    def choices_for_request(self):
        return super(UserAutocomplete, self).choices_for_request()


autocomplete_light.register(UserAutocomplete)
