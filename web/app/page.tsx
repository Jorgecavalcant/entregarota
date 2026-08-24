import Link from "next/link";
export default function Home() {
  return (
    <main>
      <p>Tech42</p>
      <h1>EntregaRota</h1>
      <p>Rota do dia, check-in com localização e pendências.</p>
      <p>
        <Link href="/rota">Abrir rota</Link> · <Link href="/operador">Operador</Link>
      </p>
      <p style={{ opacity: 0.7 }}>Domínio: entregarota.tech42.com.br</p>
    </main>
  );
}
