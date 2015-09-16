# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.utils import six
from django.utils.http import urlencode, urlunquote
from django.utils.six.moves.urllib.parse import parse_qsl, urlparse, urlunsplit

__all__ = (
    'add_querystrings_to_url',
)


def add_querystrings_to_url(url, querystrings_dict):
    uri = url

    while True:
        dec = urlunquote(uri)
        if dec == uri:
            break
        uri = dec

    parsed_url = urlparse(urlunquote(uri))

    current_params = dict(parse_qsl(parsed_url.query))
    current_params.update(
        querystrings_dict
    )

    parsed_params = {
        key: (lambda x: x, urlunquote)[isinstance(value, six.string_types)](value)
        for key, value in six.iteritems(current_params)
    }

    from pprint import pprint
    encoded_params = urlencode(parsed_params)
    pprint(parsed_params)

    # print('uri:', uri)

    new_url = urlunsplit((parsed_url.scheme, parsed_url.netloc, parsed_url.path.rstrip('\n\r').lstrip('\n\r'),
                          encoded_params, parsed_url.fragment))
    # print('new_url:', new_url)

    return new_url


# def mount_dynamic_form(request):
#
#     dynamic_fields = {
#     'nome': fields.CharField(max_length=100, required=True, label='Nome', initial='Gustavo'),
#     'idade': fields.IntegerField(label='Idade', min_value=0),
#     'email': fields.EmailField(max_length=200, required=False, label='E-mail')
#     }
#
#     DynamicForm = type('', (forms.Form,), dynamic_fields)
#     form = DynamicForm()
#
#     return render_to_response('your_path/page.html',
#     {'form': form},
#     context_instance=RequestContext(request))
#     }
