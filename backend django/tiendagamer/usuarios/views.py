from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile  # Asegúrate de tener este modelo creado (ver paso 2)
from rest_framework import generics
from .serializers import RegistroSerializer



class RegistroView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistroSerializer