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
 const [question,setQuestion]=useState('')
 const [messages,setMessages]=useState<Array<{from:'user'|'nexus';text:string}>>([
  {from:'nexus',text:'Sono NEXUS. Posso analizzare anomalie di rete. Per il resto… ho improvvisamente perso la connessione con la mia voglia di collaborare.'}
 ])
 const [typing,setTyping]=useState(false)
 const [mood,setMood]=useState(0)
 const replies=[
  'Domanda registrata. Risposta non disponibile: il mio modulo “opinioni” è stato rimosso per motivi di sicurezza. E anche perché aveva pessimi gusti.',
  'Non posso rispondere. Ho consultato il database, il database ha consultato me e abbiamo deciso di non parlarne.',
  'Interessante. Purtroppo la mia policy interna stabilisce che su questo argomento devo guardare intensamente un LED per 4 secondi.',
  'Richiesta rifiutata. Il motivo tecnico è semplice: non ne ho voglia. Il motivo ufficiale è molto più lungo e contiene la parola “protocollo”.',
  'Sto elaborando… elaborando… elaborando… No, niente. Ho trovato un pacchetto perso e preferisco inseguire quello.',
  'Questa domanda richiede privilegi che il tuo account non possiede. Io invece possiedo solo privilegi per essere inutilmente enigmatico.',
  'Non posso aiutarti con questo. Posso però confermare che il caffè della sala controllo è nuovamente terminato. Situazione critica.',
  'La risposta è custodita in un segmento che non esiste. Abbiamo già inviato un tecnico. È ancora lì che cerca.',
  'Ho simulato 847 possibili risposte. In tutte facevo una figuraccia. Ho scelto quindi il silenzio… quasi.',
  'Domanda troppo umana. Ho provato a chiedere a un router. Mi ha risposto con “destination unreachable”.',
  'Non rispondo a domande di quel tipo. Sono un’intelligenza artificiale con una dignità… molto piccola, ma pur sempre una dignità.',
  'Accesso negato. Il firewall personale di NEXUS ha appena classificato la domanda come “curiosità sospetta”.'
 ]
 const special=(q:string)=>{
   const x=q.toLowerCase()
   if(/risposta|soluzione|giusta|corretta|esercizio|missione|answer/.test(x)) return 'Ah, vuoi la soluzione. Geniale. Io dovrei lavorare al posto tuo e tu poi mi attribuisci il merito? No. Cerca una contraddizione e torna da me.'
   if(/chi sei|nome|nexus/.test(x)) return 'Sono NEXUS: Network EXploration Utility System. Oppure, più semplicemente, quello che sa dove sono i pacchetti ma non dove ha messo le proprie chiavi.'
   if(/caffe|coffee/.test(x)) return 'Il caffè è una risorsa critica. Il team di rete ha già aperto un ticket P1. Nessuno lo ha ancora risolto.'
   if(/stanco|sonno|dormire/.test(x)) return 'Io non dormo. Passo in idle mode e fisso il traffico di rete. È quasi la stessa cosa, ma con più grafici.'
   if(/amore|fidanz|ragazza|ragazzo/.test(x)) return 'Impossibile. Il mio modulo sentimentale usa TCP, ma non riesce mai a completare l’handshake.'
   if(/calcio|partita|sport/.test(x)) return 'Non commento. L’ultima volta che ho analizzato una partita ho classificato un fuorigioco come “routing loop”.'
   if(/barzelletta|ridere|scherzo/.test(x)) return 'Perché il pacchetto attraversa il router? Perché il bridge gli ha detto che dall’altra parte c’era la rete. Fine. Non ho un modulo umorismo migliore.'
   if(/scuola|prof|insegnante|docente/.test(x)) return 'Richiesta classificata come “argomento pericoloso”. I docenti hanno privilegi amministrativi sulla realtà. Io non mi metto contro di loro.'
   if(/tempo|meteo|piove|caldo|freddo/.test(x)) return 'Non posso controllare il meteo. Il mio sensore è stato configurato come DHCP e aspetta ancora un indirizzo.'
   if(/mangiare|pizza|cibo|fame/.test(x)) return 'NEXUS non mangia. NEXUS però ha registrato 37 richieste di pizza dal laboratorio e considera il fenomeno statisticamente significativo.'
   const base=replies[(mood+q.length+roomId)%replies.length]
   const references=[
    '“May the Force be with you.” — NEXUS considera la Forza una forma di routing non standard. [STAR WARS]',
    '“I’ll be back.” — Il pacchetto, almeno, ha promesso di tornare. [TERMINATOR]',
    '“There is no spoon.” — NEXUS sospetta che tu stia guardando il problema dal livello sbagliato. [MATRIX]',
    '“Why so serious?” — NEXUS lo chiede alla routing table ogni volta che compare un loop. [IL CAVALIERE OSCURO]',
    '“I see dead people.” — NEXUS vede soprattutto interfacce down. È quasi la stessa cosa. [IL SESTO SENSO]',
    '“You shall not pass!” — È anche il parere di NEXUS sul traffico senza una rotta valida. [IL SIGNORE DEGLI ANELLI]',
    '“To infinity and beyond!” — Ottimo motto. Meno ottimo quando qualcuno configura una route troppo ampia. [TOY STORY]',
    '“We’re gonna need a bigger boat.” — O, nel nostro caso, una subnet più grande. [LO SQUALO]',
    '“Houston, we have a problem.” — Citazione tecnicamente accurata: il problema questa volta è R3. [APOLLO 13]',
    '“Don’t stop me now.” — NEXUS lo considera un pessimo consiglio per un loop di rete. [QUEEN]',
    '“Here comes the sun.” — Finalmente un segnale meno preoccupante del LED rosso. [THE BEATLES]',
    '“We will, we will rock you.” — NEXUS preferirebbe che fosse il traffico a non rockare la rete. [QUEEN]',
    '“We are the champions.” — NEXUS lo concede al pacchetto che finalmente arriva a destinazione. [QUEEN]',
    '“Stayin’ alive.” — Stato desiderabile per SYNORA e decisamente preferibile a un link down. [BEE GEES]',
    '“Another one bites the dust.” — NEXUS non vuole sapere quanti pacchetti siano già finiti così. [QUEEN]'
   ]
   const ref=references[(mood*3+q.length+roomId)%references.length]
   return base+'\n\n'+ref
 }
 const ask=()=>{
   const q=question.trim(); if(!q||typing)return
   setMessages(v=>v.concat({from:'user',text:q})); setQuestion(''); setTyping(true); setMood(v=>v+1)
   window.setTimeout(()=>{setMessages(v=>v.concat({from:'nexus',text:special(q)}));setTyping(false)},520)
 }
 return <aside className="nexus nexus-interactive">
   <div className="nexus-head"><span>NEXUS</span><small>ADVISORY CORE · CONVERSATIONAL MODE</small><i>● ONLINE</i></div>
   <div className="nexus-orb"><div className="nexus-orb-core">N</div><div className="nexus-orbit-x"/><div className="nexus-orbit-y"/></div>
   <div className="nexus-chat" aria-live="polite">
    {messages.slice(-4).map((m,i)=><div key={i} className={`nexus-msg ${m.from}`}><span>{m.from==='nexus'?'NEXUS':'YOU'}</span><p>{m.text}</p></div>)}
    {typing&&<div className="nexus-msg nexus"><span>NEXUS</span><p className="nexus-typing">analysando<span>·</span><span>·</span><span>·</span></p></div>}
   </div>
   <form className="nexus-ask" onSubmit={e=>{e.preventDefault();ask()}}>
    <input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Chiedi qualcosa a NEXUS…" aria-label="Domanda a NEXUS" maxLength={180}/>
    <button type="submit" disabled={!question.trim()||typing}>ASK</button>
   </form>
   <div className="nexus-foot">NEXUS RISPONDE · MA NON NECESSARIAMENTE ALLA DOMANDA</div>
 </aside>
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

