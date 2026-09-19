import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROOMS } from '@/lib/game'
import LogoutButton from '@/components/logout-button'
import { SynoraCityMap, SynoraConsole, SynoraArtifactArchive, SynoraFinale, IncidentEvent, Nexus } from '@/components/synora-experience'

export const dynamic = 'force-dynamic'

export default async function SynoraDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const [{ data: profile }, { data: progress }] = await Promise.all([
    supabase.from('profiles').select('display_name, role').eq('id', user.id).maybeSingle(),
    supabase.from('game_progress').select('current_room, completed_rooms, hints_used, errors').eq('user_id', user.id).maybeSingle(),
  ])
  const current = Math.min(progress?.current_room ?? 1, 8)
  const completed = progress?.completed_rooms ?? 0
  const errors = progress?.errors ?? 0
  const hints = progress?.hints_used ?? 0
  const activeRoom = ROOMS[current - 1]

  return <main className="synora-shell cinematic-dashboard">
    <div className="grid-bg"/><div className="scanlines"/><div className="aurora aurora-a"/><div className="aurora aurora-b"/>
    <div className="city-dust" aria-hidden="true">{Array.from({length:34},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}/>)}</div>
    <header className="topbar cinematic-topbar">
      <div className="brand"><span className="brand-mark">S</span> SYNORA <i>//</i> CITY NETWORK</div>
      <div className="top-actions"><div className="status"><span className="dot"/> NETWORK {errors > 5 ? 'CRITICAL' : 'DEGRADED'}</div><LogoutButton/></div>
    </header>

    <section className="dashboard cinematic-main">
      <div className="cinematic-hero">
        <div className="hero-copy">
          <div className="eyebrow">SYNORA CITY CONTROL · {profile?.role === 'teacher' ? 'TEACHER NODE' : 'FIELD NODE'}</div>
          <h1>Il Piano<br/><em>regolatore</em></h1>
          <p>La rete di Synora non è soltanto un sistema. È una città viva. Ogni pacchetto attraversa le sue strade, ogni rotta apre un passaggio, ogni errore lascia una cicatrice.</p>
          <div className="hero-actions"><a href={`/synora/room/${current}`} className="enter-button"><span>ENTRA NEL DISTRETTO {String(current).padStart(2,'0')}</span><b>→</b></a><div className="hero-status"><span>ACTIVE NODE</span><strong>{activeRoom?.name ?? 'CORE NETWORK'}</strong></div></div>
        </div>
        <div className="hero-core"><div className="core-orbit orbit-a"/><div className="core-orbit orbit-b"/><div className="core-orbit orbit-c"/><div className="core-sphere"><span>SYNORA</span><b>{String(Math.max(0,completed)).padStart(2,'0')}</b><small>NODES ONLINE</small></div><div className="core-signal signal-1">PACKETS <b>STABLE</b></div><div className="core-signal signal-2">LATENCY <b>17ms</b></div><div className="core-signal signal-3">TRACE <b>ACTIVE</b></div></div>
      </div>

      <SynoraConsole completed={completed} errors={errors} hints={hints}/>

      <div className="command-grid">
        <section className="district-terminal">
          <div className="section-kicker">CITY NETWORK // FIELD MAP</div>
          <div className="terminal-title"><div><span className="eyebrow">THE EIGHT DISTRICTS</span><h2>Riaccendi la città.</h2></div><div className="node-counter"><b>{completed}</b><span>/ 08 ONLINE</span></div></div>
          <SynoraCityMap current={current} completed={completed} errors={errors} hints={hints}/>
        </section>
        <aside className="control-rail">
          <IncidentEvent roomId={current}/>
          <Nexus roomId={current}/>
          <div className="field-readout"><span>FIELD PROTOCOL</span><b>10 MISSIONI / DISTRETTO</b><small>80 prove · 8 nodi · 1 rete</small></div>
          <div className="error-readout"><span>NETWORK CONDITION</span><strong>{errors === 0 ? 'NOMINAL' : errors < 5 ? 'UNSTABLE' : 'CRITICAL'}</strong><small>{errors} anomalie registrate · {hints} indizi consumati</small></div>
        </aside>
      </div>

      <SynoraArtifactArchive completed={completed}/>
      <SynoraFinale completed={completed} errors={errors} hints={hints}/>
    </section>
  </main>
}
