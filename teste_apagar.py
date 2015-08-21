# from __future__ import unicode_literals
# # from django.http import QueryDict
# # from django.utils.http import urlunquote, urlquote, urlquote_plus, urlunquote_plus, urlencode, urlparse
#
# from django.utils.six.moves.urllib.parse import (
#     # quote, quote_plus, unquote, unquote_plus, urlencode as original_urlencode,
#     # urlparse,
#     parse_qs,
#     urlsplit,
#     urlunparse
# )
# # from pprint import pprint
# #
# # primeira_url = 'http://127.0.0.1:8004/d/create/?popup=1&amp;next=http://another.com/list/?test=1&amp;test2=2'
# #
# # url_next_encoded = 'http%3A%2F%2F127.0.0.1%3A8004%2Fd%2Fcreate%2F%3Fpopup%3D1%26next%3Dhttp%253A%252F%252Fanother.com%252Flist%252F%253Ftest%253D1%2526test2%253D2'
# #
# #
# # doc = {
# #     'document': 123
# # }
# #
# # # print(urlunquote(primeira_url))
# # #
# # # print(urlquote(primeira_url))
# # #
# # # print(urlquote_plus(primeira_url))
# #
# # uncoted_next = urlunquote_plus(url_next_encoded)
# # uncoted_next2 = urlunquote(url_next_encoded)
# # print(uncoted_next)
# # print(uncoted_next2)
# # print(urlparse(uncoted_next))
# # scheme, netloc, path, params, query, fragment = urlparse(url_next_encoded)
# # print("query:", query)
# #
# # scheme, netloc, path, params, query, fragment = urlparse(uncoted_next)
# # print("query:", query)
# #
# # print(parse_qs(query))
# # # print(urlencode(primeira_url))
# #
# # query_string_primeira_url = {
# #     'popup': 1,
# #     'next': '/list/?teste=1'
# # }
# # tu = (
# #     ('popup', '1'),
# #     ('next', '/list/?teste=1'),
# # )
# #
# # scheme, netloc, url, params, query, fragment, a, b = urlunparse(tu)
# # print(scheme, netloc, url, params, query, fragment)
# # #
# # # qd = QueryDict('', mutable=True)
# # #
# # #
# # # qd.update(
# # #     query_string_primeira_url
# # # )
# # #
# # # segunda_url = ''
# # # query_string_esperado = '/list/?teste=1&document=123'
# # # assert query_string_esperado
# # #
# # # a = u'/list/?teste=1'
# # # doc = {u'document': 121}
# #
# # # https://gist.github.com/luzfcb/c8d9a53fb4665546a0df
#
#
#
#
# url = '%0A%0Ahttp%3A%2F%2Fanother.com%2Flist%2F%3Ftest%3D1%26test2%3D2'
#
# param_dict = {
#     'doc': 123,
#     'outro': '%2Flist%2F%3Ftest%3D5%26other%3D6'
# }
#
# # from profilehooks import profile
# # # import urllib
# # # import urlparse
# # from collections import OrderedDict
# # from django.utils import six
# # from django.utils.http import urlencode, urlunquote
# # from django.utils.six.moves.urllib.parse import (
# #     urlparse,
# #     unquote,
# #     unquote_plus,
# #     parse_qsl,
# #     urlunsplit
# # )
# #
# #
# # # url + parametros_adicionais ????
# # # eu gostaria de obter algo como (versao nao encodada)
# # # http://another.com/list/?test=1&test2=2&doc=123&outro=/list/?test=5&other=6
# # @profile
# # def adiciona_parametros(url, param_dict):
# #     parsed_url = urlparse(urlunquote(url))
# #     current_params = dict(parse_qsl(parsed_url.query))
# #     param_dict.update(current_params)
# #
# #     parsed_params = {
# #         key: (lambda x: x, urlunquote)[isinstance(value, six.string_types)](value)
# #         for key, value in param_dict.items()
# #         }
# #
# #     encoded_params = urlencode(parsed_params)
# #
# #     print(parsed_url.path)
# #     result_url = "{}?{}".format(parsed_url.path.replace(r'\n', ""), encoded_params)
# #     print(result_url)
# #
# #
# # @profile
# # def adiciona_parametros2(url, new_params_dict):
# #     parsed_url = urlparse(urlunquote(url))
# #
# #     current_params = dict(parse_qsl(parsed_url.query))
# #     current_params.update(
# #         new_params_dict
# #     )
# #
# #     parsed_params = {
# #         key: (lambda x: x, urlunquote)[isinstance(value, six.string_types)](value)
# #         for key, value in current_params.items()
# #         }
# #
# #     encoded_params = urlencode(parsed_params)
# #
# #     url_fixed = parsed_url.path.rstrip('\n\r').lstrip('\n\r')
# #     result_url = "{}?{}".format(url_fixed, encoded_params)
# #     return result_url
# #
#
# from django.utils import six
# from django.utils.http import urlencode, urlunquote
# from django.utils.six.moves.urllib.parse import (
#     urlparse,
#     parse_qsl,
#     urlunsplit
# )
#
#
# def add_querystrings_to_url(url, querystrings_dict):
#
#     uri = url
#
#     while True:
#         dec = urlunquote(uri)
#         if dec == uri:
#             break
#         uri = dec
#
#     parsed_url = urlparse(urlunquote(url))
#
#     current_params = dict(parse_qsl(parsed_url.query))
#     current_params.update(
#         querystrings_dict
#     )
#
#     parsed_params = {
#         key: (lambda x: x, urlunquote)[isinstance(value, six.string_types)](value)
#         for key, value in six.iteritems(current_params)
#         }
#
#     encoded_params = urlencode(parsed_params)
#
#     new_url = urlunsplit((parsed_url.scheme, parsed_url.netloc, parsed_url.path.rstrip('\n\r').lstrip('\n\r'),
#                           encoded_params, parsed_url.fragment))
#     return new_url
#
#
#
# print('###')
# print(add_querystrings_to_url(url, param_dict))
# print('###')
#
# # print('---------')
# #
# # print('###')
# # print(adiciona_parametros2(url, param_dict))
# # print('###')
# #
# # print('---------')
# #
# # print('###')
# # print(adiciona_parametros3(url, param_dict))

# # print('###')
