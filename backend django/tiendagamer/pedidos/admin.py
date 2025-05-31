from django.contrib import admin
from .models import Pedido, ItemPedido

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'direccion_envio', 'telefono_contacto', 'fecha_creacion']
    search_fields = ['usuario__username', 'direccion_envio', 'telefono_contacto']
    list_filter = ['fecha_creacion']

@admin.register(ItemPedido)
class ItemPedidoAdmin(admin.ModelAdmin):
    list_display = ['id', 'pedido', 'producto', 'cantidad']
    search_fields = ['producto__nombre']
