# serializers.py
from rest_framework import serializers
from .models import Juego, Categoria

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']

class JuegoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer()

    class Meta:
        model = Juego
        fields = ['id', 'nombre', 'precio', 'imagen', 'categoria']
