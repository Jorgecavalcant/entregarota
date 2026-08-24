import abc
import uuid
from typing import Optional


class PaymentProvider(abc.ABC):
    name: str = "base"

    @abc.abstractmethod
    def charge(self, valor_centavos: int, referencia: Optional[str] = None) -> dict:
        """Retorna dict com id, status, valor_centavos, referencia."""
