'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="synora-shell login-page">
      <div className="grid-bg"/><div className="scanlines"/>
      <section className="login-wrap">
        <div className="login-card" style={{maxWidth: 900}}>
          <div className="auth" style={{width:'100%'}}>
            <div className="auth-seal">SYNORA <b>ERROR</b></div>
            <h2>La città non risponde.</h2>
            <div className="sub">Il nodo di accesso è stato raggiunto, ma il server non ha completato il caricamento della città.</div>
            <button className="cta" onClick={() => reset()}>RIPROVA →</button>
            <div className="auth-note"><span className="tiny-dot"/> Se il problema continua, controlla i log del deployment Vercel.</div>
          </div>
        </div>
      </section>
    </main>
  )
}
