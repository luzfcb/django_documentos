import pytest

from django_documentos.utils import identificador


def test_document_601_22():
    assert identificador.document(601, 22) == '00000601v022'


def test_document_100000000_22():
    with pytest.raises(AssertionError) as excinfo:
        identificador.document(99999999, 22)
        identificador.document(100000000, 22)
    assert 'Number dont fit size' in str(excinfo.value)


def test_document_str_000000000000000000601_22():
    # ainda estou me perguntando se eu deveria mesmo interpretar
    # "000000000000000000601" como 601
    try:
        identificador.document('000000000000000000601', 22)
    except AssertionError:
        pytest.fail("Isto nao deveria levantar um erro")


def test_document_parametro_negativo():
    with pytest.raises(AssertionError) as excinfo:
        identificador.document(-601, 22)
    assert 'Expected positive integer' in str(excinfo.value)


def test_document_parametro_negativo_str():
    with pytest.raises(AssertionError) as excinfo:
        identificador.document('-601', 22)
    assert 'Expected positive integer' in str(excinfo.value)


# def test_document_0x601_22():
#     with pytest.raises(AssertionError):
#         identificador.document(0x601, 22)
