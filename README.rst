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

.. image:: https://www.quantifiedcode.com/api/v1/project/a7178204202b440180822033f188e543/badge.svg
    :target: https://www.quantifiedcode.com/app/project/a7178204202b440180822033f188e543
    :alt: Code issues

.. image:: https://badge.waffle.io/luzfcb/django_documentos.png?label=ready&title=Ready
    :target: https://waffle.io/luzfcb/django_documentos
    :alt: 'Stories in Ready'


Note:
    WIP - incomplete and non-functional work !!!
    
    Incompleto, feio e não funciona :-P

Simples sistema de gerenciamento de documentos digitais

Documentation
-------------

The full documentation is at https://django_documentos.readthedocs.org.

Quickstart
----------

Requirements::

    pip install -e git://github.com/luzfcb/django-ckeditor.git@update-to-4.5.4#egg=django-ckeditor
    pip install -e git://github.com/luzfcb/django-simple-history.git@wip-generic-views#egg=django-simple-history
    pip install -e git://github.com/maraujop/django-crispy-forms.git@dev#egg=django-crispy-forms
    pip install django-extra-views django-braces django-model-utils django-autocomplete-light django-simple-captcha django-bootstrap-pagination django-wkhtmltopdf


Install django_documentos::

    pip install django_documentos


Then use it in a Django Project, put on settings file, into ``INSTALLED_APPS``::

    INSTALLED_APPS = [
        ...
        'simple_history',
        'autocomplete_light',
        'bootstrap_pagination',
        'extra_views',
        'braces',
        'captcha',
        'crispy_forms',
        'ckeditor',
        'ckeditor_uploader',
    
        'django_documentos',
    ]

and ``urls`` file::

    from django.conf.urls import include, url
    from django_documentos import django_documentos_urls

    urlpatterns = [
        ...
        url(r'^documentos/', include(django_documentos_urls, namespace='documentos')),
        url(r'^ckeditor/', include('ckeditor_uploader.urls')),
        url(r'^captcha/',
            include('captcha.urls'),
            ),
        url(r'^autocomplete/', include('autocomplete_light.urls')),
    ]




Features
--------

* TODO

ROADMAP
--------

Prover uma app plugavel generica para:

criacao de documentos, versionamento dos mesmos, validacao de autenticidade de documentos, templates de docummentos, e auditoria.


TESTES
------

Instale o tox::

    pip install tox -U

para verificar quais os testes estao disponiveis faça::

    tox -l

para rodar todos os testes, simplesmente::

    tox

para rodar somente os testes de qualidade de codigo execute::

    tox -e py27-lint




DEPENDENCIES
-------------

http://download.gna.org/wkhtmltopdf/0.12/0.12.2.1/wkhtmltox-0.12.2.1_linux-trusty-amd64.deb
