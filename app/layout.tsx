import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SYNORA // Il Piano Regolatore',
  description: 'Escape room di Sistemi e Reti — Il Piano regolatore dei mondi connessi',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it"><body>{children}</body></html>
}
