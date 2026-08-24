export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
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
