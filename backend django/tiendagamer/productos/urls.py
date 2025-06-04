from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JuegoViewSet
from .views import iniciar_pago, return_url
from .views import confirmar_transaccion
from .views import iniciar_pago
from .views import CategoriaViewSet

router = DefaultRouter()
router.register(r'juegos', JuegoViewSet)
router.register(r'categorias', CategoriaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('create_transaction/', iniciar_pago, name="create_transaction"),
    path('return_url/', return_url),
    path('confirm_transaction/', confirmar_transaccion),
]