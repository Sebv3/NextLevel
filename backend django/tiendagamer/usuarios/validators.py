import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class CustomPasswordValidator:
    def validate(self, password, user=None):
        if not re.search(r'[A-Z]', password):
            raise ValidationError(_('La contraseña debe contener al menos una letra mayúscula.'))
        if not re.search(r'[a-z]', password):
            raise ValidationError(_('La contraseña debe contener al menos una letra minúscula.'))
        if not re.search(r'\d', password):
            raise ValidationError(_('La contraseña debe contener al menos un número.'))
        if not re.search(r'\W', password):
            raise ValidationError(_('La contraseña debe contener al menos un símbolo.'))
        if len(password) < 8:
            raise ValidationError(_('La contraseña debe tener al menos 8 caracteres.'))

    def get_help_text(self):
        return _('Tu contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un símbolo.')
