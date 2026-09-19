import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ROOMS } from '@/lib/game'
import LogoutButton from '@/components/logout-button'

const POS = [[13,22],[31,39],[49,20],[68,35],[42,61],[76,58],[23,78],[57,83]]

export const dynamic = 'force-dynamic'

export default async function SynoraDashboard() {
  const supabase = await createClient()
  const { data:{user} } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const [{ data: profile }, { data: progress }] = await Promise.all([
    supabase.from('profiles').select('display_name, role').eq('id', user.id).maybeSingle(),
    supabase.from('game_progress').select('current_room, completed_rooms, hints_used, errors').eq('user_id', user.id).maybeSingle(),
  ])
  const current = Math.min(progress?.current_room ?? 1, 8)
  const completed = progress?.completed_rooms ?? 0
  return <main className="synora-shell"><div className="grid-bg"/><div className="scanlines"/><div className="aurora aurora-a"/><div className="aurora aurora-b"/>
    <header className="topbar"><div className="brand"><span className="brand-mark">S</span> SYNORA <i>//</i> CITY NETWORK</div><div className="top-actions"><div className="status"><span className="dot"/> NETWORK DEGRADED</div><LogoutButton/></div></header>
    <section className="dashboard">
      <div className="dash-head"><div><div className="eyebrow">CITY CONTROL MAP · {profile?.role === 'teacher' ? 'TEACHER NODE' : 'FIELD NODE'}</div><h1 className="dash-title">Il Piano regolatore</h1><p className="dash-sub">Otto distretti. Ottanta missioni. Una rete. Un solo percorso per riportare Synora online.</p></div></div>
      <div className="map-panel"><div className="map-label top-left">SYNORA / SECTOR MAP <span>v4.0 · 80 MISSIONI</span></div><div className="map-label bottom-right">LATENCY <b>17ms</b> · PACKETS <b>STABLE</b></div>
        <div className="map-inner">
          <svg className="network-lines" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="route" x1="0" x2="1"><stop offset="0" stopColor="#71e6ff" stopOpacity=".12"/><stop offset=".5" stopColor="#71e6ff" stopOpacity=".75"/><stop offset="1" stopColor="#71e6ff" stopOpacity=".12"/></linearGradient></defs>
            <path d="M130 130 L315 235 L500 120 L700 215 L760 350 L580 490 L420 365 L230 470 L130 130" fill="none" stroke="rgba(113,230,255,.12)" strokeWidth="1"/>
            <path d="M130 130 L315 235 L500 120 L700 215" fill="none" stroke="url(#route)" strokeWidth="2" strokeDasharray="3 13"><animate attributeName="stroke-dashoffset" from="0" to="-48" dur="2.5s" repeatCount="indefinite"/></path>
            <path d="M315 235 L420 365 L580 490 L760 350 L700 215" fill="none" stroke="rgba(113,230,255,.18)" strokeWidth="1" strokeDasharray="2 9"/>
          </svg>
          <div className="map-watermark">SYNORA</div>
          {ROOMS.map((room,i)=>{const unlocked=room.id<=current; const done=room.id<current || room.id<=completed; const content=<><div className="node-ring"><div className="core">{done?'✓':String(room.id).padStart(2,'0')}</div></div><span>{room.name}</span><small>{room.topic}</small></>; return unlocked ? <Link key={room.id} className={`node active ${done?'done':''}`} style={{left:`${POS[i][0]}%`,top:`${POS[i][1]}%`}} href={`/synora/room/${room.id}`}>{content}</Link> : <div key={room.id} className={`node locked ${done?'done':''}`} style={{left:`${POS[i][0]}%`,top:`${POS[i][1]}%`}} aria-disabled="true">{content}</div>})}
        </div>
      </div>
      <div className="progress"><div className="stat"><span>Distretti ripristinati</span><b>{completed}<em>/08</em></b></div><div className="stat"><span>Fronte attuale</span><b>0{current}</b></div><div className="stat"><span>Errori registrati</span><b>{progress?.errors ?? 0}</b></div><div className="stat"><span>Indizi consumati</span><b>{progress?.hints_used ?? 0}</b></div></div>
      <div className="map-footer"><span>FIELD PROTOCOL: 10 missioni per distretto · 80 prove totali.</span><span>CHIAVE FINALE: <b>████████</b></span></div>
    </section>
  </main>
}
