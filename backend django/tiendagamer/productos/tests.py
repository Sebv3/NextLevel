from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from unittest.mock import patch
from pedidos.models import Pedido, ItemPedido
from productos.models import Juego, Categoria 
from django.contrib.auth import get_user_model


class PagoTests(APITestCase):
    def setUp(self):
        self.url = reverse('create_transaction') 

    @patch('productos.views.Transaction.create') 
    def test_iniciar_pago_valido(self, mock_create):
        mock_create.return_value = {
            'url': 'https://webpay.test/url',
            'token': 'token123'
        }
        data = {
            'amount': 1000,
            'pedido_id': 1,
            'session_id': 'session-test'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('url_webpay', response.json())
        self.assertIn('token', response.json())

    def test_iniciar_pago_monto_invalido(self):
        data = {
            'amount': -50,
            'pedido_id': 1
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())


class ConfirmarTransaccionTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.usuario = User.objects.create_user(
            username='prueba',
            email='prueba@example.com',
            password='12345'
        )

        self.pedido = Pedido.objects.create(
            id=1,
            usuario=self.usuario,
            direccion_envio='Calle luna 123',
            telefono_contacto='123456789',
            total=1500
        )
        categoria = Categoria.objects.create(nombre='Acción')
        self.juego = Juego.objects.create(nombre='Juego Test', precio=1500, categoria=categoria)
        ItemPedido.objects.create(pedido=self.pedido, producto=self.juego, cantidad=1)
        self.url = reverse('confirm_transaction')

    @patch('productos.views.Transaction.commit')
    def test_confirmar_transaccion_exito(self, mock_commit):
        mock_commit.return_value = {
            'status': 'AUTHORIZED',
            'buy_order': f'ORDER-{self.pedido.id}-1234567890'
        }
        response = self.client.get(self.url, {'token_ws': 'token123'})
        self.assertEqual(response.status_code, 200)
        json_response = response.json()
        self.assertEqual(json_response['status'], 'AUTHORIZED')
        self.assertEqual(json_response['pedido']['id'], self.pedido.id)
        self.assertEqual(len(json_response['pedido']['productos']), 1)

    def test_confirmar_transaccion_sin_token(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
