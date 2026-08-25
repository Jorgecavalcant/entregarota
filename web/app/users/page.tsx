"use client";

import Link from "next/link";
import { useState } from "react";
import { useRequireAuth } from "../../lib/useRequireAuth";

interface UsuarioMock {
  id: number;
  nome: string;
  papel: string;
  rota: string;
  status: "ativo" | "inativo";
}

const USUARIOS_MOCK: UsuarioMock[] = [
  { id: 1, nome: "Ana Souza", papel: "operador", rota: "Centro — manhã", status: "ativo" },
  { id: 2, nome: "Bruno Lima", papel: "entregador", rota: "Centro — manhã", status: "ativo" },
  { id: 3, nome: "Carla Dias", papel: "entregador", rota: "Zona Sul", status: "inativo" },
];

export default function UsersPage() {
  const { ready, logout } = useRequireAuth();
  const [aviso, setAviso] = useState<string | null>(null);

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
        <p className="eyebrow">Equipe</p>
        <h1>Usuários e papéis</h1>
        <p className="lede">
          Visualize quem opera rotas e quem executa entregas. Convites e
          atribuições estarão disponíveis em breve.
        </p>
      </div>

      {aviso && <p className="alert alert--ok">{aviso}</p>}

      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Papel</th>
              <th>Rota</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {USUARIOS_MOCK.map((u) => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>{u.papel}</td>
                <td>{u.rota}</td>
                <td>
                  <span className={u.status === "ativo" ? "badge badge--feita" : "badge badge--pendente"}>
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="actions-row">
        <button
          className="btn btn-primary"
          disabled
          title="Disponível em breve"
          onClick={() => setAviso("Convite de usuário em breve.")}
        >
          Convidar usuário
        </button>
        <button
          className="btn btn-secondary"
          disabled
          title="Disponível em breve"
          onClick={() => setAviso("Atribuição de rota em breve.")}
        >
          Atribuir rota
        </button>
        <Link href="/" className="btn btn-ghost back-link">← Voltar</Link>
      </div>
    </main>
  );
}
