import autocomplete_light
from django.conf import settings

USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')


class UserAutocomplete(autocomplete_light.AutocompleteModelBase):
    search_fields = ['^first_name', 'last_name']

    def choice_label(self, choice):
        return choice.get_full_name()


autocomplete_light.register(USER_MODEL, UserAutocomplete)
