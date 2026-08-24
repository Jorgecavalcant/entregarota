"use client";

import { useCallback, useEffect, useState } from "react";
import { api, Rota, Parada } from "../../lib/api";

export default function RotaPage() {
  const [rota, setRota] = useState<Rota | null>(null);
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");
  const [textoPend, setTextoPend] = useState<Record<number, string>>({});

  const carregar = useCallback(async () => {
    try {
      const rotas = await api.rotasHoje();
      setErro("");
      setRota(rotas[0] ?? null);
      if (!rotas.length) setMsg("Nenhuma rota para hoje.");
    } catch (e) {
      setErro(String(e));
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function fazerCheckin(p: Parada) {
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true })
      );
      await api.checkin(
        p.id,
        pos.coords.latitude,
        pos.coords.longitude,
        pos.coords.accuracy ?? undefined
      );
      setMsg(`Check-in ok na parada ${p.ordem}`);
      await carregar();
    } catch (e) {
      setErro(String(e));
    }
  }

  async function registrarPendencia(p: Parada) {
    const texto = textoPend[p.id]?.trim();
    if (!texto || texto.length < 3) { setErro("Texto mínimo 3 caracteres"); return; }
    try {
      await api.pendencia(p.id, texto);
      setMsg(`Pendência registrada na parada ${p.ordem}`);
      setTextoPend((s) => ({ ...s, [p.id]: "" }));
      await carregar();
    } catch (e) {
      setErro(String(e));
    }
  }

  if (!rota) return <main style={{ padding: 24 }}><p>{erro || msg || "Carregando..."}</p><a href="/">voltar</a></main>;

  const pontos = rota.paradas.filter((p) => p.lat != null && p.lng != null);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>{rota.nome}</h1>
      <p>
        Total: {rota.contagens.total_paradas} | Feitas: {rota.contagens.feitas} |
        Pendentes: {rota.contagens.pendentes} | Problemas: {rota.contagens.problemas}
      </p>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      <ol>
        {rota.paradas.map((p) => (
          <li key={p.id}>
            [{p.ordem}] {p.endereco} — <b>{p.status}</b>
            {" "}
            <button onClick={() => fazerCheckin(p)}>Check-in</button>
            <div>
              <input
                placeholder="Descreva a pendência"
                value={textoPend[p.id] ?? ""}
                onChange={(e) => setTextoPend((s) => ({ ...s, [p.id]: e.target.value }))}
              />
              <button onClick={() => registrarPendencia(p)}>Registrar pendência</button>
            </div>
          </li>
        ))}
      </ol>
      <h2>Pontos do mapa ({pontos.length})</h2>
      <ul>
        {pontos.map((p) => (
          <li key={p.id}>
            #{p.id}: {p.lat?.toFixed(5)}, {p.lng?.toFixed(5)} ({p.status})
          </li>
        ))}
      </ul>
      <a href="/">voltar</a>
    </main>
  );
}
