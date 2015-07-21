# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django import template
from django.forms.models import ModelFormMetaclass, ModelFormOptions, modelform_factory
from django.utils import six
from django.utils.encoding import force_str

register = template.Library()


class ReadOnlyFieldsMixin(object):
    readonly_fields = ()

    def __init__(self, *args, **kwargs):
        super(ReadOnlyFieldsMixin, self).__init__(*args, **kwargs)
        self.define_readonly_fields(self.fields)

    def clean(self):
        cleaned_data = super(ReadOnlyFieldsMixin, self).clean()

        for field_name, field in six.iteritems(self.fields):
            if self._must_be_readonly(field_name):
                cleaned_data[field_name] = getattr(self.instance, field_name)

        return cleaned_data

    def define_readonly_fields(self, field_list):

        fields = [field for field_name, field in six.iteritems(field_list)
                  if self._must_be_readonly(field_name)]

        map(lambda field: self._set_readonly(field), fields)

    def _all_fields(self):
        return not bool(self.readonly_fields)

    def _set_readonly(self, field):
        field.widget.attrs['disabled'] = 'true'
        field.required = False

    def _must_be_readonly(self, field_name):
        return field_name in self.readonly_fields or self._all_fields()


def new_readonly_form_class(klass, readonly_fields=()):
    name = force_str("ReadOnly{}".format(klass.__name__))
    klass_fields = {'readonly_fields': readonly_fields}
    return type(name, (ReadOnlyFieldsMixin, klass), klass_fields)


def is_primary_key(model_field):
    if hasattr(model_field, 'primary_key'):
        return True if model_field.primary_key else False
    return False


def new_form_class_from_model(model_instance):
    name = force_str("{}Form".format(model_instance.__class__.__name__))

    fields_instances = model_instance._meta.get_fields(include_parents=True)
    form_fields = [(f.name, f.formfield(), f.primary_key) for f in fields_instances if
                   hasattr(f, 'formfield') and f.primary_key is False]

    fields = {key: value for (key, value, isprimary) in form_fields}
    klass_fields = fields
    print(klass_fields)
    metainnerclass = type('Meta', (ModelFormOptions,), {'model': model_instance.__class__.__name__,
                                                        'fields': [field_name for (field_name, formfield, isprimary) in
                                                                   form_fields]})
    print(metainnerclass)
    klass_fields.update({
        'Meta': metainnerclass,
        '_meta': metainnerclass
    })
    try:

        NewModelForm = type(name, (ModelFormMetaclass,), klass_fields)
    except:
        pass
    # NewModelForm._meta = ModelFormOptions(getattr(NewModelForm, 'Meta', None))
    return NewModelForm


@register.filter
def as_form2(model_instance):
    new_form_class = new_form_class_from_model(model_instance)
    readonly_new_form_class = new_readonly_form_class(new_form_class)
    return readonly_new_form_class(instance=model_instance)


@register.filter
def as_form(model_instance):
    model = model_instance.__class__
    new_form_class = modelform_factory(model, fields='__all__')
    readonly_new_form_class = new_readonly_form_class(new_form_class)
    form_instance = readonly_new_form_class(instance=model_instance)

    return form_instance