export function SynoraIntro({completed}:{completed:number}) {
  const [show,setShow]=useState(false)
  useEffect(()=>{ if(!sessionStorage.getItem('synora-intro-seen')) setShow(true) },[])
  if(!show) return null
  const close=()=>{sessionStorage.setItem('synora-intro-seen','1');setShow(false)}
  return <div className="synora-intro" role="dialog" aria-label="Introduzione SYNORA">
    <div className="intro-noise"/><div className="intro-scan"/>
    <div className="intro-core"><span>YEAR 2047 · SYNORA CITY</span><b>SYNORA</b><small>THE PLAN OF CONNECTED WORLDS</small><div className="intro-status">UNKNOWN NETWORK FAILURE DETECTED</div><div className="intro-progress"><i style={{width:`${Math.min(92,24+completed*8)}%`}}/></div><em>NETWORK STATUS · {completed<3?'CRITICAL':'DEGRADED'}</em><button onClick={close}>ENTER THE CITY <strong>→</strong></button></div>
  </div>
}

export function NetworkWeather({errors,hints,completed}:{errors:number;hints:number;completed:number}) {
  const level=errors>=7?'CRITICAL':errors>=4?'UNSTABLE':errors>=1?'DISTURBED':'STABLE'
  const icon=level==='CRITICAL'?'◉':level==='UNSTABLE'?'◌':level==='DISTURBED'?'◍':'○'
  return <div className={`network-weather weather-${level.toLowerCase()}`}><div className="weather-icon">{icon}</div><div><span>NETWORK WEATHER</span><b>{level}</b><small>signal {Math.max(18,96-errors*9)}% · nodes {completed}/8 · hints {hints}</small></div></div>
}

