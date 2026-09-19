'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password.length < 6) {
      setError('Il codice di accesso deve contenere almeno 6 caratteri.')
      return
    }
    if (password !== confirm) {
      setError('I due codici di accesso non coincidono.')
      return
    }

    setBusy(true)
    const emailRedirectTo = `${window.location.origin}/auth/confirm`
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName.trim() || 'Operatore' },
        emailRedirectTo,
      },
    })

    if (error) {
      setError(error.message)
      setBusy(false)
      return
    }

    if (data.session) {
      router.push('/synora')
      router.refresh()
      return
    }

    setMessage('Registrazione completata. Controlla la tua email e conferma l’account prima di entrare in Synora.')
    setBusy(false)
  }

  return (
    <main className="synora-shell login-page">
      <div className="grid-bg"/><div className="scanlines"/><div className="aurora aurora-a"/><div className="aurora aurora-b"/>
      <header className="topbar">
        <div className="brand"><span className="brand-mark">S</span> SYNORA <i>//</i> NETWORK CONTROL</div>
        <div className="status"><span className="dot"/> NEW NODE</div>
      </header>

      <section className="login-wrap">
        <div className="login-card">
          <div className="hero">
            <div className="kicker">REGISTRAZIONE · NUOVO NODO</div>
            <h1>ENTRA<br/>NELLA<br/>CITTÀ.</h1>
            <p className="hero-lead">Ogni operatore ha un percorso.<br/><strong>Ogni percorso lascia una traccia.</strong></p>
            <div className="city-orbit"><div className="orbit o1"/><div className="orbit o2"/><div className="orbit o3"/><div className="orbit-core">S</div><span className="orbit-node n1"/><span className="orbit-node n2"/><span className="orbit-node n3"/></div>
            <div className="quote">Prima di poter attraversare Synora, devi avere un’identità nella rete.</div>
            <div className="hero-meta"><span>IDENTITÀ</span><span>SESSIONE</span><span>PROGRESSO</span></div>
          </div>

          <div className="auth">
            <div className="auth-seal">REGISTRATION NODE <b>00</b></div>
            <h2>Crea il tuo accesso</h2>
            <div className="sub">Il tuo profilo conserverà il percorso nell’indagine, le prove superate e le chiavi conquistate.</div>
            <form onSubmit={submit}>
              <div className="field"><label>Nome operatore</label><input type="text" placeholder="es. Marco Rossi" value={displayName} onChange={e=>setDisplayName(e.target.value)} required autoComplete="name" /></div>
              <div className="field"><label>Identificativo email</label><input type="email" placeholder="nome@scuola.it" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" /></div>
              <div className="field"><label>Codice di accesso</label><input type="password" placeholder="almeno 6 caratteri" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} autoComplete="new-password" /></div>
              <div className="field"><label>Ripeti il codice</label><input type="password" placeholder="ripeti il codice" value={confirm} onChange={e=>setConfirm(e.target.value)} required minLength={6} autoComplete="new-password" /></div>
              <button className="cta" disabled={busy}>{busy ? 'CREAZIONE…' : 'CREA IDENTITÀ  →'}</button>
              {error && <div className="error">{error}</div>}
              {message && <div className="success-message">{message}</div>}
            </form>
            <div className="auth-switch">Hai già un accesso? <Link href="/login">ENTRA NELLA RETE →</Link></div>
            <div className="auth-note"><span className="tiny-dot"/> DATI DI GIOCO SALVATI SUL SERVER · ACCESSO PROTETTO</div>
          </div>
        </div>
      </section>
    </main>
  )
}
