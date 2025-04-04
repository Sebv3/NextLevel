from rest_framework import viewsets
from .models import Juego
from .serializers import JuegoSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt



class JuegoViewSet(viewsets.ModelViewSet):
    queryset = Juego.objects.all()
    serializer_class = JuegoSerializer

import json
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.common.integration_type import IntegrationType
from transbank.webpay.webpay_plus.transaction import WebpayOptions
from transbank.error.transbank_error import TransbankError  # ✅ Importado

@csrf_exempt
def iniciar_pago(request):
    if request.method == "POST":
        try:
            datos = json.loads(request.body)
            amount = datos.get("amount")  # ✅ Ahora lee `amount`, no `productos`
            
            if not amount or amount <= 0:
                return JsonResponse({"error": "Monto inválido"}, status=400)

            # Generar orden de compra única
            buy_order = f"ORDEN-{int(time.time() * 1000)}"
            session_id = datos.get("session_id", "SESSION123")
            return_url = settings.TRANSBANK_RETURN_URL

            # Configuración de Transbank
            options = WebpayOptions(
                commerce_code=settings.TRANSBANK_COMMERCE_CODE,
                api_key=settings.TRANSBANK_API_KEY,
                integration_type=IntegrationType.TEST
            )
            transaction = Transaction(options)

            # Crear transacción
            response = transaction.create(buy_order, session_id, amount, return_url)

            return JsonResponse({
                "url_webpay": response['url'] + "?token_ws=" + response['token'],
                "token": response['token']
            })

        except TransbankError as e:
            print("❌ Error en la creación del pago:", e.message)
            return JsonResponse({"error": e.message}, status=500)

        except Exception as e:
            print("❌ Error inesperado:", str(e))
            return JsonResponse({"error": "Error interno del servidor"}, status=500)

    return JsonResponse({"error": "Método no permitido"}, status=405)


@csrf_exempt
def return_url(request):
    return JsonResponse({"message": "Transacción completada"})