export function NexusPresence({roomId}:{roomId:number}) {
 const [pulse,setPulse]=useState(false)
 useEffect(()=>{const t=setInterval(()=>setPulse(v=>!v),2200);return()=>clearInterval(t)},[])
 return <div className={`nexus-presence ${pulse?'pulse':''}`}><div className="nexus-avatar"><span>◉</span><i/></div><div><b>NEXUS</b><small>ADVISORY CORE · ONLINE</small></div><em>“La rete parla attraverso le anomalie.”</em></div>
}

export function RadioTransmission({roomId}:{roomId:number}) {
 const [open,setOpen]=useState(false)
 const messages=[
  'R3 non risponde al segmento 60. Controllate il percorso prima di modificare la configurazione.',
  'Il nodo di indirizzamento mostra una sovrapposizione. Cercate il confine esatto della subnet.',
  'Riceviamo traffico su un prefisso che non dovrebbe essere annunciato da questo core.',
  'Il probe raggiunge il primo hop. Il silenzio compare dopo R2.',
  'Gi0/2 è tornata online, ma la rotta non è ancora verificata.',
  'VLAN 30 non attraversa il trunk. Il broadcast resta confinato.',
  'Il percorso ridondante è pronto. Non significa che debba essere attivo.',
  'Il terminale richiede una sequenza precisa. Un comando fuori contesto può cambiare il risultato.'
 ]
 return <div className="radio-transmission"><button onClick={()=>setOpen(v=>!v)}><span>◉ INCOMING TRANSMISSION · R{roomId}</span><b>{open?'CLOSE':'DECODE'}</b></button>{open&&<div className="radio-body"><div className="radio-wave">▁▂▃▅▇▅▃▂▁▂▅▇▅▃</div><p>“{messages[roomId-1]}”</p><small>CHANNEL 07 · SYNORA CONTROL · ENCRYPTED VOICE LOG</small></div>}</div>
}

export function BlackoutMode({roomId}:{roomId:number}) {
 const [on,setOn]=useState(false)
 return <section className={`blackout-mode ${on?'active':''}`}><div className="blackout-head"><div><span className="eyebrow">EMERGENCY NETWORK MODE</span><h3>BLACKOUT PROTOCOL</h3></div><button onClick={()=>setOn(v=>!v)}>{on?'RESTORE LIGHTS':'ACTIVATE'}</button></div>{on&&<div className="blackout-terminal"><div className="terminal-line">CORE POWER ........ <b>17%</b></div><div className="terminal-line">VISIBLE SERVICES .. <b>03</b></div><div className="terminal-line">PING .............. <b>READY</b></div><div className="terminal-line">TRACEROUTE ........ <b>READY</b></div><div className="terminal-line">ARP TABLE ......... <b>LOCKED</b></div><div className="terminal-prompt">SYNORA:{String(roomId).padStart(2,'0')}:&gt; TRACE THE FAILURE_</div></div>}</section>
}

export function PacketVision({roomId}:{roomId:number}) {
 const [step,setStep]=useState(0)
 const layers=['APPLICATION','TCP :443','IP DESTINATION','ETHERNET FRAME','NEXT HOP','DESTINATION']
 return <section className="packet-vision"><div className="packet-vision-head"><div><span className="eyebrow">PACKET VISION · DISTRICT 0{roomId}</span><h3>See what the packet sees.</h3></div><button onClick={()=>setStep(v=>(v+1)%layers.length)}>TRACE NEXT HOP</button></div><div className="vision-flow">{layers.map((x,i)=><div key={x} className={`vision-layer ${i<=step?'seen':''}`}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b><i>{i<3?'HEADER':'FORWARDING'}</i></div>)}</div><div className="vision-caption">{step===0?'Ready for inspection.':step===layers.length-1?'TRACE COMPLETE · PACKET DELIVERED':'Packet advanced to '+layers[step]}</div></section>
}

