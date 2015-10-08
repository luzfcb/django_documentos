from django.shortcuts import render

# Create your views here.
from django.views import generic


class AppTestHome(generic.TemplateView):
    template_name = ''
