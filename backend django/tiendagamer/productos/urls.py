from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JuegoViewSet
from .views import iniciar_pago, return_url

router = DefaultRouter()
router.register(r'juegos', JuegoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('create_transaction/', iniciar_pago),
    path('return_url/', return_url),
]