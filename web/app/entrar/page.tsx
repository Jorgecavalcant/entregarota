"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginDemo } from "../../lib/api";

function EntrarForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      await loginDemo(usuario.trim(), senha);
      const next = params.get("next") || "/";
      router.replace(next);
    } catch {
      setErro("Não foi possível entrar. Verifique usuário e senha.");
      setLoading(false);
    }
  }

  return (
    <div className="shell">
      <div className="brand-row">
        <span className="brand-mark">ER</span>
        <span className="brand-name">EntregaRota</span>
      </div>

      <p className="eyebrow">Acesso do operador</p>
      <p className="lede">
        Entre para ver e executar a rota de hoje. Credenciais de demonstração:{" "}
        demo / demo123.
      </p>

      <form onSubmit={onSubmit}>
        <label className="field">
          <span className="field-label">Usuário</span>
          <input
            className="field-input"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="demo"
            autoComplete="username"
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Senha</span>
          <input
            className="field-input"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="demo123"
            autoComplete="current-password"
            required
          />
        </label>

        {erro && <p className="alert alert--error">{erro}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default function EntrarPage() {
  return (
    <Suspense fallback={<div className="shell"><p className="hint">Carregando…</p></div>}>
      <EntrarForm />
    </Suspense>
  );
}
