import uuid
from typing import Optional

from app.payments.base import PaymentProvider


class ManualProvider(PaymentProvider):
    name = "manual"

    def charge(self, valor_centavos: int, referencia: Optional[str] = None) -> dict:
        return {
            "id": f"man_{uuid.uuid4().hex[:12]}",
            "status": "pendente_confirmacao",
            "valor_centavos": valor_centavos,
            "referencia": referencia,
        }
