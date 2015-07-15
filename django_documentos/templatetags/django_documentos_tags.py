from django import template
from django.db.models import OneToOneRel
from django.forms.models import modelform_factory

register = template.Library()

from django import forms

from django.utils import six
from django.utils.encoding import force_str


class ReadOnlyFieldsMixin(object):
    readonly_fields = ()
    all_fields = False

    def __init__(self, *args, **kwargs):
        super(ReadOnlyFieldsMixin, self).__init__(*args, **kwargs)
        if len(self.readonly_fields) == 0:
            self.all_fields = True
        else:
            self.all_fields = False

        for field in (field for field_name, field in six.iteritems(self.fields)
                      if field_name in self.readonly_fields
                      or self.all_fields is True):
            field.widget.attrs['disabled'] = 'true'
            field.required = False

    def clean(self):
        cleaned_data = super(ReadOnlyFieldsMixin, self).clean()
        if self.all_fields:
            for field_name, field in six.iteritems(self.fields):
                cleaned_data[field_name] = getattr(self.instance, field_name)
            return cleaned_data
        else:
            for field_name in self.readonly_fields:
                cleaned_data[field_name] = getattr(self.instance, field_name)
            return cleaned_data


def new_readonly_form(klass, all_fields=True, readonly_fields=()):
    name = force_str("ReadOnly{}".format(klass.__name__))
    klass_fields = {'all_fields': all_fields, 'readonly_fields': readonly_fields}
    return type(name, (ReadOnlyFieldsMixin, klass), klass_fields)


@register.filter
def as_form(model_instance):
    model = model_instance.__class__
    fields_instances = model_instance._meta.get_fields(include_parents=False)
    fields_names = [f.name for f in fields_instances if
                    f.hidden is False and f.concrete is True and not isinstance(f, OneToOneRel)
                    and f.editable is True]
    new_form_class = modelform_factory(model, fields=fields_names)
    readonly_new_form_class = new_readonly_form(new_form_class)
    return readonly_new_form_class(instance=model_instance)
