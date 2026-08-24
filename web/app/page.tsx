"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>EntregaRota</h1>
      <p>Distribuição local — MVP.</p>
      <ul>
        <li><Link href="/rota">Minha rota de hoje (check-in)</Link></li>
        <li><Link href="/operador">Operador: criar rota</Link></li>
      </ul>
    </main>
  );
}
