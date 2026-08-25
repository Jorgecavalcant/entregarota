"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "../../lib/useRequireAuth";
import { Parada, Rota, api } from "../../lib/api";

function badgeFor(status: Parada["status"]) {
  if (status === "feito") return "badge badge--feita";
  if (status === "problema") return "badge badge--problema";
  return "badge badge--pendente";
}

export default function OperadorPage() {
  const { ready, logout } = useRequireAuth();
  const router = useRouter();

  const [rota, setRota] = useState<Rota | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [nomeRota, setNomeRota] = useState("");
  const [endereco, setEndereco] = useState("");
  const [ordem, setOrdem] = useState("");

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const rotas = await api.rotasHoje();
      setRota(rotas.length > 0 ? rotas[0] : null);
    } catch (e: any) {
      if (e.message === "AUTH_REQUIRED") {
        router.push("/entrar?next=/operador");
        return;
      }
      setErro("Não foi possível carregar as rotas de hoje.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (ready) carregar();
  }, [ready, carregar]);

  async function criarNovaRota(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setMsg(null);
    try {
      const nova = await api.criarRota(nomeRota.trim());
      setRota(nova);
      setMsg(`Rota "${nova.nome}" criada. Agora adicione as paradas.`);
      setNomeRota("");
    } catch (e: any) {
      if (e.message === "AUTH_REQUIRED") {
        router.push("/entrar?next=/operador");
        return;
      }
      setErro(e.message || "Falha ao criar rota.");
    }
  }

  async function adicionarParada(e: FormEvent) {
    e.preventDefault();
    if (!rota) return;
    setErro(null);
    setMsg(null);
    try {
      const atualizada = await api.addParada(
        rota.id,
        endereco.trim(),
        ordem.trim() === "" ? rota.paradas.length + 1 : Number(ordem)
      );
      setRota(atualizada);
      setEndereco("");
      setOrdem("");
      setMsg("Parada adicionada à rota.");
    } catch (e: any) {
      if (e.message === "AUTH_REQUIRED") {
        router.push("/entrar?next=/operador");
        return;
      }
      setErro(e.message || "Falha ao adicionar parada.");
    }
  }

  if (!ready) return null;

  if (loading) {
    return (
      <main className="shell">
        <p className="hint">Carregando…</p>
      </main>
    );
  }

  const c = rota?.contagens;

  return (
    <main className="shell">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p className="eyebrow">Operação</p>
          <h2>Painel do operador</h2>
        </div>
        <button className="btn btn-secondary" onClick={logout}>Sair</button>
      </header>

      {msg && <p className="alert alert--ok">{msg}</p>}
      {erro && <p className="alert alert--error">{erro}</p>}

      {!rota ? (
        <div className="panel state-block">
          <h2>Nenhuma rota para hoje</h2>
          <p className="lede">Dê um nome à rota de hoje para começar.</p>
          <form onSubmit={criarNovaRota} className="form-row">
            <label className="field">
              <span className="field-label">Nome da rota</span>
              <input
                className="field-input"
                value={nomeRota}
                onChange={(e) => setNomeRota(e.target.value)}
                placeholder="Ex.: Centro — manhã"
                required
              />
            </label>
            <button className="btn btn-primary" type="submit">Criar rota</button>
          </form>
        </div>
      ) : (
        <>
          <div className="panel">
            <h2>{rota.nome}</h2>
            <div className="stats">
              <div className="stat">
                <span className="stat-value">{c?.total_paradas ?? rota.paradas.length}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat stat--done">
                <span className="stat-value">{c?.feitas ?? 0}</span>
                <span className="stat-label">Feitas</span>
              </div>
              <div className="stat stat--accent">
                <span className="stat-value">{c?.pendentes ?? 0}</span>
                <span className="stat-label">Pendentes</span>
              </div>
              <div className="stat stat--warn">
                <span className="stat-value">{c?.problemas ?? 0}</span>
                <span className="stat-label">Problemas</span>
              </div>
            </div>
          </div>

          <div className="panel">
            <h2>Adicionar parada</h2>
            <form onSubmit={adicionarParada}>
              <label className="field">
                <span className="field-label">Endereço da parada</span>
                <input
                  className="field-input"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, número — cliente"
                  required
                />
              </label>
              <label className="field">
                <span className="field-label">Ordem (opcional)</span>
                <input
                  className="field-input"
                  type="number"
                  min={1}
                  value={ordem}
                  onChange={(e) => setOrdem(e.target.value)}
                  placeholder={`${rota.paradas.length + 1}`}
                />
              </label>
              <button className="btn btn-primary" type="submit">
                Adicionar parada
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>Paradas ({rota.paradas.length})</h2>
            {rota.paradas.length === 0 ? (
              <p className="hint">Nenhuma parada ainda. Adicione a primeira acima.</p>
            ) : (
              <ul className="timeline" style={{ listStyle: "none", padding: 0 }}>
                {rota.paradas.map((p) => (
                  <li key={p.id} className="parada">
                    <div className="parada-head">
                      <span className="parada-ordem">{p.ordem}</span>
                      <span className={`parada-dot parada-dot--${p.status}`} />
                      <h3 className="parada-endereco">{p.endereco}</h3>
                      <span className={badgeFor(p.status)}>{p.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="nav-cards">
            <Link href="/rota" className="nav-card">
              Executar a rota →
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
