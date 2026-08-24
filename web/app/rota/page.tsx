"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api, Rota, Parada } from "../../lib/api";

function badgeClass(status: string) {
  if (status === "feita") return "badge badge--feita";
  if (status === "problema") return "badge badge--problema";
  return "badge badge--pendente";
}

export default function RotaPage() {
  const [rota, setRota] = useState<Rota | null>(null);
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [textoPend, setTextoPend] = useState<Record<number, string>>({});

  const carregar = useCallback(async () => {
    try {
      const rotas = await api.rotasHoje();
      setErro("");
      setRota(rotas[0] ?? null);
      if (!rotas.length) setMsg("Nenhuma rota para hoje.");
      else setMsg("");
    } catch (e) {
      setErro(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function fazerCheckin(p: Parada) {
    setErro("");
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
      const raw = String(e);
      if (raw.includes("denied") || raw.includes("Permission")) {
        setErro("Precisamos da sua localização só no check-in. Permita o GPS e tente de novo.");
      } else {
        setErro(raw);
      }
    }
  }

  async function registrarPendencia(p: Parada) {
    const texto = textoPend[p.id]?.trim();
    if (!texto || texto.length < 3) {
      setErro("Descreva a pendência com pelo menos 3 caracteres.");
      return;
    }
    try {
      await api.pendencia(p.id, texto);
      setMsg(`Pendência registrada na parada ${p.ordem}`);
      setTextoPend((s) => ({ ...s, [p.id]: "" }));
      setErro("");
      await carregar();
    } catch (e) {
      setErro(String(e));
    }
  }

  if (loading) {
    return (
      <main className="shell">
        <div className="brand-row">
          <span className="brand-mark" aria-hidden="true" />
          <p className="brand-name">EntregaRota</p>
        </div>
        <div className="state-block" role="status">
          Carregando sua rota…
        </div>
        <Link className="back-link" href="/">
          ← voltar
        </Link>
      </main>
    );
  }

  if (!rota) {
    return (
      <main className="shell">
        <div className="brand-row">
          <span className="brand-mark" aria-hidden="true" />
          <p className="brand-name">EntregaRota</p>
        </div>
        <h1>Minha rota</h1>
        {erro && (
          <div className="alert alert--error" role="alert">
            {erro}
          </div>
        )}
        <div className="state-block">
          <p>{msg || "Nenhuma rota para hoje."}</p>
          <p className="hint">Peça ao operador para montar a rota do dia.</p>
          <Link className="btn btn-primary" href="/operador">
            Ir ao operador
          </Link>
        </div>
        <Link className="back-link" href="/">
          ← voltar
        </Link>
      </main>
    );
  }

  const pontos = rota.paradas.filter((p) => p.lat != null && p.lng != null);
  const total = rota.contagens.total_paradas || 0;
  const feitas = rota.contagens.feitas || 0;
  const pct = total ? Math.round((feitas / total) * 100) : 0;

  return (
    <main className="shell">
      <div className="brand-row">
        <span className="brand-mark" aria-hidden="true" />
        <p className="brand-name">EntregaRota</p>
      </div>

      <p className="eyebrow">Rota do dia · {rota.data}</p>
      <h1>{rota.nome}</h1>
      <p className="hint">
        Usamos o GPS só no momento do check-in, para confirmar que você está na parada.
      </p>

      <div className="stats" aria-label="Resumo da rota">
        <div className="stat">
          <div className="stat-value">{rota.contagens.total_paradas}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat stat--done">
          <div className="stat-value">{rota.contagens.feitas}</div>
          <div className="stat-label">Feitas</div>
        </div>
        <div className="stat stat--accent">
          <div className="stat-value">{rota.contagens.pendentes}</div>
          <div className="stat-label">Pendentes</div>
        </div>
        <div className="stat stat--warn">
          <div className="stat-value">{rota.contagens.problemas}</div>
          <div className="stat-label">Problemas</div>
        </div>
      </div>

      <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${pct}% concluído`}>
        <span style={{ width: `${pct}%` }} />
      </div>

      {erro && (
        <div className="alert alert--error" role="alert">
          {erro}
        </div>
      )}
      {msg && (
        <div className="alert alert--ok" role="status">
          {msg}
        </div>
      )}

      <ol className="timeline">
        {rota.paradas.map((p) => (
          <li key={p.id} className="parada">
            <span className="parada-dot" data-status={p.status} aria-hidden="true" />
            <div className="parada-head">
              <span className="parada-ordem">#{p.ordem}</span>
              <span className="parada-endereco">{p.endereco}</span>
              <span className={badgeClass(p.status)}>{p.status}</span>
            </div>
            <div className="parada-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => fazerCheckin(p)}
                aria-label={`Fazer check-in na parada ${p.ordem}, ${p.endereco}`}
              >
                Check-in
              </button>
              <div className="pendencia-row">
                <label className="field" style={{ flex: 1, marginBottom: 0 }}>
                  <span className="field-label">Pendência</span>
                  <input
                    className="field-input"
                    placeholder="Descreva o que aconteceu"
                    value={textoPend[p.id] ?? ""}
                    onChange={(e) => setTextoPend((s) => ({ ...s, [p.id]: e.target.value }))}
                    aria-label={`Texto da pendência da parada ${p.ordem}`}
                  />
                </label>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => registrarPendencia(p)}
                  aria-label={`Registrar pendência na parada ${p.ordem}`}
                >
                  Registrar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="h2" style={{ marginTop: 32 }}>
        Pontos registrados ({pontos.length})
      </h2>
      {pontos.length === 0 ? (
        <p className="hint">Ainda sem coordenadas — faça o primeiro check-in.</p>
      ) : (
        <ul className="coords">
          {pontos.map((p) => (
            <li key={p.id}>
              #{p.id}: {p.lat?.toFixed(5)}, {p.lng?.toFixed(5)} ({p.status})
            </li>
          ))}
        </ul>
      )}

      <Link className="back-link" href="/">
        ← voltar
      </Link>
    </main>
  );
}
