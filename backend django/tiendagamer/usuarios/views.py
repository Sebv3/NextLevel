from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializersRegistro import RegistroSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializersRegistro import CustomUserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class RegisterUserView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegistroSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()  # Crea el usuario
            return Response({
                "message": "Usuario creado exitosamente"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginUserView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(email=email, password=password)

        if user is None:
            return Response({"detail": "Credenciales incorrectas"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            'access': access_token,
            'refresh': str(refresh),
            'username': user.username,
            'is_staff': user.is_staff
        }, status=status.HTTP_200_OK)


class UsuarioActualView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)