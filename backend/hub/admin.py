from django.contrib import admin

from .models import DigestItem, Package, SchoolEvent

admin.site.register(SchoolEvent)
admin.site.register(Package)
admin.site.register(DigestItem)
