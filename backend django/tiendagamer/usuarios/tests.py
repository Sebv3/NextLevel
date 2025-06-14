from rest_framework.test import APITestCase  
from rest_framework import status
from django.contrib.auth import get_user_model
from django.urls import reverse

CustomUser = get_user_model()

class CustomUserTests(APITestCase): 

    def test_creacion_usuario_exitoso(self):
        user = CustomUser.objects.create_user(
            email='test@ejemplo.com',
            password='clave123',
            username='testuser',
            telefono='123456789'
        )
        self.assertEqual(user.email, 'test@ejemplo.com')
        self.assertTrue(user.check_password('clave123'))
        self.assertFalse(user.is_staff)
        self.assertTrue(user.is_active)

    def test_creacion_usuario_sin_email(self):
        with self.assertRaisesMessage(ValueError, 'El email es obligatorio'):
            CustomUser.objects.create_user(
                email='',
                password='clave123',
                username='sinemail',
                telefono='123'
            )

    def test_registro_con_contraseña_corta(self):
        data = {
            'email': 'corta@ejemplo.com',
            'password': '123',  
            'confirmPassword': '123', 
            'username': 'usuario_malo',
            'telefono': '999999999'
        }
        url = reverse('register')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data) 
    
    def test_registro_con_passwords_no_coinciden(self):
        data = {
            'email': 'usuario@ejemplo.com',
            'password': 'clave123',
            'confirmPassword': 'clave124',  # diferente
            'username': 'usuario1',
            'telefono': '123456789'
        }
        url = reverse('register')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)  

    def test_registro_sin_username(self):
        data = {
            'email': 'sinusername@ejemplo.com',
            'password': 'clave1234',
            'confirmPassword': 'clave1234',
            'telefono': '123456789'
            # falta username
        }
        url = reverse('register')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

