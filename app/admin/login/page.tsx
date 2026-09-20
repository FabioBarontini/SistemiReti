'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const [busy,setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setBusy(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError('ACCESSO NEGATO — credenziali non riconosciute.'); setBusy(false); return }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id ?? '').maybeSingle()
    if (profile?.role !== 'teacher') {
      await supabase.auth.signOut()
      setError('ACCESSO DOCENTE NEGATO — questo account non è abilitato alla Control Room.')
      setBusy(false)
      return
    }
    router.push('/admin'); router.refresh()
  }

  return <main className="synora-shell login-page"><div className="grid-bg"/><div className="scanlines"/><div className="aurora aurora-a"/><div className="aurora aurora-b"/>
    <header className="topbar"><div className="brand"><span className="brand-mark">S</span> SYNORA <i>//</i> TEACHER CONTROL</div><div className="status"><span className="dot"/> TEACHER NODE</div></header>
    <section className="login-wrap">
      <div className="login-card">
        <div className="hero">
          <div className="kicker">CONTROL ROOM · ACCESS NODE</div>
          <h1>TEACHER</h1>
          <p className="hero-lead">La rete è sotto osservazione.<br/><strong>Entrate nella Control Room.</strong></p>
          <div className="city-orbit"><div className="orbit o1"/><div className="orbit o2"/><div className="orbit o3"/><div className="orbit-core">T</div><span className="orbit-node n1"/><span className="orbit-node n2"/><span className="orbit-node n3"/></div>
          <div className="quote">MONITORAGGIO · AVANZAMENTO · PUNTEGGI · STATO RETE</div>
          <div className="hero-meta"><span>8 DISTRETTI</span><span>LIVE</span><span>CONTROL ROOM</span></div>
        </div>
        <div className="auth">
          <div className="auth-seal">TEACHER NODE <b>00</b></div>
          <h2>Accesso docente</h2>
          <div className="sub">Usate l’account docente abilitato. Gli account degli studenti non possono accedere alla Control Room.</div>
          <form onSubmit={submit}>
            <div className="field"><label>Identificativo docente</label><input type="email" placeholder="nome@scuola.it" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username" /></div>
            <div className="field"><label>Codice di accesso</label><input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" /></div>
            <button className="cta" disabled={busy}>{busy ? 'VERIFICA AUTORIZZAZIONE…' : 'ENTRA NELLA CONTROL ROOM  →'}</button>
            {error && <div className="error">{error}</div>}
          </form>
          <div className="auth-switch"><Link href="/login">← ACCESSO STUDENTI</Link></div>
          <div className="auth-note"><span className="tiny-dot"/> RUOLO DOCENTE VERIFICATO DAL SERVER</div>
        </div>
      </div>
    </section>
  </main>
}
