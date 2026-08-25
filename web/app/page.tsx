import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell">
      <div className="brand-row">
        <span className="brand-mark">ER</span>
        <span className="brand-name">EntregaRota</span>
      </div>

      <section className="hero-route">
        <p className="eyebrow">Gestão de entregas</p>
        <h1>Sua operação de rota em um só lugar</h1>
        <p className="lede">
          Crie rotas, distribua paradas e acompanhe check-ins com GPS do time de
          campo — direto do celular ou do painel.
        </p>
        <div className="hero-kpis">
          <div className="hero-kpi">
            <strong>—</strong>
            <span>Rotas hoje</span>
          </div>
          <div className="hero-kpi">
            <strong>—</strong>
            <span>Paradas feitas</span>
          </div>
          <div className="hero-kpi">
            <strong>—</strong>
            <span>Problemas</span>
          </div>
        </div>
        <p className="hint">
          Entre para ver os números reais da sua operação.
        </p>
      </section>

      <nav className="nav-cards" aria-label="Navegação principal">
        <Link href="/entrar" className="nav-card">
          Entrar
          <small>Login demo demo / demo123</small>
        </Link>
        <Link href="/operador" className="nav-card">
          Operador
          <small>Criar rota e adicionar paradas</small>
        </Link>
        <Link href="/rota" className="nav-card">
          Rota de hoje
          <small>Check-in e pendências no campo</small>
        </Link>
        <Link href="/settings" className="nav-card">
          Configurações
          <small>Empresa, janelas e tolerância</small>
        </Link>
        <Link href="/users" className="nav-card">
          Equipe
          <small>Operadores e entregadores</small>
        </Link>
      </nav>

      <footer className="site-footer">
        <span>EntregaRota · Tech42</span>
        <span>v2.0</span>
      </footer>
    </main>
  );
}
