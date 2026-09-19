'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

const districtAtmosphere = [
  ['TORRE / BLUEPRINT','OSI · PDU · INCAPSULAMENTO'],['CATasto / VERDE','IPv4 · VLSM'],['GEOMETRIA / VIOLET','CIDR · AGGREGAZIONE'],['FORENSICA / ROSSO','ROUTING · TRACEROUTE'],['TERMINALE / VERDE','DIAGNOSI · CISCO'],['FANTASMA / CYAN','VLAN · BROADCAST'],['CORE / CRITICAL','STP · REDUNDANZA'],['ARCHIVIO / GOLD','CLI · SINTESI']
]

export function SynoraCityMap({current, completed, errors, hints}:{current:number;completed:number;errors:number;hints:number}) {
  const pos=[[13,22],[31,39],[49,20],[68,35],[42,61],[76,58],[23,78],[57,83]]
  const corruption=Math.min(100, errors*7+hints*3)
  return <section className="synora-city-wrap">
    <div className="city-header"><div><span className="eyebrow">SYNORA // LIVING CITY</span><h2>La città è una rete.</h2><p>Ogni distretto ripristinato riaccende un nodo. Ogni errore lascia una piccola interferenza.</p></div><div className="city-meters"><span>STABILITY <b>{100-corruption}%</b></span><span>ONLINE <b>{completed}/8</b></span></div></div>
    <div className="living-map"><div className="city-grid"/><div className="city-corruption" style={{opacity:corruption/180}}/>
      <svg viewBox="0 0 1000 600" className="city-routes" aria-hidden="true"><path d="M130 130L315 235L500 120L700 215L760 350L580 490L420 365L230 470L130 130"/><path className="route-live" d="M130 130L315 235L500 120L700 215L760 350L580 490L420 365L230 470L130 130"/></svg>
      {Array.from({length:8},(_,i)=>{const id=i+1;const unlocked=id<=current;const done=id<=completed;return <Link key={id} href={unlocked?`/synora/room/${id}`:'/synora'} className={`city-node ${done?'online':''} ${unlocked?'unlocked':'locked'}`} style={{left:`${pos[i][0]}%`,top:`${pos[i][1]}%`}}><i>{done?'✓':String(id).padStart(2,'0')}</i><strong>{districtAtmosphere[i][0]}</strong><small>{districtAtmosphere[i][1]}</small></Link>})}
      <div className="city-center"><b>SYNORA</b><span>CORE NETWORK</span><em>{corruption>35?'INTERFERENCE':'NOMINAL'}</em></div>
    </div>
    <div className="city-legend"><span><i className="legend-online"/> ONLINE</span><span><i className="legend-live"/> TRACE</span><span><i className="legend-noise"/> INTERFERENCE {corruption}%</span></div>
  </section>
}

export function SynoraConsole({completed,errors,hints}:{completed:number;errors:number;hints:number}) {
  const [tick,setTick]=useState(0)
  useEffect(()=>{const id=setInterval(()=>setTick(x=>x+1),1800);return()=>clearInterval(id)},[])
  const packets=18429+completed*917+tick*3
  const routing=Math.min(100,32+completed*9)
  const security=Math.max(31,92-errors*5)
  return <div className="synora-console"><div className="console-title"><span>◆ SYNORA NETWORK CONTROL</span><small>LIVE CORE TELEMETRY</small></div><div className="console-grid"><div><small>NETWORK</small><b>{Math.min(100,45+completed*7)}%</b><i><span style={{width:`${Math.min(100,45+completed*7)}%`}}/></i></div><div><small>ROUTING</small><b>{routing}%</b><i><span style={{width:`${routing}%`}}/></i></div><div><small>SECURITY</small><b>{security}%</b><i><span style={{width:`${security}%`}}/></i></div><div><small>STABILITY</small><b>{Math.max(20,90-errors*6)}%</b><i><span style={{width:`${Math.max(20,90-errors*6)}%`}}/></i></div></div><div className="console-stats"><span>ACTIVE NODES <b>{8+completed*4}</b></span><span>PACKETS <b>{packets}</b></span><span>ANOMALIES <b>{errors}</b></span><span>HINTS <b>{hints}</b></span></div></div>
}

export function SynoraArtifactArchive({completed}:{completed:number}) {
 const artifacts=['FRAMMENTO DEL PROTOCOLLO','REGISTRO DEGLI INDIRIZZI','MAPPA DELLE ROTTE','TRACCIA DEL PACCHETTO','LOG COMPROMESSO','CHIAVE VLAN','SIGILLO STP','CHIAVE DEL TERMINALE']
 return <section className="artifact-archive"><div className="eyebrow">ARCHIVIO DI SYNORA</div><h3>Gli oggetti che avete recuperato</h3><div className="artifact-grid">{artifacts.map((x,i)=><div key={x} className={`artifact ${i<completed?'found':''}`}><span>{i<completed?'◆':'◇'}</span><b>{x}</b><small>{i<completed?'RECUPERATO':'NON DISPONIBILE'}</small></div>)}</div></section>
}

