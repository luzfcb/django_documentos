# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django import template
from django.forms.models import modelform_factory
from django.template.defaulttags import URLNode, url

from simple_history.forms import new_readonly_form_class
from ..utils import identificador

register = template.Library()


@register.filter
def as_form(model_instance):
    model = model_instance.__class__
    new_form_class = modelform_factory(model, fields='__all__')
    readonly_new_form_class = new_readonly_form_class(new_form_class)
    form_instance = readonly_new_form_class(instance=model_instance)

    return form_instance


@register.filter
def as_form_media(model_instance):
    model = model_instance.__class__
    new_form_class = modelform_factory(model, fields='__all__')
    readonly_new_form_class = new_readonly_form_class(new_form_class)
    form_instance = readonly_new_form_class(instance=model_instance)

    return form_instance.media


@register.filter
def identificador_versao(model_instance):
    if model_instance:
        return identificador.document(model_instance.pk, model_instance.versao_numero)


class AbsoluteURLNode(URLNode):
    def __init__(self, view_name, args, kwargs, asvar):
        super(AbsoluteURLNode, self).__init__(view_name,
            args,
            kwargs,
            None)
        self.abs_asvar = asvar

    def render(self, context):
        path = super(AbsoluteURLNode, self).render(context)
        url = context['request'].build_absolute_uri(path)

        if self.abs_asvar:
            context[self.abs_asvar] = url
            return ''
        else:
            return url


def absurl(parser, token):
    node_instance = url(parser, token)
    return AbsoluteURLNode(view_name=node_instance.view_name,
        args=node_instance.args,
        kwargs=node_instance.kwargs,
        asvar=node_instance.asvar)


absurl = register.tag(absurl)

register = template.Library()


"""
Usage: {{ url|absolute_uri:request }}

sample 1:

{% url 'my-view' as my_view %}
{{ my_view:absolute_uri:request }}

<a href="{{ my_view|absolute_uri:request }}"></a>

or

{{ my_view|absolute_uri:request|urlize }}

sample 2:

{{ '/foo/bar/'|absolute_uri:request as zz }}
"""



@register.filter
def absolute_uri(url, request):
    return request.build_absolute_uri(url)
