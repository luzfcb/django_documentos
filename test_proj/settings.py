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
    'test_app',

)

INSTALLED_APPS = INSTALLED_APPS + (
    'autocomplete_light',
    'simple_history',

    'bootstrap3',
    'django_extensions',
    'bootstrap_pagination',
    'extra_views',
    'braces',
    'redactor',
    'spurl',
    'ckeditor',
    'ckeditor_uploader',
    'django_wysiwyg',
    'wkhtmltopdf',
    'captcha',
    'crispy_forms',
    'django_documentos',
    'parsley',

    'debug_toolbar',

    # 'devserver',
)

PHANTOMJS_BIN = '/usr/bin/phantomjs'

# django-simple-captcha

CAPTCHA_FONT_PATH = (
    os.path.join(os.path.dirname(BASE_DIR), 'django_documentos', 'fontes', 'HomemadeApple.ttf'),
    os.path.join(os.path.dirname(BASE_DIR), 'django_documentos', 'fontes', 'RockSalt.ttf'),
    os.path.join(os.path.dirname(BASE_DIR), 'django_documentos', 'fontes', 'ShadowsIntoLight.ttf'),
)
CAPTCHA_FOREGROUND_COLOR = '#991100'

CAPTCHA_FONT_SIZE = 50
CAPTCHA_CHALLENGE_FUNCT = 'captcha.helpers.math_challenge'
# CAPTCHA_CHALLENGE_FUNCT = 'captcha.helpers.word_challenge'
CAPTCHA_WORDS_DICTIONARY = '/usr/share/dict/brazilian'
# django_wysiwyg
DJANGO_WYSIWYG_FLAVOR = 'ckeditor'

CKEDITOR_UPLOAD_PATH = 'uploads/'

CKEDITOR_CONFIGS = {
    'default': {
        # 'fullPage': True,  # http://docs.ckeditor.com/#!/guide/dev_fullpage
        'skin': 'moono',
        # 'skin': 'office2013',
        'toolbar': 'Basic',
        'toolbar_Basic': [
            # {'name': 'document', 'items': ['Source', '-', 'Save', 'Preview', 'Print', '-', 'Templates']},
            {'name': 'document', 'items': ['Save', ]},
            {'name': 'basicstyles',
             'items': ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat', '-',
                       'PasteFromWord']},

            {'name': 'paragraph',
             'items': ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'NumberedList', 'BulletedList',
                       '-', 'Outdent', 'Indent', '-', 'Blockquote', '-',
                       '-',
                       ]},
            {'name': 'insert',
             'items': ['base64image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak']},
            # '/',
            {
                'name': 'custom',
                'items': [
                    # 'CreateLockUnlock',
                    # 'Maximize',
                    # 'ShowBlocks'
                ]
            }
        ],
        'extraPlugins': ','.join(['sharedspace', 'save', 'autolink', 'base64image', ]),
        'removePlugins': ','.join(['resize', ]),
        # 'height': 410,
        'width': '21.0cm',
        'sharedSpaces': {
            'top': 'top',
            'bottom': 'bottom'
        },
        'contentsCss': 'html, iframe, body {overflow:hidden;outline: none;}'
                       '',
        'startupShowBorders': False
    },
    'compartilhado': {
        # 'fullPage': True,  # http://docs.ckeditor.com/#!/guide/dev_fullpage
        'skin': 'moono',
        # 'skin': 'office2013',
        'toolbar': 'Basic',
        'toolbar_Basic': [
            # {'name': 'document', 'items': ['Source', '-', 'Save', 'Preview', 'Print', '-', 'Templates']},
            {'name': 'document', 'items': ['Save', ]},
            {'name': 'basicstyles',
             'items': ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat', '-',
                       'PasteFromWord']},

            {'name': 'paragraph',
             'items': ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'NumberedList', 'BulletedList',
                       '-', 'Outdent', 'Indent', '-', 'Blockquote', '-',
                       '-',
                       ]},
            {'name': 'insert',
             'items': ['base64image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak']},
            # '/',
            {
                'name': 'custom',
                'items': [
                    # 'CreateLockUnlock',
                    # 'Maximize',
                    # 'ShowBlocks'
                ]
            }
        ],
        'extraPlugins': ','.join(['sharedspace', 'save', 'autolink', 'base64image', ]),
        'removePlugins': ','.join(['resize', ]),
        # 'height': 410,
        'width': '21.0cm',
        'sharedSpaces': {
            'top': 'top',
            'bottom': 'bottom'
        },
        'contentsCss': 'html, iframe, body {overflow:hidden;outline: none;}'
                       '',
        'startupShowBorders': False
    }
}


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

# MIDDLEWARE_CLASSES = MIDDLEWARE_CLASSES + (
#     'devserver.middleware.DevServerMiddleware',
# )
#
# DEVSERVER_MODULES = (
#     'devserver.modules.sql.SQLRealTimeModule',
#     'devserver.modules.sql.SQLSummaryModule',
#     'devserver.modules.profile.ProfileSummaryModule',
#
#     # Modules not enabled by default
#     'devserver.modules.profile.LineProfilerModule',
# )

# DEVSERVER_AUTO_PROFILE = True  # profiles all views without the need of function decorator

ROOT_URLCONF = 'test_proj.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'debug': DEBUG,
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

STATIC_ROOT = os.path.join(BASE_DIR, 'static_producao')

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

DJANGO_DOCUMENTOS_ENABLE_GENERAL_DASHBOARD = True

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

WKHTMLTOPDF_DEBUG = True
