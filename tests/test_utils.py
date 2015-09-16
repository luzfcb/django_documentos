import pytest

from django_documentos.utils import identificador


def test_gerar_identificador_all_parameter_is_positive_interger():
    value = identificador.gerar_identificador(601, 22, 8, 3)
    assert identificador.text_type(value) == identificador.text_type('00000601v022')


def test_gerar_identificador_any_parameter_is_non_positive_interger():
    with pytest.raises(identificador.NonPositiveIntegerException):
        identificador.gerar_identificador(601, 22, 8, -3)


def test_gerar_identificador_any_parameter_is_str_non_convertible_to_integer():
    with pytest.raises(identificador.StrNonConvertibleToIntegerException):
        identificador.gerar_identificador('a601', 22, 8, 3)


def test_gerar_identificador_any_parameter_is_str_convertible_to_integer():
    value = identificador.gerar_identificador('0601', 22)
    assert identificador.text_type(value) == identificador.text_type('00000601v022')


def test_gerar_identificador_parameter_numero_documento():
    value = identificador.gerar_identificador('0601', 22)
    assert identificador.text_type(value) == identificador.text_type('00000601v022')


def test_gerar_identificador_foo():
    assert identificador.text_type(identificador.gerar_identificador('0601', 22)) == identificador.text_type(
        '00000601v022')
