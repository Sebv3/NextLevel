from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'telefono']

class RegistroSerializer(serializers.ModelSerializer):
    confirmPassword = serializers.CharField(write_only=True)  # Agregar confirmPassword

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'telefono', 'confirmPassword']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo ya está registrado.")
        return value
        
    def validate_password(self, value):
        validate_password(value) 
        return value
    
    def validate(self, data):
        # Validar que las contraseñas coincidan
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return data


    def create(self, validated_data):
        validated_data.pop('confirmPassword')  # Eliminar confirmPassword antes de crear el usuario
        return CustomUser.objects.create_user(**validated_data)

    