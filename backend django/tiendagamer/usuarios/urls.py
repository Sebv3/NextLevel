from django.urls import path
from .views import RegisterUserView
from .views import RegisterUserView, LoginUserView, UsuarioActualView


urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('me/', UsuarioActualView.as_view(), name='usuario-actual'),
]