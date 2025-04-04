from django.conf import settings
from transbank.webpay.webpay_plus import WebpayPlus
from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.common.integration_type import IntegrationType
from transbank.webpay.webpay_plus.transaction import Transaction, WebpayOptions  # SDK Transbank para transacciones



def create_webpay_transaction(amount, buy_order, session_id):
    try:
        options = WebpayOptions(
            settings.TRANSBANK_COMMERCE_CODE, 
            settings.TRANSBANK_API_KEY, 
            IntegrationType.TEST  # Asegúrate de usar TEST para pruebas
        )
        
        # Crear una transacción Webpay Plus
        tx = Transaction(options)
        response = tx.create(buy_order, session_id, amount, "http://localhost:8000/return_url/")

        return response
    except Exception as e:
        print(f"Error al crear transacción: {e}")
        return None
