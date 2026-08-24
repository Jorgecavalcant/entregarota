"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="shell">
      <div className="brand-row">
        <span className="brand-mark" aria-hidden="true" />
        <p className="brand-name">EntregaRota</p>
      </div>

      <p className="eyebrow">Trajeto e movimento</p>
      <h1>Sua rota de hoje</h1>
      <p className="lede">
        Distribuição local com check-in no lugar certo — parada a parada, sem ruído.
      </p>

      <div className="hero-route" aria-hidden="true" />

      <ul className="nav-cards">
        <li>
          <Link className="nav-card" href="/rota" aria-label="Abrir minha rota de hoje para check-in">
            <strong>Minha rota de hoje</strong>
            <span>Check-in do entregador com geolocalização</span>
          </Link>
        </li>
        <li>
          <Link className="nav-card" href="/operador" aria-label="Abrir painel do operador para criar rota">
            <strong>Operador</strong>
            <span>Criar a rota do dia e adicionar paradas</span>
          </Link>
        </li>
      </ul>

      <p className="footer-note">EntregaRota · Tech42</p>
    </main>
  );
}
