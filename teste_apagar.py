from django.http import QueryDict
from pprint import pprint

primeira_url = 'http://127.0.0.1:8004/?popup=1&next=/list/?teste=1'

doc = {
    'document': 123
}

query_string_primeira_url = {
    'popup': 1,
    'next': '/list/?teste=1'
}

qd = QueryDict('', mutable=True)


qd.update(
    query_string_primeira_url
)

segunda_url = ''
query_string_esperado = '/list/?teste=1&document=123'
assert query_string_esperado

a = u'/list/?teste=1'
doc = {u'document': 121}