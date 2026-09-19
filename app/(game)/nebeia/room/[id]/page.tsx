import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROOMS } from '@/lib/game'
import RoomOne from '@/components/room-one'

export default async function RoomPage({ params }: { params: Promise<{id:string}> }) {
  const {id} = await params; const roomId=Number(id); const room=ROOMS.find(r=>r.id===roomId)
  if(!room) notFound()
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect('/login')
  const {data:progress}=await supabase.from('game_progress').select('current_room,completed_rooms').eq('user_id',user.id).maybeSingle()
  if(roomId>(progress?.current_room??1)) redirect('/synora')
  return <main className="synora-shell"><div className="grid-bg"/><div className="scanlines"/><header className="topbar"><div className="brand">SYNORA // NODE 0{roomId}</div><div className="status"><span className="dot"/> CONNECTION STABLE</div></header><section className="room"><div className="eyebrow">QUARTIERE 0{roomId}</div><h1 style={{fontSize:'clamp(38px,6vw,70px)',marginBottom:12}}>{room.name}</h1><p style={{color:'#90aabd',maxWidth:760,lineHeight:1.7}}>{room.short} · Ogni risposta deve essere verificata sul sistema. Non basta indovinare: dovete dimostrare che la rete è coerente.</p>{roomId===1?<RoomOne/>:<div className="room-card"><div className="notice">Questo nodo è già predisposto nell'architettura. La prova verrà innestata qui nel prossimo modulo. Il percorso e lo stato vengono comunque gestiti dal database.</div></div>}</section></main>
}
