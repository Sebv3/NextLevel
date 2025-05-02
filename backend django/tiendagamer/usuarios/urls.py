from django.urls import path
from .views import RegistroView, CustomTokenObtainPairView

urlpatterns = [
    path('register/', RegistroView.as_view(), name='registro'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]