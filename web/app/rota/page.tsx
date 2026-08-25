"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "../../lib/useRequireAuth";
import {
  Parada,
  Rota,
  api,
} from "../../lib/api";

function badgeFor(status: Parada["status"]) {
  if (status === "feito") return "badge badge--feita";
  if (status === "problema") return "badge badge--problema";
  return "badge badge--pendente";
}

type CheckPhase = "gps" | "sending";

export default function RotaPage() {
  const { ready, logout } = useRequireAuth();
  const router = useRouter();

  const [rota, setRota] = useState<Rota | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loadingCheckinId, setLoadingCheckinId] = useState<number | null>(null);
  const [checkPhase, setCheckPhase] = useState<CheckPhase>("gps");
  const [pendenciaAbertaId, setPendenciaAbertaId] = useState<number | null>(null);
  const [pendenciaTexto, setPendenciaTexto] = useState("");
  const [savingPendenciaId, setSavingPendenciaId] = useState<number | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const rotas = await api.rotasHoje();
      setRota(rotas.length > 0 ? rotas[0] : null);
    } catch (e: any) {
      if (e.message === "AUTH_REQUIRED") {
        router.push("/entrar?next=/rota");
        return;
      }
      setErro("Não foi possível carregar a rota. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (ready) carregar();
  }, [ready, carregar]);

  async function fazerCheckin(p: Parada) {
    setMsg(null);
    setErro(null);
    setLoadingCheckinId(p.id);
    setCheckPhase("gps");
    try {
      let coords: GeolocationPosition;
      try {
        coords = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, {
            enableHighAccuracy: true,
            timeout: 10000,
          })
        );
      } catch {
        setErro(
          "Precisamos da sua localização só no check-in. Permita o GPS e tente de novo."
        );
        return;
      }

      setCheckPhase("sending");
      await api.checkin(p.id, coords.coords.latitude, coords.coords.longitude);
      setMsg(`Check-in registrado em ${p.endereco}.`);
      await carregar();
    } catch (e: any) {
      if (e.message === "AUTH_REQUIRED") {
        router.push("/entrar?next=/rota");
        return;
      }
      setErro(e.message || "Falha no check-in.");
    } finally {
      setLoadingCheckinId(null);
      setCheckPhase("gps");
    }
  }

  async function registrarPendencia(p: Parada) {
    const texto = pendenciaTexto.trim();
    setErro(null);
    setMsg(null);
    setSavingPendenciaId(p.id);
    try {
      await api.pendencia(p.id, texto);
      setMsg(`Pendência registrada em ${p.endereco}.`);
      setPendenciaAbertaId(null);
      setPendenciaTexto("");
      await carregar();
    } catch (e: any) {
      if (e.message === "AUTH_REQUIRED") {
        router.push("/entrar?next=/rota");
        return;
      }
      setErro(e.message || "Falha ao registrar pendência.");
    } finally {
      setSavingPendenciaId(null);
    }
  }

  if (!ready) return null;

  if (loading) {
    return (
      <main className="shell">
        <p className="hint">Carregando sua rota…</p>
      </main>
    );
  }

  if (!rota) {
    return (
      <main className="shell">
        <div className="state-block">
          <h2>Nenhuma rota para hoje</h2>
          <p className="hint">
            Crie uma rota no painel do operador e adicione as paradas antes de
            começar as entregas.
          </p>
          <Link href="/operador" className="btn btn-primary">
            Ir para o operador
          </Link>
        </div>
        <button className="btn btn-secondary" onClick={logout}>Sair</button>
      </main>
    );
  }

  const c = rota.contagens;
  const pct =
    c.total_paradas > 0 ? Math.round((c.feitas / c.total_paradas) * 100) : 0;

  return (
    <main className="shell">
      <header className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p className="eyebrow">Execução</p>
          <h2>{rota.nome}</h2>
        </div>
        <button className="btn btn-secondary" onClick={logout}>Sair</button>
      </header>

      <div className="stats">
        <div className="stat">
          <span className="stat-value">{c.total_paradas}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat stat--done">
          <span className="stat-value">{c.feitas}</span>
          <span className="stat-label">Feitas</span>
        </div>
        <div className="stat stat--accent">
          <span className="stat-value">{c.pendentes}</span>
          <span className="stat-label">Pendentes</span>
        </div>
        <div className="stat stat--warn">
          <span className="stat-value">{c.problemas}</span>
          <span className="stat-label">Problemas</span>
        </div>
      </div>

      <div className="progress">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
        <span>{pct}% concluído</span>
      </div>

      {msg && <p className="alert alert--ok">{msg}</p>}
      {erro && <p className="alert alert--error">{erro}</p>}

      <section className="timeline">
        {rota.paradas.map((p) => (
          <article key={p.id} className="parada">
            <div className="parada-head">
              <span className="parada-ordem">{p.ordem}</span>
              <span className={`parada-dot parada-dot--${p.status}`} />
              <h3 className="parada-endereco">{p.endereco}</h3>
              <span className={badgeFor(p.status)}>{p.status}</span>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {p.status !== "feito" && (
                <>
                  <button
                    className="btn btn-primary"
                    disabled={loadingCheckinId !== null}
                    onClick={() => fazerCheckin(p)}
                  >
                    {loadingCheckinId === p.id
                      ? checkPhase === "gps"
                        ? "Buscando GPS…"
                        : "Registrando check-in…"
                      : "Fazer check-in"}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      setPendenciaAbertaId(
                        pendenciaAbertaId === p.id ? null : p.id
                      )
                    }
                  >
                    Registrar problema
                  </button>
                </>
              )}
            </div>

            {pendenciaAbertaId === p.id && p.status !== "feito" && (
              <div className="pendencia-row">
                <input
                  className="field-input"
                  value={pendenciaTexto}
                  onChange={(e) => setPendenciaTexto(e.target.value)}
                  placeholder="O que aconteceu? (mínimo 3 caracteres)"
                />
                <button
                  className="btn btn-primary"
                  disabled={pendenciaTexto.trim().length < 3 || savingPendenciaId === p.id}
                  onClick={() => registrarPendencia(p)}
                >
                  {savingPendenciaId === p.id ? "Salvando…" : "Salvar"}
                </button>
              </div>
            )}

            {(p.lat != null || p.lng != null || p.checked_at) && (
              <details className="coords">
                <summary>Ver pontos</summary>
                <code>
                  lat {p.lat != null ? p.lat.toFixed(6) : "—"}, lng{" "}
                  {p.lng != null ? p.lng.toFixed(6) : "—"}
                  {p.accuracy_m != null ? ` · ±${Math.round(p.accuracy_m)}m` : ""}
                  {p.checked_at ? ` · ${new Date(p.checked_at).toLocaleString()}` : ""}
                </code>
              </details>
            )}
          </article>
        ))}
      </section>

      <footer style={{ marginTop: "16px" }}>
        <Link href="/operador" className="back-link">← Voltar ao operador</Link>
      </footer>
    </main>
  );
}
