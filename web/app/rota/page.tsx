"use client";
import { useEffect, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RotaPage() {
  const [rota, setRota] = useState<any>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    (async () => {
      const list = await fetch(`${API}/api/v1/rotas`).then((r) => r.json());
      if (list[0]) setRota(await fetch(`${API}/api/v1/rotas/${list[0].id}`).then((r) => r.json()));
    })();
  }, []);
  async function checkin(id: number) {
    const pos = await new Promise<GeolocationPosition>((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej)
    ).catch(() => null);
    const lat = pos?.coords.latitude ?? -23.55;
    const lng = pos?.coords.longitude ?? -46.63;
    await fetch(`${API}/api/v1/paradas/${id}/checkin`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng }),
    });
    setMsg(`Check-in #${id} ok (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    const list = await fetch(`${API}/api/v1/rotas`).then((r) => r.json());
    if (list[0]) setRota(await fetch(`${API}/api/v1/rotas/${list[0].id}`).then((r) => r.json()));
  }
  return (
    <main>
      <h1>Rota do dia</h1>
      {!rota && <p>Nenhuma rota ainda — crie no operador.</p>}
      {rota && (
        <>
          <h2>{rota.nome}</h2>
          <ul>
            {(rota.paradas || []).map((p: any) => (
              <li key={p.id} style={{ marginBottom: 12 }}>
                {p.endereco} — {p.status}{" "}
                {p.status === "pendente" && (
                  <button type="button" onClick={() => checkin(p.id)}>Check-in</button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {msg && <p>{msg}</p>}
    </main>
  );
}
