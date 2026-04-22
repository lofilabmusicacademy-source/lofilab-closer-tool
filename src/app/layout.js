export const metadata = {
  title: 'Lofi Lab — Closer Prep Tool',
  description: 'Herramienta de preparación de llamadas para closers de Lofi Lab',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}