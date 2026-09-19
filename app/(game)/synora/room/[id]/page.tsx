import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROOMS } from '@/lib/game'
import RoomChallenge from '@/components/rooms/room-challenge'

export default async function RoomPage({ params }: { params: Promise<{id:string}> }) {
  const {id} = await params; const roomId=Number(id); const room=ROOMS.find(r=>r.id===roomId)
  if(!room) notFound()
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect('/login')
  const {data:progress}=await supabase.from('game_progress').select('current_room,completed_rooms').eq('user_id',user.id).maybeSingle()
  if(roomId>(progress?.current_room??1)) redirect('/synora')
  return <main className="synora-shell"><div className="grid-bg"/><div className="scanlines"/><div className="aurora aurora-a"/>
    <header className="topbar"><div className="brand"><span className="brand-mark">S</span> SYNORA <i>//</i> DISTRICT 0{roomId}</div><div className="status"><span className="dot"/> TRACE ACTIVE</div></header>
    <section className="room"><div className="room-crumb"><a href="/synora">← MAPPA</a><span>/</span> DISTRETTO 0{roomId}</div><div className="room-hero"><div><div className="eyebrow">DISTRETTO 0{roomId} · {room.topic}</div><h1>{room.name}</h1><p>{room.subtitle}</p></div><div className="room-index"><span>NODE</span><b>0{roomId}</b><small>OF 08</small></div></div><div className="lore">{room.lore}</div><RoomChallenge roomId={roomId}/></section>
  </main>
}