export function SynoraFinale({completed,errors,hints}:{completed:number;errors:number;hints:number}) {
 if(completed<8)return null
 const type=errors<=2?'THE ARCHITECT':errors<=6?'THE FORENSIC':'THE SURVIVOR'
 return <section className="synora-finale"><div className="finale-scan">SYNORA NETWORK // RESTORATION COMPLETE</div><div className="finale-core"><div className="finale-ring">S</div><span>ALL 08 NODES ONLINE</span><h2>SYNORA IS CONNECTED</h2><p>Il piano regolatore è tornato operativo. Le tracce raccolte durante il percorso restano nell'Archivio.</p><div className="finale-seq"><span>NODE 01 ✓</span><span>NODE 02 ✓</span><span>NODE 03 ✓</span><span>NODE 04 ✓</span><span>NODE 05 ✓</span><span>NODE 06 ✓</span><span>NODE 07 ✓</span><span>NODE 08 ✓</span></div><strong>{type}</strong><small>RESTORATION PROFILE · {errors} ANOMALIE · {hints} INDIZI</small></div></section>
}

export function Nexus({roomId}:{roomId:number}) {
 const lines=['Non cercare la risposta. Cerca la contraddizione.','Un pacchetto non racconta tutta la storia: osserva ciò che cambia tra due hop.','Una rotta corretta non basta: deve essere coerente con interfaccia e next-hop.','Quando due dati sembrano incompatibili, costruisci una terza ipotesi e verifica la topologia.','Prima di modificare la rete, dimostra quale osservazione rende necessaria la modifica.','Le VLAN separano domini di broadcast. Il routing li può mettere nuovamente in comunicazione.','La ridondanza è utile solo se sai quale cammino deve restare inattivo.','Nel terminale la sequenza dei comandi è parte della soluzione.']
 return <aside className="nexus"><div className="nexus-head"><span>NEXUS</span><small>ADVISORY CORE</small></div><p>“{lines[(roomId-1)%lines.length]}”</p><div className="nexus-foot">NESSUNA RISPOSTA · SOLO UNA TRACCIA</div></aside>
}

export function PacketBlackBox({roomId}:{roomId:number}) {
 const [running,setRunning]=useState(false);const [stage,setStage]=useState(0)
 const labels=['APPLICATION','TCP','IP','ETHERNET','NEXT HOP','DESTINATION']
 const launch=()=>{if(running)return;setRunning(true);setStage(0);let i=0;const t=setInterval(()=>{i++;setStage(i);if(i>=labels.length){clearInterval(t);setRunning(false)}},420)}
 return <section className="blackbox"><div className="blackbox-head"><div><span className="eyebrow">BLACK BOX // DISTRETTO {String(roomId).padStart(2,'0')}</span><h3>Invia un pacchetto nella città</h3></div><button onClick={launch}>{running?'TRACING…':'SEND PACKET'}</button></div><div className="packet-track"><div className="packet-line"/><div className="packet-route">{labels.map((x,i)=><div key={x} className={stage>=i?'packet-node active':''}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b></div>)}</div><div className={`moving-packet p${stage}`}/></div><div className="packet-readout"><span>TRACE ID <b>7F-{roomId}A9</b></span><span>TTL <b>{Math.max(1,8-stage)}</b></span><span>STATE <b>{stage>=labels.length-1?'DELIVERED':running?'IN TRANSIT':'READY'}</b></span></div></section>
}

export function IncidentEvent({roomId}:{roomId:number}) {
 const events=['⚠ UNKNOWN PACKET DETECTED','⚠ INTERFACE STATE CHANGED','⚠ ROUTE INCONSISTENCY','⚠ BROADCAST ANOMALY','⚠ CORE DIAGNOSTIC ALERT','⚠ VLAN TRACE INTERRUPTED','⚠ REDUNDANT PATH DETECTED','⚠ TERMINAL REQUESTED']
 const [open,setOpen]=useState(false)
 return <div className="incident-event"><button onClick={()=>setOpen(!open)}><span>{events[roomId-1]}</span><b>{open?'CLOSE':'OPEN INCIDENT'}</b></button>{open&&<div className="incident-body"><code>TRACE ID: SYN-{roomId}7F-A92</code><p>Un evento anomalo è stato rilevato nel distretto. Non è una domanda aggiuntiva: è un indizio narrativo. Analizza la missione e cerca quale dato può confermare o smentire questa traccia.</p></div>}</div>
}

export function MissionClock({roomId}:{roomId:number}) {
 const [seconds,setSeconds]=useState(20*60+roomId*17)
 useEffect(()=>{const id=setInterval(()=>setSeconds(s=>Math.max(0,s-1)),1000);return()=>clearInterval(id)},[])
 const m=Math.floor(seconds/60).toString().padStart(2,'0');const s=(seconds%60).toString().padStart(2,'0')
 return <div className={`mission-clock ${seconds<120?'critical':''}`}><small>NETWORK COLLAPSE IN</small><b>{m}:{s}</b><span>{seconds<120?'LAST PACKETS':'TRACE ACTIVE'}</span></div>
}
