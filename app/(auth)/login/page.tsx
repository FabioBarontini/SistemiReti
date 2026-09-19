'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const [busy,setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('ACCESSO NEGATO — credenziali non riconosciute.'); setBusy(false); return }
    router.push('/synora'); router.refresh()
  }

  return <main className="synora-shell login-page"><div className="grid-bg"/><div className="scanlines"/><div className="aurora aurora-a"/><div className="aurora aurora-b"/>
    <header className="topbar"><div className="brand"><span className="brand-mark">S</span> SYNORA <i>//</i> NETWORK CONTROL</div><div className="status"><span className="dot"/> CORE OFFLINE</div></header>
    <section className="login-wrap">
      <div className="login-card">
        <div className="hero">
          <div className="kicker">IL PIANO REGOLATORE DEI MONDI CONNESSI</div>
          <h1>SYNORA</h1>
          <p className="hero-lead">La città è ancora lì.<br/><strong>I collegamenti no.</strong></p>
          <div className="city-orbit"><div className="orbit o1"/><div className="orbit o2"/><div className="orbit o3"/><div className="orbit-core">S</div><span className="orbit-node n1"/><span className="orbit-node n2"/><span className="orbit-node n3"/></div>
          <div className="quote">«Esiste un’aria impalpabile che lega ogni cosa, un respiro silenzioso che trasporta le idee.»</div>
          <div className="hero-meta"><span>8 DISTRETTI</span><span>∞ CONNESSIONI</span><span>1 CITTÀ</span></div>
        </div>
        <div className="auth">
          <div className="auth-seal">ACCESS NODE <b>01</b></div>
          <h2>Ripristino della rete</h2>
          <div className="sub">Identificatevi per recuperare la vostra sessione. Synora conserverà il percorso, le prove e le chiavi già ottenute.</div>
          <form onSubmit={submit}>
            <div className="field"><label>Identificativo</label><input type="email" placeholder="nome@scuola.it" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username" /></div>
            <div className="field"><label>Codice di accesso</label><input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" /></div>
            <button className="cta" disabled={busy}>{busy ? 'CONNESSIONE…' : 'ENTRA IN SYNORA  →'}</button>
            {error && <div className="error">{error}</div>}
          </form>
          <div className="auth-note"><span className="tiny-dot"/> SESSIONE PERSISTENTE · STATO SALVATO SUL SERVER</div>
        </div>
      </div>
    </section>
  </main>
}
