"use client";

import { useEffect, useState } from "react";
import { api, Rota } from "../../lib/api";

export default function OperadorPage() {
  const [nome, setNome] = useState("");
  const [rota, setRota] = useState<Rota | null>(null);
  const [endereco, setEndereco] = useState("");
  const [ordem, setOrdem] = useState(0);
  const [erro, setErro] = useState("");

  useEffect(() => {
    api.rotasHoje().then((rs) => rs.length && setRota(rs[rs.length - 1])).catch(() => {});
  }, []);

  async function criarRota() {
    if (!nome.trim()) { setErro("Informe o nome"); return; }
    try {
      const r = await api.criarRota(nome.trim());
      setRota(r);
      setNome("");
      setErro("");
    } catch (e) { setErro(String(e)); }
  }

  async function addParada() {
    if (!rota || !endereco.trim()) { setErro("Informe o endereço"); return; }
    try {
      const r = await api.addParada(rota.id, endereco.trim(), ordem);
      setRota(r);
      setEndereco("");
      setOrdem(ordem + 1);
      setErro("");
    } catch (e) { setErro(String(e)); }
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Operador</h1>
      {!rota && (
        <div>
          <input placeholder="Nome da rota" value={nome} onChange={(e) => setNome(e.target.value)} />
          <button onClick={criarRota}>Criar rota de hoje</button>
        </div>
      )}
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {rota && (
        <>
          <h2>{rota.nome}</h2>
          <p>
            Total: {rota.contagens.total_paradas} | Feitas: {rota.contagens.feitas} |
            Pendentes: {rota.contagens.pendentes} | Problemas: {rota.contagens.problemas}
          </p>
          <ol>
            {rota.paradas.map((p) => (
              <li key={p.id}>[{p.ordem}] {p.endereco} — {p.status}</li>
            ))}
          </ol>
          <div>
            <input placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
            <input type="number" value={ordem} onChange={(e) => setOrdem(Number(e.target.value))} style={{ width: 60 }} />
            <button onClick={addParada}>Adicionar parada</button>
          </div>
          <p><a href={`/rota`}>Ir para check-in →</a></p>
        </>
      )}
      <a href="/">voltar</a>
    </main>
  );
}
