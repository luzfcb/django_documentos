# encoding: utf-8
# https://gist.github.com/joaodubas/7453308
from django.core.exceptions import ImproperlyConfigured
from django.http import HttpResponseRedirect
from django.utils import six
from django.utils.text import force_text
from django.views.generic import View
from django.views.generic.base import ContextMixin, TemplateResponseMixin


class MultipleFormMixin(ContextMixin):
    """MultipleFormMixin -- Mixin that provides methods to show and handle
    multiple forms in a given request.
    """
    multiple_initials = None
    multiple_form_classes = None
    multiple_form_context_names = None
    success_url = None
    multiple_prefixes = None

    def get_multiple_initials(self):
        """get_multiple_initials -- Return all initial data available to
        forms.
        """
        if not self.multiple_initials:
            self.multiple_initials = [
                {} for i in six.range(len(self.multiple_form_classes))
                ]
        if not hasattr(self, '_multiple_initial'):
            self._multiple_initials = self.multiple_initials[:]
        return self._multiple_initials

    def get_multiple_initial(self, index=0):
        """get_multiple_initial -- Return the initial data to use in a given
        form.
        """
        return self.get_multiple_initials()[index]

    def get_multiple_prefixes(self):
        """get_prefixes -- Return the prefixes for all forms."""
        if not self.multiple_prefixes:
            self.multiple_prefixes = [
                '{0}-prefix'.format(i) for i in six.range(len(self.form_class))
                ]
        if not hasattr(self, '_multiple_prefixes'):
            self._multiple_prefixes = self.multiple_prefixes[:]
        return self._multiple_prefixes

    def get_multiple_prefix(self, index=0):
        """get_multiple_prefix -- Return the prefix to use in a given form
        class.
        """
        return self.get_multiple_prefixes()[index]

    def get_multiple_form_classes(self):
        """get_multiple_form_classes -- Return the iterable representing all forms
        available.
        """
        if not hasattr(self, '_multiple_form_classes'):
            self._multiple_form_classes = self.multiple_form_classes[:]
        return self._multiple_form_classes

    def get_multiple_forms_kwargs(self, index=0):
        """get_multiple_forms_kwargs -- Return keyword arguments for a given
        instantiating form.
        """
        kwargs = {
            'initial': self.get_multiple_initial(index),
            'prefix': self.get_multiple_prefix(index),
        }

        if self.request.method in ('POST', 'PUT'):
            kwargs.update({
                'data': self.request.POST,
                'files': self.request.FILES,
            })
        return kwargs

    def get_multiple_forms(self, multiple_form_classes):
        """get_multiple_forms -- Return form instances to be used in the
        view.
        """
        for idx, form_class in enumerate(multiple_form_classes):
            yield form_class(**self.get_multiple_forms_kwargs(idx))

    def get_success_url(self):
        """get_success_url -- Returns the supplied success URL."""
        if self.success_url:
            # Forcing possible reverse_lazy evaluation
            url = force_text(self.success_url)
        else:
            err_msg = "No URL to redirect to. Provide a success_url."
            raise ImproperlyConfigured(err_msg)
        return url

    def multiple_form_validity(self, forms):
        """multiple_form_validity -- Return a boolean indicating if all forms are
        valid.
        """
        validity = [f.is_valid() for f in forms]
        return all(validity)

    def multiple_form_valid(self, forms):
        """multiple_form_valid -- If the form is valid, redirect to the
        supplied URL.
        """
        return HttpResponseRedirect(self.get_success_url())

    def multiple_form_invalid(self, forms):
        """multiple_form_invalid -- If the form is invalid, re-render the
        context data with the data-filled form and errors.
        """
        return self.render_to_response(self.get_context_data(
            self.get_multiple_context_form(forms)
        ))

    def get_multiple_form_context_names(self):
        """get_multiple_form_context_names -- Return the names to be associated
        to each form in this view.
        """
        if not self.multiple_form_context_names:
            prefix = lambda x: '{0}-form'.format(x)
            self.multiple_form_context_names = [
                prefix(i) for i in six.range(len(self.multiple_form_classes))
                ]
        if not hasattr(self, '_multiple_form_context_names'):
            self._multiple_form_context_names = self.multiple_form_context_names[:]
        return self._multiple_form_context_names

    def get_multiple_context_form(self, forms=None):
        """get_multiple_context_form -- Return a dict with the forms used in
        the view.
        """
        if not forms:
            forms = self.get_multiple_forms(self.get_multiple_form_classes())
        return dict(zip(self.get_multiple_form_context_names(), forms))

    def get_context_data(self, **kwargs):
        """get_context_data -- Return the context data to be used in the view
        template.
        """
        context = self.get_multiple_context_form()
        context.update(kwargs)
        return super(MultipleFormMixin, self).get_context_data(**context)


class ProcessMultipleFormView(View):
    """ProcessMultipleFormView -- View that renders a list of forms and process
    them on POST/PUT.
    """

    def get(self, request, *args, **kwargs):
        """get -- Handle GET requests, instantiating all configured forms."""
        context_forms = self.get_multiple_context_form()
        return self.render_to_response(self.get_context_data(**context_forms))

    def post(self, request, *args, **kwargs):
        """post -- Handle POST requests, instantiating the needed forms with
        the passed POST variables and check the validity of each.
        """
        multiple_form_classes = self.get_multiple_form_classes()
        forms = self.get_multiple_forms(multiple_form_classes)
        validity = self.forms_validity(forms)
        if validity:
            return self.multiple_form_valid(forms)
        return self.multiple_form_invalid(forms)

    def put(self, *args, **kwargs):
        """put -- Handle PUT requests by proxing it to the post handler."""
        return self.post(*args, **kwargs)


class BaseMultipleFormView(MultipleFormMixin, ProcessMultipleFormView):
    """BaseMultipleFormView -- Base view for display a list of forms."""
    pass


class MultipleFormView(TemplateResponseMixin, BaseMultipleFormView):
    """MultipleFormView -- View for display a list of forms and render a template
    in response.
    """
    pass
