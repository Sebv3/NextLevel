from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Your URL patterns
    path('api/', include('productos.urls')),
      # Ensure this is correct
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)