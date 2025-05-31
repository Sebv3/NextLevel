from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Pedido, ItemPedido
from productos.models import Juego

class CrearPedidoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        usuario = request.user
        data = request.data
        direccion = data.get("direccion_envio")
        telefono = data.get("telefono_contacto")
        total = data.get("total")
        productos = data.get("productos")

        # Validaciones básicas
        if not direccion or not telefono or not productos or total is None:
            return Response({"error": "Faltan datos obligatorios"}, status=status.HTTP_400_BAD_REQUEST)
        if total <= 0:
            return Response({"error": "Total debe ser mayor a 0"}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(productos, list) or len(productos) == 0:
            return Response({"error": "La lista de productos es inválida"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            pedido = Pedido.objects.create(
                usuario=usuario,
                direccion_envio=direccion,
                telefono_contacto=telefono,
                total=total,
                estado="pendiente",
                transaccion_id=data.get("transaccion_id", "")
            )

            for item in productos:
                producto = Juego.objects.get(id=item["id"])
                ItemPedido.objects.create(
                    pedido=pedido,
                    producto=producto,
                    cantidad=item["cantidad"]
                )
        except Juego.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"mensaje": "Pedido creado correctamente", "pedido_id": pedido.id}, status=status.HTTP_201_CREATED)