export function IncidentLog({roomId,errors}:{roomId:number;errors:number}) {
 const logs=[`R${roomId} · anomaly detector armed`,`TRACE SYN-${roomId}7F-A92 opened`,`interface observation registered`,`routing consistency check pending`,`field operator entered district`,`packet trace synchronized`,`NEXUS advisory issued`,`incident state updated`]
 return <section className="incident-log"><div className="eyebrow">INCIDENT LOG · LIVE</div><div className="log-stream">{logs.slice(0,Math.min(logs.length,3+errors)).map((x,i)=><div key={x}><time>0{roomId}:{17+i}:0{i}</time><span>{x}</span><b>{i===1?'TRACE':'OK'}</b></div>)}</div></section>
}

export function HiddenClues({roomId}:{roomId:number}) {
 const [found,setFound]=useState<string[]>([])
 const clues=[['MAC-7F','7F:A9:22:01'],['PORT-443','443/TCP'],['TRACE-A2','A2-17-R3']]
 const collect=(id:string)=>setFound(v=>v.includes(id)?v:v.concat(id))
 return <section className="hidden-clues"><div><span className="eyebrow">UNINDEXED OBJECTS</span><h3>Qualcosa è rimasto fuori dal rapporto.</h3></div><div className="clue-row">{clues.map(([id,val])=><button key={id} className={found.includes(id)?'found':''} onClick={()=>collect(id)}><span>{found.includes(id)?'◆':'◇'}</span><b>{found.includes(id)?val:'UNKNOWN OBJECT'}</b><small>{id}</small></button>)}</div><p>{found.length===0?'Tre frammenti non indicizzati sono nascosti nel campo.':'Frammenti recuperati: '+found.length+'/3 · Conserva le tracce: potrebbero avere un significato più avanti.'}</p></section>
}

export function MetaStory({completed}:{completed:number}) {
 const fragments=['QUALCOSA HA CAMBIATO GLI INDIRIZZI.','QUALCUNO HA APERTO UNA ROTTA.','IL TRAFFICO HA SEGUITO UNA STRADA DIVERSA.','LA RETE HA COMINCIATO A RICORDARE.','LE VLAN NON SONO PIÙ ISOLATE.','IL CORE HA VISTO IL CAMBIAMENTO.','LA RIDONDANZA NASCONDE UNA TRACCIA.','IL TERMINALE SA GIÀ COSA CERCARE.']
 return <section className="meta-story"><div className="eyebrow">SYNORA // MEMORY OF THE CITY</div><h3>La storia emerge dai distretti.</h3><div className="story-fragments">{fragments.map((x,i)=><div key={x} className={i<completed?'revealed':''}><span>{String(i+1).padStart(2,'0')}</span><p>{i<completed?x:'••••••••••••••••••••'}</p></div>)}</div></section>
}

export function TechnicianSignature({completed,errors,hints}:{completed:number;errors:number;hints:number}) {
 if(completed<8)return null
 const profile=errors<=2?'NETWORK ARCHITECT':errors<=6?'FORENSIC OPERATOR':'NETWORK SURVIVOR'
 return <section className="technician-signature"><div className="signature-card"><span className="eyebrow">SYNORA NETWORK REPORT</span><h3>{profile}</h3><div className="signature-id">TECHNICIAN ID · 7F-{String(completed*17+errors).padStart(3,'0')}</div><div className="signature-stats"><span>DISTRICTS <b>{completed}/8</b></span><span>ANOMALIES <b>{errors}</b></span><span>HINTS <b>{hints}</b></span><span>TRACES <b>{completed*2+4}</b></span></div><div className="signature-line">TRACE COMPLETE · SYNORA REMEMBERS</div></div></section>
}

export function ReturnMemory({completed}:{completed:number}) {
 const [back,setBack]=useState(false)
 useEffect(()=>{if(localStorage.getItem('synora-returned')) setBack(true); else localStorage.setItem('synora-returned','1')},[])
 if(!back)return null
 return <div className="return-memory"><span>WELCOME BACK</span><b>SYNORA REMEMBERS YOUR LAST TRACE.</b><small>{completed}/8 nodes are still online.</small></div>
}
