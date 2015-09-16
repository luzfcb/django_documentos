# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

import os
import sys

import pytest

__author__ = 'luzfcb'

__all__ = (
    'gerar_identificador',
    'NonPositiveIntegerException',
    'StrNonConvertibleToIntegerException',
    'MaxIntegerException',
)

PY3 = sys.version_info[0] == 3
if PY3:
    text_type = str
else:
    text_type = unicode

DOCUMENT_MAX_DIGITS = 20
DOCUMENT_VERSION_MAX_DIGITS = 20


class NonPositiveIntegerException(ValueError):
    pass


class StrNonConvertibleToIntegerException(ValueError):
    pass


class MaxIntegerException(ValueError):
    pass


def gerar_identificador(numero_documento, numero_versao, zeros_documento=8, zeros_versao=3):
    """
    Cria e retorna um str identificador no formato 99999999v999
    onde 9 é um numero inteiro de 0 a 9

    :param numero_documento: positive int or positive int as str
    :param numero_versao: positive int or positive int as str
    :param zeros_documento: positive int or positive int as str default=8
    :param zeros_versao: positive int or positive int as str default=3
    :return: unicode str
    """

    # if function parameters not is instance of unicode or int, raise exception
    if not any(map(lambda valor: isinstance(valor, (text_type, int)),
                   (numero_documento, numero_versao, zeros_documento, zeros_versao))):
        raise ValueError('The parameters only accept positive integers or positive integers as str')

    # if parameters not is castable to int, raise exception
    n_documento, n_versao, zeros_doc, zeros_ver = text_type(numero_documento).strip(text_type('0')), text_type(
        numero_versao).strip(text_type('0')), text_type(
        zeros_documento).strip(text_type('0')), text_type(zeros_versao).strip(text_type('0'))

    try:
        n_documento, n_versao, zeros_doc, zeros_ver = int(n_documento), int(n_versao), int(zeros_doc), int(zeros_ver)
    except ValueError as e:
        raise StrNonConvertibleToIntegerException('Impossible cast the value {} to int'.format(e))

    if zeros_doc > DOCUMENT_MAX_DIGITS:
        raise MaxIntegerException(
            'The parameter zeros_documento has exceeded the maximum value. The max value is {}'.format(
                DOCUMENT_MAX_DIGITS))

    if zeros_ver > DOCUMENT_VERSION_MAX_DIGITS:
        raise MaxIntegerException(
            'The parameter zeros_versao has exceeded the maximum value. The max value is {}'.format(
                DOCUMENT_VERSION_MAX_DIGITS))

    # if function parameters is less than 0, raise exception
    if any(map(lambda valor: int(valor) < 0, (n_documento, n_versao, zeros_doc, zeros_ver))):
        raise NonPositiveIntegerException('The parameters only accept positive integers or positive integers as str')

    # determine the max legth of numero_documento and numero_versao based on values of zeros_documento and zeros_versao
    max_value_numero_documento = int('9' * zeros_doc)
    max_value_numero_versao = int('9' * zeros_ver)

    if n_documento > max_value_numero_documento:
        raise MaxIntegerException(
            'The parameters numero_documento max value is {}'.format(max_value_numero_documento))
    if n_versao > max_value_numero_versao:
        raise MaxIntegerException('The parameters numero_versao max value is {}'.format(max_value_numero_versao))

    return '{numero_doc:0>{num_zeros_doc}}v{numero_versao:0>{num_zeros_versao}}'.format(
        num_zeros_doc=zeros_doc, num_zeros_versao=zeros_ver, numero_doc=n_documento,
        numero_versao=n_versao)


def test_todos_os_parametros_sao_inteiros_positivos():
    assert gerar_identificador(601, 22, 8, 3) == text_type('00000601v022')


def test_todos_algum_dos_parametros_eh_str_convertivel_para_inteiro():
    assert gerar_identificador('601', 22, 8, 3) == text_type('00000601v022')


def test_algum_dos_parametros_eh_str_precedida_de_zero_convertivel_para_inteiro():
    assert gerar_identificador('0601', 22, 8, 3) == text_type('00000601v022')
#
# def test_algum_dos_parametros_eh_str_precedida_de_zero_convertivel_para_inteiro():
#     assert gerar_identificador('0601', 22, 8, 3) == text_type('00000601v022')

# gerar_identificador("001", "001", 0, 0)
def test_todos_algum_dos_parametros_eh_negativo():
    with pytest.raises(NonPositiveIntegerException):
        gerar_identificador(-601, 22, 8, 3)


def test_todos_algum_dos_parametros_eh_nome_negatigo_contendo_str_convertivel_para_inteiro():
    with pytest.raises(NonPositiveIntegerException):
        gerar_identificador('-601', 22, 8, 3)


def test_parametro_numero_documento_eh_maior_que_valor_maximo_definido_por_quantidade_de_zeros_documento():
    with pytest.raises(MaxIntegerException):
        gerar_identificador(900000001, 22, 8, 3)


def test_parametro_numero_documento_eh_str_convertivel_para_inteiro_maior_que_valor_maximo_definido_por_quantidade_de_zeros_documento():
    with pytest.raises(MaxIntegerException):
        gerar_identificador('900000001', 22, 8, 3)


def test_parametro_numero_versao_eh_maior_que_valor_maximo_definido_por_quantidade_de_zeros_versao():
    with pytest.raises(MaxIntegerException):
        gerar_identificador(601, 9001, 8, 3)


def test_parametro_numero_versao_eh_str_convertivel_para_inteiro_maior_que_valor_maximo_definido_por_quantidade_de_zeros_versao():
    with pytest.raises(MaxIntegerException):
        gerar_identificador(601, '9001', 8, 3)


def test_parametro_zeros_documento_eh_maior_que_valor_maximo():
    with pytest.raises(MaxIntegerException):
        gerar_identificador(601, 22, 999999999999999, 3)


def test_parametro_zeros_versao_eh_maior_que_valor_maximo():
    with pytest.raises(MaxIntegerException):
        gerar_identificador(601, 22, 8, 999999999999999)


# def test_algum_dos_parametros_eh_octal_e_se_sim_levanta_exception():
#     if PY3:
#         # pula o teste, porque o interpretador ja levanta o exception sozinho
#         assert True
#     else:
#         with pytest.raises(SyntaxError):
#             gerar_identificador(0601, 22, 8, 3)


if __name__ == "__main__":
    pytest.main(args=['-vv', os.path.join(__file__)], )
