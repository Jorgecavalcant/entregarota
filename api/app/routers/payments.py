from fastapi import APIRouter, HTTPException

from app.payments import get_provider, list_providers
from app.schemas import ChargeIn, ChargeOut, PaymentProviderOut

router = APIRouter(prefix="/api/v1/payments", tags=["payments"])


@router.get("/providers", response_model=list[PaymentProviderOut])
def providers():
    return [PaymentProviderOut(name=p.name) for p in list_providers()]


@router.post("/charge", response_model=ChargeOut)
def charge(payload: ChargeIn):
    try:
        provider = get_provider(payload.provider)
    except KeyError as e:
        raise HTTPException(status_code=400, detail=str(e.args[0]))
    result = provider.charge(payload.valor_centavos, payload.referencia)
    return ChargeOut(provider=provider.name, **result)
