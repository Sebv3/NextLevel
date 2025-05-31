from rest_framework import viewsets
from .models import Juego
from .serializers import JuegoSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.common.integration_type import IntegrationType
from transbank.webpay.webpay_plus.transaction import WebpayOptions
from transbank.error.transbank_error import TransbankError 
from rest_framework.parsers import MultiPartParser, FormParser
from pedidos.models import Pedido, ItemPedido
from productos.models import Juego
from django.contrib.auth import get_user_model

class JuegoViewSet(viewsets.ModelViewSet):
    queryset = Juego.objects.all()
    serializer_class = JuegoSerializer
    parser_classes = (MultiPartParser, FormParser)

@csrf_exempt
def iniciar_pago(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("Datos recibidos:", data)  
            amount = data.get("amount")
            pedido_id = data.get("pedido_id")
            session_id = data.get("session_id", f"session-{int(time.time())}")

            if not amount or amount <= 0:
                return JsonResponse({"error": "Monto inválido"}, status=400)

            buy_order = f"ORDER-{pedido_id}-{int(time.time()*1000)}"
            return_url = settings.TRANSBANK_RETURN_URL

            options = WebpayOptions(
                commerce_code=settings.TRANSBANK_COMMERCE_CODE,
                api_key=settings.TRANSBANK_API_KEY,
                integration_type=IntegrationType.TEST
            )
            transaction = Transaction(options)

            response = transaction.create(buy_order, session_id, amount, return_url)

            print("Respuesta Transbank:", response)  # <-- Ver respuesta de transbank

            return JsonResponse({
                "url_webpay": response['url'] + "?token_ws=" + response['token'],
                "token": response['token']
            })

        except TransbankError as e:
            print("Error TransbankError:", e.message)
            return JsonResponse({"error": e.message}, status=500)
        except Exception as e:
            print("Error inesperado:", str(e))
            return JsonResponse({"error": "Error interno del servidor"}, status=500)

    return JsonResponse({"error": "Método no permitido"}, status=405)



@csrf_exempt
def return_url(request):
    return JsonResponse({"message": "Transacción completada"})

@csrf_exempt
def confirmar_transaccion(request):
    token = request.GET.get("token_ws")
    if not token:
        return JsonResponse({"error": "Token no proporcionado"}, status=400)

    try:
        options = WebpayOptions(
            commerce_code=settings.TRANSBANK_COMMERCE_CODE,
            api_key=settings.TRANSBANK_API_KEY,
            integration_type=IntegrationType.TEST
        )
        transaction = Transaction(options)

        # Confirmar transacción con Transbank
        response = transaction.commit(token)
        status = response['status']
        buy_order = response['buy_order']

        # Extraer el ID del pedido 
        try:
            pedido_id = int(buy_order.split("-")[1])
        except:
            return JsonResponse({"error": "No se pudo extraer el ID del pedido."}, status=400)

        try:
            pedido = Pedido.objects.get(id=pedido_id)
        except Pedido.DoesNotExist:
            return JsonResponse({"error": "Pedido no encontrado."}, status=404)

        # Obtener los productos del pedido
        productos = []
        for item in ItemPedido.objects.filter(pedido=pedido).select_related('producto'):
            productos.append({
                "nombre": item.producto.nombre,
                "precio": item.producto.precio,
                "cantidad": item.cantidad
            })

        return JsonResponse({
            "status": status,
            "pedido": {
                "id": pedido.id,
                "direccion_envio": pedido.direccion_envio,
                "telefono_contacto": pedido.telefono_contacto,
                "total": pedido.total,
                "productos": productos
            }
        })

    except TransbankError as e:
        print("❌ Error al confirmar:", e.message)
        return JsonResponse({"error": e.message}, status=500)

    except Exception as e:
        print("❌ Error inesperado:", str(e))
        return JsonResponse({"error": "Error interno del servidor"}, status=500)