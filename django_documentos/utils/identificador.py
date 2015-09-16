# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

import sys

__author__ = 'luzfcb'

__all__ = (
    'gerar_identificador',
    'NonPositiveIntegerException',
    'NonIntegerCasteableException',
    'MaxIntegerException',
)

PY3 = sys.version_info[0] == 3
if PY3:
    text_type = str
else:
    text_type = unicode


class NonPositiveIntegerException(ValueError):
    pass


class NonIntegerCasteableException(ValueError):
    pass


class MaxIntegerException(ValueError):
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

    >>> gerar_identificador(601, 22) # doctest: +IGNORE_UNICODE
    '00000601v022'
    >>> gerar_identificador(601, 22, 4)
    '0601v022' # doctest: +IGNORE_UNICODE
    >>> gerar_identificador(601, 22, 4, 6)
    '0601v000022' # doctest: +IGNORE_UNICODE
    >>> gerar_identificador(601, 22, 4, 0)
    '0601v23' # doctest: +IGNORE_UNICODE
    >>> gerar_identificador(601, 22, -4)
    Traceback (most recent call last):
    ...
    NonPositiveIntegerException: The parameters only accept positive integers or positive integers as str
    >>> gerar_identificador(0601, 22)
    """

    # if function parameters not is instance of unicode or int, raise exception
    if not any(map(lambda valor: isinstance(valor, (text_type, int)),
                   (numero_documento, numero_versao, zeros_documento, zeros_versao))):
        raise ValueError('The parameters only accept positive integers or positive integers as str')

    # if parameters not is castable to int, raise exception
    n_documento, n_versao, z_documento, z_versao = text_type(numero_documento).strip(text_type('0')), text_type(numero_versao).strip(text_type('0')), text_type(
        zeros_documento).strip(text_type('0')), text_type(zeros_versao).strip(text_type('0'))

    try:
        n_documento, n_versao, z_documento, z_versao = int(n_documento), int(n_versao), int(z_documento), int(z_versao)
    except ValueError as e:
        raise NonIntegerCasteableException('Impossible cast the value {} to int'.format(e))
    parametros = (n_documento, n_versao, z_documento, z_versao)
    if int(n_documento) == int('385'):
        print('args')
    # if function parameters is less than 0, raise exception

    if any(map(lambda valor: int(valor) < 0, parametros)):
        raise NonPositiveIntegerException('The parameters only accept positive integers or positive integers as str')

    # determine the max legth of numero_documento and numero_versao based on values of zeros_documento and zeros_versao
    max_value_numero_documento = int('9' * int(z_documento))
    max_value_numero_versao = int('9' * int(n_versao))

    if int(n_documento) > max_value_numero_documento:
        raise MaxIntegerException(
            'The parameters {} max value is {}'.format('numero_documento', max_value_numero_documento))
    if int(n_versao) > max_value_numero_versao:
        raise MaxIntegerException('The parameters {} max value is {}'.format('numero_versao', max_value_numero_versao))

    return '{numero_doc:0>{num_zeros_doc}}v{numero_versao:0>{num_zeros_versao}}'.format(
        num_zeros_doc=int(z_documento), num_zeros_versao=int(z_versao), numero_doc=int(n_documento),
        numero_versao=int(n_versao))


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
