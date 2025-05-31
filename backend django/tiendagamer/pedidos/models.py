from django.db import models
from django.conf import settings 


class Pedido(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    direccion_envio = models.CharField(max_length=255)
    telefono_contacto = models.CharField(max_length=20)
    total = models.PositiveIntegerField()
    estado = models.CharField(max_length=20, default="pendiente")   
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    transaccion_id = models.CharField(max_length=100, blank=True, null=True)

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="items")
    producto = models.ForeignKey("productos.Juego", on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
