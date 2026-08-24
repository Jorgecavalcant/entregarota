from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import get_settings

_bearer = HTTPBearer(auto_error=False)
_TOKEN_TTL_S = 12 * 3600


def _sign(payload_b64: str) -> str:
    secret = get_settings().demo_token_secret.encode()
    return hmac.new(secret, payload_b64.encode(), hashlib.sha256).hexdigest()


def issue_demo_token(usuario: str) -> str:
    payload = {"sub": usuario, "exp": int(time.time()) + _TOKEN_TTL_S}
    raw = json.dumps(payload, separators=(",", ":")).encode()
    payload_b64 = base64.urlsafe_b64encode(raw).decode().rstrip("=")
    return f"{payload_b64}.{_sign(payload_b64)}"


def _decode(token: str) -> dict[str, Any] | None:
    try:
        payload_b64, sig = token.split(".", 1)
    except ValueError:
        return None
    if not hmac.compare_digest(sig, _sign(payload_b64)):
        return None
    pad = "=" * (-len(payload_b64) % 4)
    try:
        payload = json.loads(base64.urlsafe_b64decode(payload_b64 + pad))
    except Exception:
        return None
    if not isinstance(payload, dict) or payload.get("exp", 0) < time.time():
        return None
    return payload


def require_operador(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> str:
    if creds is None or creds.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autenticação necessária",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = _decode(creds.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return str(payload.get("sub", ""))
