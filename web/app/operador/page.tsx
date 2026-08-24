"use client";
import { FormEvent, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function OperadorPage() {
  const [nome, setNome] = useState("Rota do dia");
  const [endereco, setEndereco] = useState("");
  const [rotaId, setRotaId] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  async function criarRota(e: FormEvent) {
    e.preventDefault();
    const r = await fetch(`${API}/api/v1/rotas`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    }).then((x) => x.json());
    setRotaId(r.id); setMsg(`Rota #${r.id} criada`);
  }
  async function addParada(e: FormEvent) {
    e.preventDefault();
    if (!rotaId) return;
    await fetch(`${API}/api/v1/rotas/${rotaId}/paradas`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endereco }),
    });
    setEndereco(""); setMsg("Parada adicionada");
  }
  return (
    <main>
      <h1>Operador</h1>
      <form onSubmit={criarRota}>
        <input value={nome} onChange={(e) => setNome(e.target.value)} />
        <button type="submit">Criar rota</button>
      </form>
      {rotaId && (
        <form onSubmit={addParada} style={{ marginTop: 16 }}>
          <input value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Endereço" required />
          <button type="submit">Add parada</button>
        </form>
      )}
      {msg && <p>{msg}</p>}
    </main>
  );
}
