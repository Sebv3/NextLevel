from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile

class RegistroSerializer(serializers.ModelSerializer):
    telefono = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'telefono']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        telefono = validated_data.pop('telefono')
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user, telefono=telefono)
        return user
