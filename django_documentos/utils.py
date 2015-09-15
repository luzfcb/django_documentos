# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import sys

from django.utils import six
from django.utils.http import urlencode, urlunquote
from django.utils.six.moves.urllib.parse import parse_qsl, urlparse, urlunsplit

__all__ = (
    'add_querystrings_to_url',
    'gerar_identificador',
    'NonPositiveIntegerException'
)

PY3 = sys.version_info[0] == 3
if PY3:
    text_type = str
else:
    text_type = unicode


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

class NonPositiveIntegerException(Exception):
    pass


def gerar_identificador(numero_documento, numero_versao, zeros_documento=8, zeros_versao=3):
    """
    Cria e retorna um str identificador no formato ########v###
    onde # é um numero inteiro

    :param numero_documento: positive int or positive int as str
    :param numero_versao: positive int or positive int as str
    :param zeros_documento: positive int or positive int as str default=8
    :param zeros_versao: positive int or positive int as str default=3
    :return: str

    >>> gerar_identificador(601, 22)
    '00000601v022' # doctest: +IGNORE_UNICODE
    >>> gerar_identificador(601, 22, 4)
    '0601v022' # doctest: +IGNORE_UNICODE
    >>> gerar_identificador(601, 22, 4, 6)
    '0601v000022' # doctest: +IGNORE_UNICODE
    >>> gerar_identificador(601, 22, 4, 0)
    '0601v22' # doctest: +IGNORE_UNICODE
    >>> gerar_identificador(601, 22, -4)
    Traceback (most recent call last):
    ...
    NonPositiveIntegerException: The parameters only accept positive integers or positive integers as str
    """
    parameters = (numero_documento, numero_versao, zeros_documento, zeros_versao)

    if any(map(lambda valor: int(valor) < 0, parameters)):
        raise NonPositiveIntegerException('The parameters only accept positive integers or positive integers as str')

    return '{numero_doc:0>{num_zeros_doc}}v{numero_versao:0>{num_zeros_versao}}'.format(
        num_zeros_doc=zeros_documento, num_zeros_versao=zeros_versao, numero_doc=numero_documento,
        numero_versao=numero_versao)


if __name__ == "__main__":
    import re
    import doctest

    # https://github.com/runfalk/spans/blob/master/spans/tests/__init__.py
    # Add unicode ignore functionality to doctest
    IGNORE_UNICODE = doctest.register_optionflag("IGNORE_UNICODE")

    class UnicodeIgnoreOutputChecker(doctest.OutputChecker):
        """
        Output checker for doctests that strips unicode literal prefixes from the
        expected output string. This is necessary for compatibility with both Python
        2 and 3. Example use:
            >>> u'Sample unicode string' # doctest: +IGNORE_UNICODE
            u'Sample unicode string'
        """

        _literal_re = re.compile(r"(\W|^)[uU]([rR]?[\'\"])", re.UNICODE)

        def check_output(self, want, got, optionflags):
            if optionflags & IGNORE_UNICODE and PY3:
                want = re.sub(self._literal_re, r'\1\2', want)

            # OutputChecker seems to be an old style class so super() can't be used
            # for Python 2
            if PY3:
                return super(UnicodeIgnoreOutputChecker, self).check_output(
                    want, got, optionflags)
            else:
                return doctest.OutputChecker.check_output(
                    self, want, got, optionflags)

    doctest.DocTestSuite(module=sys.modules[__name__], checker=UnicodeIgnoreOutputChecker())
