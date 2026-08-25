"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "../../lib/useRequireAuth";

type Settings = {
  nomeEmpresa: string;
  cnpj: string;
  janelaInicio: string;
  janelaFim: string;
  raioGpsMetros: number;
};

const STORAGE_KEY = "er_settings";
const DEFAULTS: Settings = {
  nomeEmpresa: "",
  cnpj: "",
  janelaInicio: "08:00",
  janelaFim: "18:00",
  raioGpsMetros: 50,
};

export default function SettingsPage() {
  const { ready, logout } = useRequireAuth();
  const [form, setForm] = useState<Settings>(DEFAULTS);
  const [ok, setOk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Settings>;
        setForm({ ...DEFAULTS, ...parsed });
      }
    } catch {
      // ignore storage errors
    }
    setLoaded(true);
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setOk(null);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null);
    setError(null);

    if (!form.nomeEmpresa.trim()) {
      setError("Informe o nome da empresa.");
      return;
    }
    if (!Number.isFinite(form.raioGpsMetros) || form.raioGpsMetros < 10) {
      setError("O raio GPS deve ser no mínimo 10 metros.");
      return;
    }
    if (form.janelaFim <= form.janelaInicio) {
      setError("A janela de fim deve ser após a janela de início.");
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...form, raioGpsMetros: Number(form.raioGpsMetros) })
      );
      setOk("Configurações salvas com sucesso.");
    } catch {
      setError("Não foi possível salvar as configurações.");
    }
  }

  if (!ready) {
    return null;
  }

  return (
    <div className="shell">
      <header className="page-header">
        <div className="brand-row">
          <span className="brand-mark">ER</span>
          <span className="brand-name">EntregaRota</span>
        </div>
        <Link href="/" className="btn btn-ghost">
          ← Voltar
        </Link>
      </header>

      <main className="panel">
        <p className="eyebrow">Configurações</p>
        <h1>Ajustes da operação</h1>
        <p className="lede">
          Defina os dados da empresa, a janela de entregas e o raio de precisão
          do GPS usado nas confirmações.
        </p>

        {ok && <div className="alert alert--ok">{ok}</div>}
        {error && <div className="alert alert--error">{error}</div>}

        {!loaded ? (
          <p className="lede">Carregando configurações…</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label" htmlFor="nomeEmpresa">
                Nome da empresa *
              </label>
              <input
                id="nomeEmpresa"
                className="field-input"
                type="text"
                value={form.nomeEmpresa}
                onChange={(e) => update("nomeEmpresa", e.target.value)}
                placeholder="Ex.: EntregaRota Logística LTDA"
                required
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="cnpj">
                CNPJ
              </label>
              <input
                id="cnpj"
                className="field-input"
                type="text"
                value={form.cnpj}
                onChange={(e) => update("cnpj", e.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="janelaInicio">
                Início da janela
              </label>
              <input
                id="janelaInicio"
                className="field-input"
                type="time"
                value={form.janelaInicio}
                onChange={(e) => update("janelaInicio", e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="janelaFim">
                Fim da janela
              </label>
              <input
                id="janelaFim"
                className="field-input"
                type="time"
                value={form.janelaFim}
                onChange={(e) => update("janelaFim", e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="raioGpsMetros">
                Raio GPS (metros, mínimo 10)
              </label>
              <input
                id="raioGpsMetros"
                className="field-input"
                type="number"
                min={10}
                step={1}
                value={form.raioGpsMetros}
                onChange={(e) =>
                  update("raioGpsMetros", Number(e.target.value))
                }
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Salvar configurações
            </button>
            <button type="button" className="btn btn-ghost" onClick={logout}>
              Sair
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
