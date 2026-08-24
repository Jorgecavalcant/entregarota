export const metadata = { title: "EntregaRota", description: "Rotas do dia — Tech42" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui", margin: 0, padding: 24, background: "#0f1419", color: "#e8eef4" }}>
        {children}
      </body>
    </html>
  );
}
