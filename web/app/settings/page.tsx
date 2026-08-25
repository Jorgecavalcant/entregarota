"use client";

import Link from "next/link";
import { useState } from "react";
import { useRequireAuth } from "../../lib/useRequireAuth";

export default function SettingsPage() {
  const { ready, logout } = useRequireAuth();
  const [aviso, setAviso] = useState<string | null>(null);

  function salvarEmBreve() {
    setAviso("Salvar configurações estará disponível em breve.");
  }

  if (!ready) return null;

  return (
    <main className="shell">
      <header className="page-header">
        <div className="brand-row" style={{ marginBottom: 0 }}>
          <span className="brand-mark">ER</span>
          <span className="brand-name">EntregaRota</span>
        </div>
        <button className="btn btn-ghost" onClick={logout}>Sair</button>
      </header>

      <div>
        <p className="eyebrow">Configurações</p>
        <h1>Ajustes da operação</h1>
        <p className="lede">
          Defina dados da empresa, janelas de entrega e tolerância geográfica.
          As alterações ainda não podem ser salvas nesta versão.
        </p>
      </div>

      {aviso && <p className="alert alert--ok">{aviso}</p>}

      <section className="panel section">
        <h2>Empresa</h2>
        <label className="field">
          <span className="field-label">Nome da empresa</span>
          <input className="field-input" placeholder="Ex.: Entregas Tech42 LTDA" disabled />
        </label>
        <label className="field">
          <span className="field-label">CNPJ</span>
          <input className="field-input" placeholder="00.000.000/0000-00" disabled />
        </label>
      </section>

      <section className="panel section">
        <h2>Janelas de entrega</h2>
        <label className="field">
          <span className="field-label">Início padrão</span>
          <input className="field-input" type="time" defaultValue="08:00" disabled />
        </label>
        <label className="field">
          <span className="field-label">Fim padrão</span>
          <input className="field-input" type="time" defaultValue="18:00" disabled />
        </label>
      </section>

      <section className="panel section">
        <h2>Geo / tolerância</h2>
        <label className="field">
          <span className="field-label">Raio de tolerância do check-in (m)</span>
          <input className="field-input" type="number" defaultValue={150} disabled />
        </label>
        <p className="hint">
          O geofence rígido entra em uma próxima versão; por enquanto o check-in
          registra apenas as coordenadas.
        </p>
      </section>

      <section className="panel section">
        <h2>Notificações</h2>
        <label className="field">
          <span className="field-label">Avisar operador ao registrar problema</span>
          <input className="field-input" type="checkbox" defaultChecked disabled />
        </label>
      </section>

      <div className="actions-row">
        <button className="btn btn-primary" onClick={salvarEmBreve}>
          Salvar configurações
        </button>
        <Link href="/" className="btn btn-ghost back-link">← Voltar</Link>
      </div>
    </main>
  );
}
