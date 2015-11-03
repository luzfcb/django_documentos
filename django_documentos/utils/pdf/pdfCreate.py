# -*- coding:utf-8 -*-
from django.template.loader import get_template
from django.template import Context
import cStringIO as StringIO
import ho.pisa as pisa
import cgi
from django.http import HttpResponse
from django.conf import settings
import os


def fetch_resources(uri, rel):
    path = os.path.join(settings.STATIC_ROOT, uri.replace(settings.STATIC_URL, ""))
    return path


def write_to_pdf(template_src, context_dict, filename, pdfArq=False):
    template = get_template(template_src)
    context = Context(context_dict)
    html = template.render(context)
    result = StringIO.StringIO()
    pdf = pisa.pisaDocument(StringIO.StringIO(html.encode("UTF-8")), result, link_callback=fetch_resources,
                            encoding="utf-8")
    if pdfArq:
        return result.getvalue()
    if not pdf.err:
        return HttpResponse(result.getvalue(), content_type='application/pdf')
    return HttpResponse('Problema ao gerar PDF: %s' % cgi.escape(html))
