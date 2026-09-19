import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROOMS } from '@/lib/game'
import LogoutButton from '@/components/logout-button'

export default async function SynoraDashboard() {
  const supabase = await createClient()
  const { data:{user} } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('display_name, role').eq('id',user.id).maybeSingle()
  const { data: progress } = await supabase.from('game_progress').select('current_room, completed_rooms, hints_used, errors').eq('user_id',user.id).maybeSingle()
  const current = progress?.current_room ?? 1
  const completed = progress?.completed_rooms ?? 0
  return <main className="synora-shell"><div className="grid-bg"/><div className="scanlines"/>
    <header className="topbar"><div className="brand">SYNORA // CITY NETWORK</div><div className="status"><span className="dot"/> {profile?.display_name ?? user.email}</div></header>
    <section className="dashboard">
      <div className="dash-head"><div><div className="eyebrow">CONTROL MAP // {profile?.role === 'teacher' ? 'TEACHER NODE' : 'FIELD NODE'}</div><div className="dash-title">Il Piano regolatore</div></div><LogoutButton/></div>
      <div className="map-panel"><div className="map-inner">
        <svg className="network-lines" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <path d="M150 110 L350 180 L500 105 L700 190 L850 120 M350 180 L420 370 L620 400 L700 190 M420 370 L250 490 L620 400 L820 500" fill="none" stroke="rgba(113,230,255,.14)" strokeWidth="1"/>
          <path d="M150 110 L350 180 L500 105" fill="none" stroke="rgba(113,230,255,.42)" strokeWidth="2" strokeDasharray="4 12"><animate attributeName="stroke-dashoffset" from="0" to="-32" dur="2s" repeatCount="indefinite"/></path>
        </svg>
        {ROOMS.map((room,i)=>{const pos=[[15,18],[35,30],[50,18],[70,32],[42,62],[62,67],[25,82],[82,83]][i]; const unlocked=room.id<=current; return <a key={room.id} className={`node ${unlocked?'active':'locked'}`} style={{left:`${pos[0]}%`,top:`${pos[1]}%`}} href={unlocked?`/synora/room/${room.id}`:'#'} onClick={e=>{if(!unlocked)e.preventDefault()}}><div className="core"/><span>0{room.id} · {room.name}</span><small>{room.short}</small></a>})}
      </div></div>
      <div className="progress"><div className="stat"><span>Nodi ripristinati</span><b>{completed} / 8</b></div><div className="stat"><span>Nodo attuale</span><b>0{current}</b></div><div className="stat"><span>Errori</span><b>{progress?.errors ?? 0}</b></div><div className="stat"><span>Indizi</span><b>{progress?.hints_used ?? 0}</b></div></div>
    </section>
  </main>
}
