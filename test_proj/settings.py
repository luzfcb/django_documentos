# -*- coding: utf-8 -*-
"""
Django settings for test_proj project.

Generated by 'django-admin startproject' using Django 1.8.3.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""
from __future__ import absolute_import, print_function, unicode_literals

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '5#v@%$nk^z0&4mz^cc8$1z+b!ldvvwd&hr&q7fk0h+$@e9+$d*'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 'debug_toolbar',

    'simple_history',

    'bootstrap3',
    'django_extensions',
    'bootstrap_pagination',
    'extra_views',
    'braces',
    'redactor',
    'ckeditor',
    'django_wysiwyg',
    # 'debug_toolbar',
    'django_documentos',
)

# django_wysiwyg
DJANGO_WYSIWYG_FLAVOR = 'ckeditor'

CKEDITOR_UPLOAD_PATH = 'uploads/'
# CKEDITOR_CONFIGS = {
#     'default': {
#         'toolbar': 'Custom',
#         'toolbar_Custom': [
#             ['Bold', 'Italic', 'Underline'],
#             ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
#             ['Link', 'Unlink'],
#             ['RemoveFormat', 'Source'],
#             ["Maximize"]
#         ]
#     }
# }

CKEDITOR_CONFIGS = {
    'default': {
        'skin': 'moono',
        # 'skin': 'office2013',
        'toolbar_Basic': [
            ['Source', '-', 'Bold', 'Italic']
        ],
        # 'toolbar_Full': [
        #     ['Styles', 'Format', 'Bold', 'Italic', 'Underline', 'Strike', 'SpellChecker', 'Undo', 'Redo'],
        #     ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter',
        #      'JustifyRight', 'JustifyBlock'],
        #     ['Link', 'Unlink', 'Anchor'],
        #     ['Flash', 'Table', 'HorizontalRule'],
        #     ['TextColor', 'BGColor'],
        #     ['Smiley', 'SpecialChar'], ['Source'],
        #     ['widget', 'clipboard'],
        #     [''],
        # ],
        # 'toolbar_Full': [
        #     {'name': 'document', 'items': ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates']},
        #     {'name': 'clipboard', 'items': ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
        #     {'name': 'editing', 'items': ['Find', 'Replace', '-', 'SelectAll']},
        #     {'name': 'forms',
        #      'items': ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
        #                'HiddenField']},
        #     '/',
        #     {'name': 'basicstyles',
        #      'items': ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']},
        #     {'name': 'paragraph',
        #      'items': ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-',
        #                'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl',
        #                'Language']},
        #     {'name': 'links', 'items': ['Link', 'Unlink', 'Anchor']},
        #     {'name': 'insert',
        #      'items': ['Image3', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']},
        #     '/',
        #     {'name': 'styles', 'items': ['Styles', 'Format', 'Font', 'FontSize']},
        #     {'name': 'colors', 'items': ['TextColor', 'BGColor']},
        #     {'name': 'tools', 'items': ['Maximize', 'ShowBlocks']},
        #     {'name': 'about', 'items': ['About']},
        #     '/',
        #     {'name': 'extraplugins', 'items': ['Image2', 'Mathjax', 'notification', ]},
        # ],
        'toolbar_Teste': [
            {'name': 'document', 'items': ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates']},
            '/',
            {'name': 'extraplugins', 'items': ['Readonlysections', 'Simplebox', 'Simplebox2', 'Image2', 'Readonlysections2']},
        ],
        'toolbar': 'Teste',
        # 'toolbarGroups': [{ 'name': 'document', 'groups': [ 'mode', 'document', 'doctools' ] }],
        # 'height': 291,
        # 'width': '100%',
        # 'filebrowserWindowHeight': 725,
        # 'filebrowserWindowWidth': 940,
        # 'toolbarCanCollapse': True,
        # 'mathJaxLib': '//cdn.mathjax.org/mathjax/2.2-latest/MathJax.js?config=TeX-AMS_HTML',

        'extraPlugins': ','.join(
            ['readonlysections', 'simplebox', 'simplebox2', 'widget', 'lineutils', 'clipboard', 'dialog', 'dialogui', 'elementspath']),
        # , 'image2', 'mathjax', 'dialog', 'dialogui', 'lineutils', 'clipboard', 'notification', 'notificationaggregator']),
    }
}

# CKEDITOR_CONFIGS['default']['extraPlugins'] = ['clipboard', 'dialog', 'dialogui', 'lineutils', 'widget']


CKEDITOR_IMAGE_BACKEND = 'Pillow'

REDACTOR_UPLOAD_HANDLER = 'redactor.handlers.UUIDUploader'
# REDACTOR_AUTH_DECORATOR = 'django.contrib.auth.decorators.login_required'
REDACTOR_OPTIONS = {'lang': 'pt_br', 'plugins': ['video', 'table', 'fullscreen']}
REDACTOR_UPLOAD = 'uploads/'

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'test_proj.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI_APPLICATION = 'test_proj.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

DJANGO_DOCUMENTOS_ENABLE_GENERAL_DASHBOARD = True

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
