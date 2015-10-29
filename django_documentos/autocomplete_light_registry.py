# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import autocomplete_light
from django.utils.encoding import force_text

from .settings import USER_MODEL
from .utils.module_loading import get_real_model_class


class UserAutocomplete(autocomplete_light.AutocompleteModelBase):
    search_fields = [
        '^first_name',
        'last_name',
        'username'
    ]
    model = get_real_model_class(USER_MODEL)
    order_by = ['first_name', 'last_name']
    # choice_template = 'django_documentos/user_choice_autocomplete.html'


    limit_choices = 10
    attrs = {
        'data-autcomplete-minimum-characters': 0,
        'placeholder': 'Pessoa que irá assinar',
    }
    # widget_attrs = {'data-widget-maximum-values': 3}

    def choice_value(self, choice):
        """
        Return the pk of the choice by default.
        """
        return choice.pk

    def choice_label(self, choice):
        """
        Return the textual representation of the choice by default.
        """
        # return force_text("{}-{}".format(choice.pk, choice.get_full_name().title()))return force_text("{}-{}".format(choice.pk, choice.get_full_name().title()))
        return force_text(choice.get_full_name().title())

    # def choice_label(self, choice):
    #     return choice.get_full_name().title()

    def choices_for_request(self):
        return super(UserAutocomplete, self).choices_for_request()


autocomplete_light.register(UserAutocomplete)
