export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TOKEN_KEY = "er_demo_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export async function loginDemo(usuario: string, senha: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/v1/auth/demo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, senha }),
  });
  if (!res.ok) throw new Error("Falha no login");
  const data = await res.json();
  setToken(data.access_token);
  return data.access_token as string;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function req<T>(
  path: string,
  options: RequestInit & { mutation?: boolean } = {}
): Promise<T> {
  const token = getToken();
  const method = (options.method ?? "GET").toUpperCase();
  const isMutation = options.mutation === true || method !== "GET";
  if (isMutation && !token) throw new Error("AUTH_REQUIRED");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (res.status === 401) {
    clearToken();
    throw new Error("AUTH_REQUIRED");
  }
  if (!res.ok) {
    let detail = `Erro ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") detail = body.detail;
      else if (typeof body.detail?.[0]?.msg === "string")
        detail = body.detail[0].msg;
    } catch {}
    throw new Error(detail);
  }
  return (await res.json()) as T;
}

// ---- Types (contrato real do backend) ----
export interface Contagens {
  total_paradas: number;
  feitas: number;
  pendentes: number;
  problemas: number;
}

export type ParadaStatus = "pendente" | "feito" | "problema";

export interface Parada {
  id: number;
  endereco: string;
  ordem: number;
  status: ParadaStatus;
  lat?: number | null;
  lng?: number | null;
  accuracy_m?: number | null;
  checked_at?: string | null;
  pendencia?: string | null;
}

export interface Rota {
  id: number;
  nome: string;
  data?: string;
  paradas: Parada[];
  contagens: Contagens;
}

export const api = {
  rotasHoje: () => req<Rota[]>("/api/v1/rotas/hoje"),

  criarRota: (nome: string) =>
    req<Rota>("/api/v1/rotas", {
      method: "POST",
      mutation: true,
      body: JSON.stringify({ nome }),
    }),

  addParada: (rotaId: number, endereco: string, ordem: number) =>
    req<Rota>(`/api/v1/rotas/${rotaId}/paradas`, {
      method: "POST",
      mutation: true,
      body: JSON.stringify({ endereco, ordem }),
    }),

  checkin: (paradaId: number, lat: number, lng: number, accuracy_m?: number) =>
    req<Parada>(`/api/v1/rotas/paradas/${paradaId}/checkin`, {
      method: "POST",
      mutation: true,
      body: JSON.stringify(
        accuracy_m !== undefined ? { lat, lng, accuracy_m } : { lat, lng }
      ),
    }),

  pendencia: (paradaId: number, texto: string) =>
    req<Parada>(`/api/v1/rotas/paradas/${paradaId}/pendencia`, {
      method: "POST",
      mutation: true,
      body: JSON.stringify({ texto }),
    }),
};
