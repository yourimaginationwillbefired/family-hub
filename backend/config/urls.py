from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import include, path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('api/', include('hub.urls')),
    # Serve the React SPA for everything else (index.html from Vite build).
    # Login required so a random URL can't expose family info.
    re_path(r'^.*$', login_required(TemplateView.as_view(template_name='index.html')), name='frontend'),
]
