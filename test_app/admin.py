from django.contrib import admin

# Register your models here.
from .models import Processo, ProcessoDocumento



class ProcessoInline(admin.StackedInline):
    model = Processo.documentos.through
    min_num = 0
    extra = 0

@admin.register(ProcessoDocumento)
class ProcessoDocumentoAdmin(admin.ModelAdmin):
    list_display = ['data', 'documento', 'processo']




@admin.register(Processo)
class ProcessoAdmin(admin.ModelAdmin):
    list_display = ['data', 'documento_nomes']
    inlines = [ProcessoInline, ]
