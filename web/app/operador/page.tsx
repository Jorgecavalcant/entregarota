"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, Rota } from "../../lib/api";

export default function OperadorPage() {
  const [nome, setNome] = useState("");
  const [rota, setRota] = useState<Rota | null>(null);
  const [endereco, setEndereco] = useState("");
  const [ordem, setOrdem] = useState(0);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .rotasHoje()
      .then((rs) => {
        if (rs.length) setRota(rs[rs.length - 1]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function criarRota() {
    if (!nome.trim()) {
      setErro("Informe o nome da rota.");
      return;
    }
    try {
      const r = await api.criarRota(nome.trim());
      setRota(r);
      setNome("");
      setErro("");
      setOk("Rota criada. Agora adicione as paradas.");
      setOrdem(0);
    } catch (e) {
      setErro(String(e));
    }
  }

  async function addParada() {
    if (!rota || !endereco.trim()) {
      setErro("Informe o endereço da parada.");
      return;
    }
    try {
      const r = await api.addParada(rota.id, endereco.trim(), ordem);
      setRota(r);
      setEndereco("");
      setOrdem(ordem + 1);
      setErro("");
      setOk(`Parada ${ordem} adicionada.`);
    } catch (e) {
      setErro(String(e));
    }
  }

  return (
    <main className="shell">
      <div className="brand-row">
        <span className="brand-mark" aria-hidden="true" />
        <p className="brand-name">EntregaRota</p>
      </div>

      <p className="eyebrow">Painel do operador</p>
      <h1>Montar a rota</h1>
      <p className="lede">Crie a rota do dia e enfileire as paradas na ordem do trajeto.</p>

      {loading && (
        <div className="state-block" role="status">
          Carregando…
        </div>
      )}

      {erro && (
        <div className="alert alert--error" role="alert">
          {erro}
        </div>
      )}
      {ok && (
        <div className="alert alert--ok" role="status">
          {ok}
        </div>
      )}

      {!loading && !rota && (
        <div className="panel">
          <div className="field">
            <label className="field-label" htmlFor="nome-rota">
              Nome da rota
            </label>
            <input
              id="nome-rota"
              className="field-input"
              placeholder="Ex.: Zona Norte — manhã"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={criarRota}>
            Criar rota de hoje
          </button>
        </div>
      )}

      {!loading && rota && (
        <>
          <div className="panel">
            <h2 className="h2">{rota.nome}</h2>
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

            {rota.paradas.length === 0 ? (
              <p className="hint">Ainda sem paradas. Adicione a primeira abaixo.</p>
            ) : (
              <ol className="timeline">
                {rota.paradas.map((p) => (
                  <li key={p.id} className="parada">
                    <span className="parada-dot" data-status={p.status} aria-hidden="true" />
                    <div className="parada-head">
                      <span className="parada-ordem">#{p.ordem}</span>
                      <span className="parada-endereco">{p.endereco}</span>
                      <span className={`badge badge--${p.status === "feita" ? "feita" : p.status === "problema" ? "problema" : "pendente"}`}>
                        {p.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="panel">
            <h2 className="h2">Nova parada</h2>
            <div className="form-row">
              <div className="field">
                <label className="field-label" htmlFor="endereco">
                  Endereço
                </label>
                <input
                  id="endereco"
                  className="field-input"
                  placeholder="Rua, número, bairro"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>
              <div className="field" style={{ flex: "0 0 auto", minWidth: 72 }}>
                <label className="field-label" htmlFor="ordem">
                  Ordem
                </label>
                <input
                  id="ordem"
                  className="field-input field-input--sm"
                  type="number"
                  value={ordem}
                  onChange={(e) => setOrdem(Number(e.target.value))}
                  aria-label="Ordem da parada no trajeto"
                />
              </div>
              <button type="button" className="btn btn-primary" onClick={addParada}>
                Adicionar parada
              </button>
            </div>
          </div>

          <p>
            <Link className="btn btn-secondary" href="/rota">
              Ir para check-in →
            </Link>
          </p>
        </>
      )}

      <Link className="back-link" href="/">
        ← voltar
      </Link>
    </main>
  );
}
