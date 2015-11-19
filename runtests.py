#! /usr/bin/env python
from __future__ import print_function

import subprocess
import sys

import pytest

PYTEST_ARGS = {
    'default': ['tests', '--tb=short'],
    'fast': ['tests', '--tb=short', '-q'],
}

FLAKE8_ARGS = ['django_documentos', 'tests', '--ignore=E501']

ISORT_ARGS = ['--recursive', '--check-only', 'django_documentos', 'tests']


def exit_on_failure(ret, message=None):
    if ret:
        sys.exit(ret)


def flake8_main(args):
    print('Running flake8 code linting')
    ret = subprocess.call(['flake8'] + args)
    print('flake8 failed' if ret else 'flake8 passed')
    return ret


def isort_main(args):
    print('Running isort code checking')
    ret = subprocess.call(['isort'] + args)

    if ret:
        print('\nisort failed: Some modules have incorrectly ordered imports')
        print('To show errors, run: `isort --recursive . --check-only`')
        print('To automatic try fix the errors, run: `isort --recursive .`')
    else:
        print('isort passed')

    return ret


def split_class_and_function(string):
    class_string, function_string = string.split('.', 1)
    return "%s and %s" % (class_string, function_string)


def is_function(string):
    # `True` if it looks like a test function is included in the string.
    return string.startswith('test_') or '.test_' in string


def is_class(string):
    # `True` if first character is uppercase - assume it's a class name.
    return string[0] == string[0].upper()


if __name__ == "__main__":
    try:
        sys.argv.remove('--nolint')
    except ValueError:
        run_flake8 = True
        run_isort = True
    else:
        run_flake8 = False
        run_isort = False

    try:
        sys.argv.remove('--lintonly')
    except ValueError:
        run_tests = True
    else:
        run_tests = False

    try:
        sys.argv.remove('--fast')
    except ValueError:
        style = 'default'
    else:
        style = 'fast'
        run_flake8 = False
        run_isort = False

    try:
        sys.argv.remove('-v')
    except ValueError:
        verbose = False
    else:
        verbose = True

    try:
        sys.argv.remove('-df')
    except ValueError:
        diff = False
    else:
        diff = True

    if len(sys.argv) > 1:
        pytest_args = sys.argv[1:]
        first_arg = pytest_args[0]
        if first_arg.startswith('-'):
            # `runtests.py [flags]`
            pytest_args = ['tests'] + pytest_args
        elif is_class(first_arg) and is_function(first_arg):
            # `runtests.py TestCase.test_function [flags]`
            expression = split_class_and_function(first_arg)
            pytest_args = ['tests', '-k', expression] + pytest_args[1:]
        elif is_class(first_arg) or is_function(first_arg):
            # `runtests.py TestCase [flags]`
            # `runtests.py test_function [flags]`
            pytest_args = ['tests', '-k', pytest_args[0]] + pytest_args[1:]
    else:
        pytest_args = PYTEST_ARGS[style]

    if run_tests:
        exit_on_failure(pytest.main(pytest_args, plugins=['cov', 'sugar']))

    if verbose:
        FLAKE8_ARGS.append('--verbose')
        ISORT_ARGS.append('--verbose')

    if diff:
        ISORT_ARGS.append('--diff')

    if run_flake8:
        exit_on_failure(flake8_main(FLAKE8_ARGS))

    if run_isort:
        exit_on_failure(isort_main(ISORT_ARGS))
