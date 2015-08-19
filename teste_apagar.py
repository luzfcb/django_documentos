from __future__ import unicode_literals
from django.http import QueryDict
from django.utils.http import urlunquote, urlquote, urlquote_plus, urlunquote_plus, urlencode, urlparse
from django.utils.six.moves.urllib.parse import (
   # quote, quote_plus, unquote, unquote_plus, urlencode as original_urlencode,
    #urlparse,
    parse_qs,
    urlsplit,
    urlunparse
)
from pprint import pprint

primeira_url = 'http://127.0.0.1:8004/d/create/?popup=1&amp;next=http://another.com/list/?test=1&amp;test2=2'

url_next_encoded = 'http%3A%2F%2F127.0.0.1%3A8004%2Fd%2Fcreate%2F%3Fpopup%3D1%26next%3Dhttp%253A%252F%252Fanother.com%252Flist%252F%253Ftest%253D1%2526test2%253D2'


doc = {
    'document': 123
}

# print(urlunquote(primeira_url))
#
# print(urlquote(primeira_url))
#
# print(urlquote_plus(primeira_url))

uncoted_next = urlunquote_plus(url_next_encoded)
uncoted_next2 = urlunquote(url_next_encoded)
print(uncoted_next)
print(uncoted_next2)
print(urlparse(uncoted_next))
scheme, netloc, path, params, query, fragment = urlparse(url_next_encoded)
print("query:", query)

scheme, netloc, path, params, query, fragment = urlparse(uncoted_next)
print("query:", query)

print(parse_qs(query))
# print(urlencode(primeira_url))

query_string_primeira_url = {
    'popup': 1,
    'next': '/list/?teste=1'
}
tu = (
    ('popup', '1'),
    ('next', '/list/?teste=1'),
)

scheme, netloc, url, params, query, fragment, a, b = urlunparse(tu)
print(scheme, netloc, url, params, query, fragment)
#
# qd = QueryDict('', mutable=True)
#
#
# qd.update(
#     query_string_primeira_url
# )
#
# segunda_url = ''
# query_string_esperado = '/list/?teste=1&document=123'
# assert query_string_esperado
#
# a = u'/list/?teste=1'
# doc = {u'document': 121}

# https://gist.github.com/luzfcb/c8d9a53fb4665546a0df