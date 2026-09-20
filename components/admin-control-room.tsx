'use client'

import { useEffect, useMemo, useState } from 'react'
import LogoutButton from '@/components/logout-button'

type Room = { room_id:number; status:string; score:number; hints_used:number; started_at:string|null; completed_at:string|null }
type Player = { user_id:string; current_room:number; completed_rooms:number; hints_used:number; errors:number; score:number; updated_at:string; profile:{display_name:string;role:string}|null; rooms:Room[] }

const roomNames=['Torre dei Sette Livelli','Città senza Indirizzi','Distretto Impossibile','Pacchetto Scomparso','Router che Mente','Rete Fantasma','Synora deve Sopravvivere','Il Terminale']

function ago(value:string){const s=Math.max(0,Math.floor((Date.now()-new Date(value).getTime())/1000));if(s<60)return `${s}s fa`;if(s<3600)return `${Math.floor(s/60)}m fa`;return `${Math.floor(s/3600)}h fa`}

export default function AdminControlRoom(){
 const [players,setPlayers]=useState<Player[]>([]); const [generated,setGenerated]=useState(''); const [selected,setSelected]=useState<string>(''); const [loading,setLoading]=useState(true)
 const load=async()=>{setLoading(true);const r=await fetch('/api/admin/overview',{cache:'no-store'});if(r.ok){const d=await r.json();setPlayers(d.players??[]);setGenerated(d.generatedAt??'')}setLoading(false)}
 useEffect(()=>{load();const id=window.setInterval(load,5000);return()=>window.clearInterval(id)},[])
 const stats=useMemo(()=>({online:players.filter(p=>Date.now()-new Date(p.updated_at).getTime()<120000).length,done:players.filter(p=>p.completed_rooms===8).length,total:players.reduce((n,p)=>n+p.completed_rooms,0),score:players.reduce((n,p)=>n+p.score,0)}),[players])
 const current=players.find(p=>p.user_id===selected)
 return <main className="synora-shell"><div className="grid-bg"/><div className="scanlines"/><header className="topbar"><div className="brand"><span className="brand-mark">S</span> SYNORA <i>//</i> CONTROL ROOM</div><div className="top-actions"><div className="status"><span className="dot"/> TEACHER NODE · LIVE</div><LogoutButton /></div></header>
 <section className="dashboard admin-dashboard"><div className="eyebrow">TEACHER CONTROL // LIVE MONITOR</div><h1 className="dash-title">La rete sotto controllo.</h1><p className="admin-subtitle">Monitoraggio delle squadre, punteggi e avanzamento. Aggiornamento automatico ogni 5 secondi.</p>
 <div className="admin-kpis"><div><small>OPERATORI</small><b>{players.length}</b></div><div><small>ATTIVI</small><b>{stats.online}</b></div><div><small>DISTRETTI RIPRISTINATI</small><b>{stats.total}</b></div><div><small>MISSIONI COMPLETE</small><b>{stats.done}</b></div><div><small>PUNTI TOTALI</small><b>{stats.score.toLocaleString('it-IT')}</b></div></div>
 <section className="admin-panel"><div className="admin-panel-head"><div><span className="eyebrow">FIELD OPERATORS</span><h2>Stato giocatori</h2></div><button className="ghost-btn" onClick={load} disabled={loading}>{loading?'AGGIORNAMENTO…':'↻ AGGIORNA'}</button></div>
 <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Operatore</th><th>Stato</th><th>Distretto</th><th>Avanzamento</th><th>Punteggio</th><th>Errori</th><th>Indizi</th><th>Attività</th></tr></thead><tbody>{players.map(p=>{const online=Date.now()-new Date(p.updated_at).getTime()<120000;return <tr key={p.user_id} className={selected===p.user_id?'selected':''} onClick={()=>setSelected(p.user_id)}><td><strong>{p.profile?.display_name||'Operatore'}</strong><small>{p.user_id.slice(0,8)}</small></td><td><span className={`admin-status ${online?'online':'idle'}`}><i/>{online?'ONLINE':'IDLE'}</span></td><td><b>0{Math.min(p.current_room,8)}</b><small>{roomNames[Math.min(p.current_room,8)-1]}</small></td><td><div className="admin-progress"><i style={{width:`${p.completed_rooms/8*100}%`}}/></div><small>{p.completed_rooms}/8</small></td><td><strong className="score-value">{p.score.toLocaleString('it-IT')}</strong></td><td>{p.errors}</td><td>{p.hints_used}</td><td>{ago(p.updated_at)}</td></tr>})}</tbody></table>{players.length===0&&<div className="admin-empty">Nessun operatore registrato.</div>}</div></section>
 {current&&<section className="admin-player"><div className="admin-player-head"><div><span className="eyebrow">OPERATOR PROFILE</span><h2>{current.profile?.display_name||'Operatore'}</h2><small>Ultimo aggiornamento: {new Date(current.updated_at).toLocaleString('it-IT')}</small></div><div className="big-score"><small>SCORE</small><b>{current.score.toLocaleString('it-IT')}</b></div></div><div className="room-status-grid">{current.rooms.map(r=><div key={r.room_id} className={`room-status-card ${r.status}`}><span>0{r.room_id}</span><strong>{roomNames[r.room_id-1]}</strong><small>{r.status==='completed'?`COMPLETATO · ${r.score} PT · ${r.hints_used} indizi`:r.status==='active'?`IN CORSO · ${r.hints_used} indizi`:'BLOCCATO'}</small>{r.status==='completed'&&<em>{r.completed_at?new Date(r.completed_at).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'}):''}</em>}</div>)}</div></section>}
 {generated&&<div className="admin-footer">CORE TELEMETRY · {new Date(generated).toLocaleTimeString('it-IT')}</div>}
 </section></main>
}
