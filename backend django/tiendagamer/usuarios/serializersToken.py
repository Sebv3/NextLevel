from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.models import User

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD  # Usa email como campo de autenticación

    def validate(self, attrs):
        # Mapear email a username si es necesario
        attrs['username'] = attrs.get('email')
        return super().validate(attrs)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
        }
        return data