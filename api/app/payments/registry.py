from typing import Dict, List

from app.payments.base import PaymentProvider
from app.payments.manual import ManualProvider

_PROVIDERS: Dict[str, PaymentProvider] = {}


def register_provider(provider: PaymentProvider) -> None:
    _PROVIDERS[provider.name] = provider


def get_provider(name: str) -> PaymentProvider:
    if name not in _PROVIDERS:
        raise KeyError(f"provider desconhecido: {name}")
    return _PROVIDERS[name]


def list_providers() -> List[PaymentProvider]:
    return list(_PROVIDERS.values())


register_provider(ManualProvider())
