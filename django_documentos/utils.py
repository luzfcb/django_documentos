# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.utils import six
from django.utils.http import urlencode, urlunquote
from django.utils.six.moves.urllib.parse import parse_qsl, urlparse, urlunsplit

__all__ = (
    'add_querystrings_to_url',
)


def add_querystrings_to_url(url, querystrings_dict):
    parsed_url = urlparse(urlunquote(url))

    current_params = dict(parse_qsl(parsed_url.query))
    current_params.update(
        querystrings_dict
    )

    parsed_params = {
        key: (lambda x: x, urlunquote)[isinstance(value, six.string_types)](value)
        for key, value in six.iteritems(current_params)
    }

    encoded_params = urlencode(parsed_params)

    new_url = urlunsplit((parsed_url.scheme, parsed_url.netloc, parsed_url.path.rstrip('\n\r').lstrip('\n\r'),
                          encoded_params, parsed_url.fragment))
    return new_url
