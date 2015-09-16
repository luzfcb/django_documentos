#!/usr/bin/env python
# -*- coding: utf-8 -*-


import os
import sys

import django_documentos

try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

version = django_documentos.__version__

if sys.argv[-1] == 'publish':
    os.system('python setup.py sdist upload')
    print("You probably want to also tag the version now:")
    print("  git tag -a %s -m 'version %s'" % (version, version))
    print("  git push --tags")
    sys.exit()

with open('README.rst') as readme_file:
    readme = readme_file.read()

with open('HISTORY.rst') as history_file:
    history = history_file.read().replace('.. :changelog:', '')

requirements = [
    # 'django-simple-history',
    # 'django-model-utils',
    # 'django-extra-views',
]
# django-model-utils
# -e git://github.com/luzfcb/django-simple-history.git@patch-2#egg=django-simple-history
# -e git://github.com/maraujop/django-crispy-forms.git@dev#egg=django-crispy-forms

test_requirements = [
    'pytest',
    'pytest-django',
    'django-wkhtmltopdf',
]

long_description = readme + '\n\n' + history

if sys.argv[-1] == 'readme':
    print(long_description)
    sys.exit()

setup(
    name='django_documentos',
    version=version,
    description="""Simples sistema de gerenciamento de documentos digitais""",
    long_description=long_description,
    author='Fabio C. Barrionuevo da Luz',
    author_email='bnafta@gmail.com',
    url='https://github.com/luzfcb/django_documentos',
    packages=[
        'django_documentos',
    ],
    include_package_data=True,
    install_requires=requirements,
    license="BSD",
    zip_safe=False,
    keywords='django_documentos',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Natural Language :: English',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
    ],
)
