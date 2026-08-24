export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TOKEN_KEY = "er_demo_token";

let authPromise: Promise<string> | null = null;

async function loginDemo(): Promise<string> {
  const res = await fetch(`${API_URL}/api/v1/auth/demo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario: "demo", senha: "demo123" }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const body = await res.json();
  const token: string = body.access_token;
  if (typeof window !== "undefined") window.localStorage.setItem(TOKEN_KEY, token);
  return token;
}

export async function ensureAuth(): Promise<string> {
  const cached = typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
  if (cached) return cached;
  if (!authPromise) {
    authPromise = loginDemo().catch((e) => {
      authPromise = null;
      throw e;
    });
  }
  return authPromise;
}

function clearAuth() {
  if (typeof window !== "undefined") window.localStorage.removeItem(TOKEN_KEY);
  authPromise = null;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const isMutation = (init?.method ?? "GET") !== "GET";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (isMutation || path.startsWith("/api/v1/rotas")) {
    try {
      headers["Authorization"] = `Bearer ${await ensureAuth()}`;
    } catch {
      /* segue sem header; API responde 401 e tratamos abaixo */
    }
  }
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (res.status === 401 && !path.startsWith("/api/v1/auth")) {
    // token expirado/inválido: renova uma vez e repete
    clearAuth();
    headers["Authorization"] = `Bearer ${await ensureAuth()}`;
    const retry = await fetch(`${API_URL}${path}`, { ...init, headers });
    if (!retry.ok) throw new Error(`${retry.status} ${await retry.text()}`);
    return retry.json();
  }
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

export interface Contagens {
  total_paradas: number;
  feitas: number;
  pendentes: number;
  problemas: number;
}
export interface Parada {
  id: number;
  endereco: string;
  ordem: number;
  status: string;
  lat: number | null;
  lng: number | null;
  accuracy_m: number | null;
  checked_at: string | null;
}
export interface Rota {
  id: number;
  nome: string;
  data: string;
  paradas: Parada[];
  contagens: Contagens;
}

export const api = {
  rotasHoje: () => req<Rota[]>("/api/v1/rotas/hoje"),
  criarRota: (nome: string) =>
    req<Rota>("/api/v1/rotas", { method: "POST", body: JSON.stringify({ nome }) }),
  addParada: (rotaId: number, endereco: string, ordem: number) =>
    req<Rota>(`/api/v1/rotas/${rotaId}/paradas`, {
      method: "POST",
      body: JSON.stringify({ endereco, ordem }),
    }),
  checkin: (paradaId: number, lat: number, lng: number, accuracy_m?: number) =>
    req<Parada>(`/api/v1/rotas/paradas/${paradaId}/checkin`, {
      method: "POST",
      body: JSON.stringify({ lat, lng, accuracy_m }),
    }),
  pendencia: (paradaId: number, texto: string) =>
    req<Parada>(`/api/v1/rotas/paradas/${paradaId}/pendencia`, {
      method: "POST",
      body: JSON.stringify({ texto }),
    }),
};
