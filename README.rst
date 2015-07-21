=============================
django_documentos
=============================

.. image:: https://badge.fury.io/py/django_documentos.svg
     :target: https://badge.fury.io/py/django_documentos

.. image:: https://travis-ci.org/luzfcb/django_documentos.svg?branch=master
     :target: https://travis-ci.org/luzfcb/django_documentos

.. image:: https://requires.io/github/luzfcb/django_documentos/requirements.svg?branch=master
     :target: https://requires.io/github/luzfcb/django_documentos/requirements/?branch=master
     :alt: Requirements Status

.. image:: http://codecov.io/github/luzfcb/django_documentos/coverage.svg?branch=master
     :target: http://codecov.io/github/luzfcb/django_documentos?branch=master

.. image:: https://landscape.io/github/luzfcb/django_documentos/master/landscape.svg?style=flat
     :target: https://landscape.io/github/luzfcb/django_documentos/master
     :alt: Code Health

.. image:: https://badge.waffle.io/luzfcb/django_documentos.png?label=ready&title=Ready
     :target: https://waffle.io/luzfcb/django_documentos
     :alt: 'Stories in Ready'


Simples sistema de gerenciamento de documentos digitais

Documentation
-------------

The full documentation is at https://django_documentos.readthedocs.org.

Quickstart
----------

Install django_documentos::

    pip install django_documentos

Then use it in a Django Project, put on settings file, into ``INSTALLED_APPS``::

    INSTALLED_APPS = [
        ...
        'simple_history',
        'django_documentos',
    ]

and ``urls`` file::

    from django.conf.urls import include, url
    from django_documentos import django_documentos_urls

    urlpatterns = [
        ...
        url(r'', include(django_documentos_urls, namespace='documentos')),
    ]

Features
--------

* TODO
