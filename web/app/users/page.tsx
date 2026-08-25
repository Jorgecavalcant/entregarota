"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "../../lib/useRequireAuth";
import Link from "next/link";

type Usuario = {
  id: number;
  nome: string;
  papel: "operador" | "entregador";
  status: "ativo" | "inativo";
};

const KEY = "er_users";

function seed(): Usuario[] {
  return [
    { id: 1, nome: "Ana Souza", papel: "operador", status: "ativo" },
    { id: 2, nome: "Bruno Lima", papel: "entregador", status: "ativo" },
    { id: 3, nome: "Carla Dias", papel: "entregador", status: "inativo" },
  ];
}

export default function UsersPage() {
  const { ready, logout } = useRequireAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [papel, setPapel] = useState<"operador" | "entregador">("entregador");
  const [status, setStatus] = useState<"ativo" | "inativo">("ativo");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) {
        window.localStorage.setItem(KEY, JSON.stringify(seed()));
        setUsuarios(seed());
      } else {
        setUsuarios(JSON.parse(raw));
      }
    } catch {
      setUsuarios(seed());
    }
  }, []);

  function persist(next: Usuario[]) {
    setUsuarios(next);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }

  function resetForm() {
    setEditingId(null);
    setNome("");
    setPapel("entregador");
    setStatus("ativo");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    if (editingId !== null) {
      persist(
        usuarios.map((u) =>
          u.id === editingId ? { ...u, nome: nome.trim(), papel, status } : u
        )
      );
      setAlert(`Usuário "${nome}" atualizado com sucesso.`);
    } else {
      const novoId = usuarios.length ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
      persist([...usuarios, { id: novoId, nome: nome.trim(), papel, status }]);
      setAlert(`Usuário "${nome}" adicionado com sucesso.`);
    }
    resetForm();
  }

  function handleEdit(u: Usuario) {
    setEditingId(u.id);
    setNome(u.nome);
    setPapel(u.papel);
    setStatus(u.status);
  }

  function handleDelete(id: number) {
    const u = usuarios.find((x) => x.id === id);
    if (!window.confirm(`Excluir o usuário "${u?.nome}"?`)) return;
    persist(usuarios.filter((x) => x.id !== id));
    setAlert(`Usuário "${u?.nome}" excluído.`);
  }

  if (!ready) return null;

  return (
    <div className="shell">
      <header className="page-header">
        <div className="brand-row">
          <span className="brand-mark">ER</span>
          <span className="brand-name">EntregaRota</span>
          <div style={{ marginLeft: "auto" }}>
            {ready && (
              <>
                <button className="btn btn-ghost" onClick={logout}>
                  Sair
                </button>
              </>
            )}
          </div>
        </div>
        <h1>Usuários</h1>
        <Link href="/">Voltar</Link>
      </header>

      {alert && <div className="alert">{alert}</div>}

      <section className="panel">
        <h2>{editingId !== null ? "Editar usuário" : "Novo usuário"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nome:
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do usuário"
              required
            />
          </label>
          <label>
            Papel:
            <select value={papel} onChange={(e) => setPapel(e.target.value as any)}>
              <option value="operador">Operador</option>
              <option value="entregador">Entregador</option>
            </select>
          </label>
          <label>
            Status:
            <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </label>
          <button type="submit" className="btn btn-primary">
            {editingId !== null ? "Salvar" : "Adicionar"}
          </button>
          {editingId !== null && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </form>
      </section>

      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Papel</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>{u.papel === "operador" ? "Operador" : "Entregador"}</td>
                <td>
                  <span className={`badge ${u.status === "ativo" ? "badge--feita" : "badge--pendente"}`}>
                    {u.status === "ativo" ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(u)}>
                    Editar
                  </button>{" "}
                  <button className="btn btn-ghost" onClick={() => handleDelete(u.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
