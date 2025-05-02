from django.contrib import admin
from .models import CustomUser, Profile

# Registra el modelo CustomUser en el admin
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'telefono', 'is_staff', 'is_active')
    search_fields = ('email', 'username', 'telefono')

admin.site.register(CustomUser, CustomUserAdmin)

# Registra el modelo Profile en el admin (si lo necesitas)
admin.site.register(Profile)