'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdvancedMissions from './advanced-missions'

type Answers = Record<string,string>

const keys: Record<number,string> = {1:'ENCAPSULATION',2:'VLSM',3:'CIDR',4:'NEXT-HOP',5:'DIAGNOSI',6:'VLAN',7:'REDUNDANZA',8:'SYNORA'}

function Panel({title,children}:{title:string;children:React.ReactNode}){return <section className="challenge-panel"><div className="panel-head"><span>{title}</span><i/></div>{children}</section>}
function Choice({active,children,onClick}:{active:boolean;children:React.ReactNode;onClick:()=>void}){return <button type="button" className={`choice-card ${active?'selected':''}`} onClick={onClick}>{children}</button>}
function Input({value,onChange,placeholder}:{value:string;onChange:(v:string)=>void;placeholder?:string}){return <input className="answer-input" value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>}
function Select({value,onChange,options,placeholder='Seleziona…'}:{value:string;onChange:(v:string)=>void;options:{value:string;label:string}[];placeholder?:string}){return <select className="answer-input" value={value||''} onChange={e=>onChange(e.target.value)}><option value="">{placeholder}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>} 

const room4Nodes = ['R1 · GATEWAY','R2 · CORE','R3 · EDGE','R4 · DESTINATION']
const room6Ports = [1,2,3,4,5,6,7,8,24]
const room6Devices = [
  {id:'STAFF-PC', label:'PC STAFF', meta:'VLAN 10', port:'1'},
  {id:'LAB-PC', label:'PC LAB', meta:'VLAN 20', port:'3'},
  {id:'GUEST-PC', label:'PC GUEST', meta:'VLAN 30', port:'6'},
  {id:'ROUTER', label:'ROUTER', meta:'TRUNK 802.1Q', port:'24'},
]
const cliScript = ['enable','configure terminal','interface g0/2','no shutdown','end','show ip interface brief','show ip route']

export default function RoomChallenge({roomId}:{roomId:number}){
 const router=useRouter()
 const [a,setA]=useState<Answers>({})
 const [msg,setMsg]=useState('')
 const [busy,setBusy]=useState(false)
 const [step,setStep]=useState(1)
 const [successKey,setSuccessKey]=useState('')
 const [expired,setExpired]=useState(false)
 const [seconds,setSeconds]=useState(20*60+roomId*17)
 useEffect(()=>{ const id=window.setInterval(()=>setSeconds(v=>{ if(v<=1){window.clearInterval(id);setExpired(true);return 0} return v-1}),1000); return()=>window.clearInterval(id)},[])
 const mm=Math.floor(seconds/60).toString().padStart(2,'0'); const ss=(seconds%60).toString().padStart(2,'0')
 const set=(k:string,v:string)=>{setA(x=>({...x,[k]:v}));setMsg('')}
 const submit=async()=>{if(expired||busy)return;setBusy(true);setMsg('VERIFICA DELLA TRACCIA SUL CORE…');const res=await fetch('/api/attempt',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({roomId,answers:a})});const data=await res.json();setBusy(false);if(data.success){setSuccessKey(keys[roomId]);setStep(3);setMsg('')}else setMsg(data.message||'TRACCIA INCOERENTE')}

 const [routeOrder,setRouteOrder]=useState([0,1,2,3])
 const move=(from:number,to:number)=>{const x=[...routeOrder];const [v]=x.splice(from,1);x.splice(to,0,v);setRouteOrder(x);set('path',x.join('>'))}

 const [packetPos,setPacketPos]=useState(0)
 const [packetRunning,setPacketRunning]=useState(false)
 const movePacket=(target:number)=>{
   if(packetRunning || target!==packetPos+1) return
   setPacketRunning(true)
   window.setTimeout(()=>{setPacketPos(target);setPacketRunning(false);if(target===3)set('path','0>1>2>3')},520)
 }
 const packetComplete=packetPos===3

 const [cliLines,setCliLines]=useState<{prompt:string;cmd?:string;out?:string}[]>([])
 const [cliInput,setCliInput]=useState('')
 const cliIndex=cliLines.filter(x=>x.cmd).length
 const cliMode=cliIndex<1?'user':cliIndex<2?'priv':cliIndex<4?'config-if':'priv'
 const cliPrompt=cliMode==='user'?'R5>':cliMode==='priv'?'R5#':'R5(config-if)#'
 const runCli=()=>{
   const cmd=cliInput.trim().replace(/\s+/g,' ')
   if(!cmd) return
   const expected=cliScript[cliIndex]
   let out=''
   if(cmd!==expected){out='% Invalid input or command sequence. Il terminale attende il comando successivo della procedura.'}
   else if(cmd==='no shutdown') out='Interface GigabitEthernet0/2, changed state to up\nLine protocol on Interface GigabitEthernet0/2, changed state to up'
   else if(cmd==='show ip interface brief') out='Gi0/0  192.168.5.1  up  up\nGi0/1  10.0.5.1  up  up\nGi0/2  10.0.6.1  up  up'
   else if(cmd==='show ip route') out='S 192.168.50.0/24 [1/0] via 10.0.5.2\nS 192.168.60.0/24 [1/0] via 10.0.6.2'
   setCliLines(x=>[...x,{prompt:cliPrompt,cmd,out}])
   if(cmd===expected) set('cli',cliScript.slice(0,cliIndex+1).join('|'))
   setCliInput('')
 }
 const resetCli=()=>{setCliLines([]);setCliInput('');set('cli','')}

 const [cables,setCables]=useState<Record<string,string>>({})
 const [selectedDevice,setSelectedDevice]=useState('')
 const connectDevice=(device:string,port:string)=>{
   const occupied=Object.entries(cables).find(([d,p])=>d!==device && p===port)
   if(occupied) return
   setCables(x=>({...x,[device]:port}))
   setSelectedDevice('')
   set(`${device.toLowerCase()}Port`,port)
 }
 const resetCables=()=>{setCables({});setSelectedDevice('');['staff-pcPort','lab-pcPort','guest-pcPort','routerPort'].forEach(k=>set(k,''))}

 const [stpRunning,setStpRunning]=useState(false)
 const [stpStable,setStpStable]=useState(false)
 const stabilize=()=>{
   if(a.root==='SW1' && a.rp==='SW2-SW1' && a.rp3==='SW3-SW1' && a.block==='SW2-SW3') setStpStable(true)
 }

 return <div className={`challenge-wrap ${expired?'mission-expired':''}`}>
   <div className={`mission-clock mission-clock-live ${seconds<120?'critical':''} ${expired?'expired':''}`}><small>NETWORK COLLAPSE IN</small><b>{mm}:{ss}</b><span>{expired?'BLACKOUT':'TRACE ACTIVE'}</span></div>
   {expired&&<div className="blackout-overlay"><div><span className="eyebrow">SYNORA // EMERGENCY PROTOCOL</span><h2>BLACKOUT</h2><p>Il tempo della missione è scaduto. La traccia non è stata validata.</p><button className="cta" onClick={()=>window.location.reload()}>RIPROVA MISSIONE</button><a className="ghost-btn" href="/synora">TORNA ALLA MAPPA</a></div></div>}
   <div className="challenge-progress"><span className="active">01 TRACCIA</span><span>02 VERIFICA</span><span>03 CHIAVE</span><div><b>{keys[roomId]}</b> · 10 missioni nel distretto · protocollo locale</div></div>

   {roomId===1 && <>
    <Panel title="TRACE / FRAME 0017"><p className="instruction">Per ciascun frammento, indicate il livello TCP/IP di appartenenza. Indicate inoltre i 4 livelli nell’ordine in cui vengono attraversati durante la decapsulazione, dal frame ricevuto fino ai dati dell’applicazione.</p><div className="packet-grid">{[['A','PORTA DESTINAZIONE','443'],['B','MAC SORGENTE','AA:7B:19:CC:04:91'],['C','IP DESTINAZIONE','172.16.40.20'],['D','PROTOCOLLO','HTTPS']].map(([id,k,v])=><div className="packet-chip" key={id}><b>{id}</b><span>{k}</span><code>{v}</code><Select value={a[id]||''} onChange={v=>set(id,v)} options={[{value:'Applicazione',label:'Applicazione'},{value:'Trasporto',label:'Trasporto'},{value:'Rete',label:'Rete'},{value:'Collegamento dati',label:'Collegamento dati'}]}/></div>)}</div><div className="mini-question"><span>Rimozione degli header, dal frame ricevuto fino all'applicazione</span><Select value={a.order||''} onChange={v=>set('order',v)} options={[{value:'Collegamento → Rete → Trasporto → Applicazione',label:'Collegamento → Rete → Trasporto → Applicazione'},{value:'Applicazione → Trasporto → Rete → Collegamento',label:'Applicazione → Trasporto → Rete → Collegamento'},{value:'Rete → Collegamento → Trasporto → Applicazione',label:'Rete → Collegamento → Trasporto → Applicazione'}]}/></div></Panel>
    <Panel title="PDU / CONTROLLO DI COERENZA"><p className="instruction">Per completare la verifica, indicate quale PDU corrisponde al livello Trasporto e quale PDU corrisponde al livello Rete. Inserite i due nomi separatamente nei campi dedicati.</p><div className="answer-pair three"><label>Trasporto</label><Select value={a.pduT||''} onChange={v=>set('pduT',v)} options={[{value:'Segmento',label:'Segmento'},{value:'Pacchetto',label:'Pacchetto'},{value:'Frame',label:'Frame'},{value:'Messaggio',label:'Messaggio'}]}/><label>Rete</label><Select value={a.pduR||''} onChange={v=>set('pduR',v)} options={[{value:'Pacchetto',label:'Pacchetto'},{value:'Segmento',label:'Segmento'},{value:'Frame',label:'Frame'},{value:'Messaggio',label:'Messaggio'}]}/></div></Panel>
   </>}

   {roomId===2 && <>
    <Panel title="ADDRESSING / VLSM"><p className="instruction">Assegnate 192.168.40.0/24 a SEGRETERIA, LAB, SERVER e GUEST. Per ciascun segmento indicate il prefisso, l’indirizzo di rete e il primo indirizzo utilizzabile. Le subnet devono essere consecutive e non sovrapposte.</p><div className="vlsm-grid">{[['SEGRETERIA','60'],['LAB','120'],['SERVER','28'],['GUEST','14']].map(([name,n],i)=><div className="vlsm-row" key={name}><b>{name}</b><span>{n} host</span><Input value={a[`p${i}`]||''} onChange={v=>set(`p${i}`,v)} placeholder="/prefisso"/><Input value={a[`r${i}`]||''} onChange={v=>set(`r${i}`,v)} placeholder="rete"/></div>)}</div><div className="mini-question"><span>Primo indirizzo utilizzabile del segmento più grande</span><Input value={a.first||''} onChange={v=>set('first',v)} placeholder="x.x.x.x"/></div></Panel>
    <Panel title="VLSM / VERIFICA DI CONFINE"><p className="instruction">Per LAB indicate anche l’indirizzo di broadcast e l’ultimo indirizzo utilizzabile.</p><div className="answer-pair"><label>Broadcast LAB</label><Input value={a.bc||''} onChange={v=>set('bc',v)} placeholder="x.x.x.x"/><label>Ultimo host LAB</label><Input value={a.last||''} onChange={v=>set('last',v)} placeholder="x.x.x.x"/></div></Panel>
   </>}

   {roomId===3 && <>
    <Panel title="AGGREGATION / CIDR"><p className="instruction">Rappresentate le quattro reti mostrate con una sola rotta. Indicate il prefisso della supernet e la relativa maschera decimale. Indicate inoltre la prima rete /24 immediatamente successiva al blocco.</p><div className="route-list">{['172.16.32.0/24','172.16.33.0/24','172.16.34.0/24','172.16.35.0/24'].map(x=><code key={x}>{x}</code>)}</div><div className="answer-pair"><label>Supernet</label><Input value={a.cidr||''} onChange={v=>set('cidr',v)} placeholder="es. 172.16.32.0/22"/><label>Maschera decimale</label><Input value={a.mask||''} onChange={v=>set('mask',v)} placeholder="255.255.x.0"/></div><div className="mini-question"><span>Numero di reti /24 contenute</span><Select value={a.count||''} onChange={v=>set('count',v)} options={[{value:'2',label:'2'},{value:'4',label:'4'},{value:'8',label:'8'},{value:'16',label:'16'}]}/></div></Panel>
    <Panel title="BORDER TEST"><p className="instruction">Indicate la prima rete /24 che viene subito dopo il blocco aggregato 172.16.32.0/22. Inserite l’indirizzo completo con il prefisso /24.</p><Input value={a.outside||''} onChange={v=>set('outside',v)} placeholder="es. 172.16.36.0/24"/></Panel>
   </>}

   {roomId===4 && <>
    <Panel title="FORENSIC ROUTE / TRACE 07"><p className="instruction">Il pacchetto deve raggiungere <b>10.20.30.77</b>. Non potete saltare i router: trascinate il pacchetto da un nodo al successivo. Il Core registra ogni passaggio. Se provate a saltare un hop, il pacchetto viene respinto.</p>
      <div className={`packet-map ${packetRunning?'packet-map-running':''}`}>
        <div className="map-wire w12"/><div className="map-wire w23"/><div className="map-wire w34"/>
        {room4Nodes.map((n,i)=><button key={n} type="button" className={`map-router r${i} ${packetPos===i?'reached':''} ${i===packetPos+1?'next':''}`} onClick={()=>movePacket(i)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();movePacket(i)}} aria-label={`Porta il pacchetto a ${n}`}><span className="router-glyph">{i===3?'◆':'◇'}</span><b>{n}</b><small>{i===0?'192.168.1.1':i===1?'10.0.0.2':i===2?'10.0.1.2':'10.20.30.77'}</small></button>)}
        <div className={`packet ${packetRunning?'moving':''}`} draggable onDragStart={e=>e.dataTransfer.setData('text/plain',String(packetPos))} style={{left:`${8 + packetPos*28}%`}}><span>PKT</span></div>
      </div>
      <div className="packet-status"><b>{packetComplete?'PERCORSO COMPLETO':'TRASFERIMENTO IN CORSO'}</b><span>{packetComplete?'R1 → R2 → R3 → R4':'Trascina il pacchetto sul prossimo router illuminato · alternativa: clicca il router'}</span><i>{packetPos+1}/4</i></div>
    </Panel>
    <Panel title="ROUTING TABLE / DECISIONE"><p className="instruction">Per la destinazione <b>10.20.30.77</b>, indicate il next-hop e il tipo di rotta da utilizzare.</p><div className="route-evidence"><div className="evidence-table"><div className="table-head"><span>DESTINAZIONE</span><span>PREFISSO</span><span>NEXT-HOP</span><span>METRICA</span></div>{[['10.20.0.0','/16','10.0.0.2','10'],['10.20.30.0','/24','10.0.1.2','20'],['10.30.0.0','/16','10.0.2.2','5'],['0.0.0.0','/0','10.0.0.2','1']].map(r=><div className="table-row" key={r.join('-')}>{r.map(c=><code key={c}>{c}</code>)}</div>)}</div><div className="trace-log"><div>01 <b>192.168.1.1</b><small>R1 / LOCAL</small></div><div>02 <b>10.0.0.2</b><small>R2 / CORE</small></div><div>03 <b>10.0.1.2</b><small>R3 / EDGE</small></div><div className="lost">04 <b>* * *</b><small>NO REPLY</small></div></div></div>
      <div className="mini-question"><span>Next-hop</span><Input value={a.next||''} onChange={v=>set('next',v)} placeholder="x.x.x.x"/><span>Tipo rotta</span><Choice active={a.kind==='specifica'} onClick={()=>set('kind','specifica')}>specifica /24</Choice></div>
    </Panel>
    <Panel title="DIAGNOSTICA ICMP"><p className="instruction">La traccia mostra che il quarto hop non risponde. Indicate il significato degli asterischi e il TTL del pacchetto al terzo router, considerando TTL iniziale pari a 4.</p><div className="answer-pair"><label>Evento osservato</label><Select value={a.event||''} onChange={v=>set('event',v)} options={[{value:'Il router successivo non risponde entro il timeout',label:'Il router successivo non risponde entro il timeout'},{value:'Il pacchetto è arrivato a destinazione',label:'Il pacchetto è arrivato a destinazione'},{value:'Il router ha rifiutato definitivamente il pacchetto',label:'Il router ha rifiutato definitivamente il pacchetto'}]}/><label>TTL al terzo hop</label><Select value={a.ttl||''} onChange={v=>set('ttl',v)} options={[{value:'1',label:'1'},{value:'2',label:'2'},{value:'3',label:'3'},{value:'4',label:'4'}]}/></div></Panel>
   </>}

   {roomId===5 && <>
    <Panel title="ROUTER BLACK BOX / INCIDENTE 05"><p className="instruction">R5 dichiara che tutto è operativo. Ma la rete verso <b>192.168.60.0/24</b> non è raggiungibile. Prima individuate nel testo dell’output le due evidenze che spiegano perché 192.168.60.0/24 non è raggiungibile. Poi utilizzate il terminale per riattivare Gi0/2 e completare la verifica.</p><pre className="terminal">{`R5# show ip interface brief\nGi0/0   192.168.5.1    up                    up\nGi0/1   10.0.5.1       up                    up\nGi0/2   10.0.6.1       administratively down down\n\nR5# show ip route\nC 10.0.5.0/30 is directly connected, Gi0/1\nS 192.168.50.0/24 [1/0] via 10.0.5.2\nS 192.168.60.0/24 [1/0] via 10.0.6.2\n\nR5# show running-config | section ip route\nip route 192.168.50.0 255.255.255.0 10.0.5.2\nip route 192.168.60.0 255.255.255.0 10.0.6.2`}</pre></Panel>
    <Panel title="1 / ISOLA L'ANOMALIA"><p className="instruction">Selezionate esattamente queste due evidenze: (1) l’interfaccia che risulta administratively down; (2) la route verso 192.168.60.0/24 che usa il next-hop 10.0.6.2. La loro relazione deve spiegare il guasto.</p><div className="choice-grid">{['Gi0/2 amministratively down','Rotta 192.168.50.0 via 10.0.5.2','Rotta 192.168.60.0 via 10.0.6.2','Gi0/0 192.168.5.1 up/up'].map((x,i)=><Choice key={x} active={a[`anom${i}`]==='1'} onClick={()=>set(`anom${i}`,a[`anom${i}`]==='1'?'':'1')}>{x}</Choice>)}</div></Panel>
    <Panel title="2 / TERMINALE CISCO — DIGITA DAVVERO"><p className="instruction">Nel terminale partite da R5 &gt;. Eseguite nell’ordine: accesso alla modalità privilegiata, accesso alla configurazione dell’interfaccia Gi0/2, comando per riattivarla e comando di verifica. Digitate realmente i comandi IOS nella sequenza richiesta.</p><div className="cisco-terminal">
      <div className="terminal-screen">{cliLines.length===0&&<div className="terminal-dim">R5 router console · sessione aperta · attendi il primo comando</div>}{cliLines.map((l,i)=><div key={i}><div><span>{l.prompt}</span> {l.cmd}</div>{l.out&&<pre>{l.out}</pre>}</div>)}</div>
      <form className="terminal-command" onSubmit={e=>{e.preventDefault();runCli()}}><span>{cliPrompt}</span><input value={cliInput} onChange={e=>setCliInput(e.target.value)} autoComplete="off" spellCheck={false} placeholder="digita comando IOS…"/><button type="submit">INVIO</button></form>
      <div className="terminal-tools"><span>PROCEDURA {Math.min(cliIndex,cliScript.length)}/{cliScript.length}</span><button type="button" onClick={resetCli}>RESET TERMINALE</button></div>
    </div></Panel>
    <Panel title="3 / VERIFICA POST-REPAIR"><p className="instruction">Dopo la modifica sul terminale, indicate lo stato della route verso 192.168.60.0/24 e motivate la risposta con i dati disponibili.</p><div className="answer-pair"><label>Route ripristinata</label><Input value={a.route||''} onChange={v=>set('route',v)} placeholder="rete /24"/><label>Perché?</label><Choice active={a.reason==='next-hop-raggiungibile'} onClick={()=>set('reason','next-hop-raggiungibile')}>il next-hop torna raggiungibile attraverso Gi0/2</Choice><label>Stato Gi0/2 dopo la riparazione</label><Select value={a.state||''} onChange={v=>set('state',v)} options={[{value:'up / up',label:'up / up'},{value:'down / down',label:'down / down'},{value:'administratively down / down',label:'administratively down / down'},{value:'up / down',label:'up / down'}]}/></div></Panel>
   </>}

   {roomId===6 && <>
    <Panel title="SWITCH ROOM / CABLING"><p className="instruction">Collegate tutti e quattro gli apparati alle porte corrette dello switch. Per ogni collegamento dovete associare un apparato a una porta Gi. Potete trascinare l’apparato sulla porta oppure selezionare prima l’apparato e poi la porta.</p>
      <div className="switch-lab"><div className="device-rack">{room6Devices.map(d=><button key={d.id} type="button" draggable onDragStart={e=>e.dataTransfer.setData('text/plain',d.id)} className={`device-node ${selectedDevice===d.id?'selected':''} ${cables[d.id]?'connected':''}`} onClick={()=>setSelectedDevice(selectedDevice===d.id?'':d.id)}><strong>{d.label}</strong><small>{d.meta}</small><em>{cables[d.id]?`Gi${cables[d.id]}`:'DISCONNESSO'}</em></button>)}</div>
      <div className="switch-face"><div className="switch-title">SYNORA-SW1 · 24 PORT</div><div className="port-grid">{room6Ports.map(p=>{const device=Object.entries(cables).find(([,port])=>port===String(p))?.[0];return <button key={p} type="button" className={`switch-port ${p===24?'trunk-port':''} ${device?'occupied':''}`} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const d=e.dataTransfer.getData('text/plain');if(d)connectDevice(d,String(p))}} onClick={()=>selectedDevice&&connectDevice(selectedDevice,String(p))}><span>Gi{p}</span><b>{device||'EMPTY'}</b><small>{p===24?'TRUNK':p<=2?'STAFF':p<=5?'LAB':'GUEST'}</small></button>})}</div></div></div>
      <div className="cable-status"><span>{Object.keys(cables).length}/4 CAVI COLLEGATI</span><button type="button" onClick={resetCables}>SCOLLEGA TUTTO</button></div>
    </Panel>
    <Panel title="PORT MAP / VLAN"><p className="instruction">Dopo aver completato il cablaggio, assegnate ogni porta dati alla VLAN indicata dalla rete dell’apparato. Non assegnate la porta 24 a una VLAN access: la porta 24 deve essere configurata come trunk verso il router.</p><div className="port-config-grid">{[1,2,3,4,5,6,7,8,24].map(p=><div className="port-config" key={p}><b>Gi{p}</b><Select value={a[`v${p}`]||''} onChange={v=>set(`v${p}`,v)} options={[{value:'10 STAFF',label:'VLAN 10 · STAFF'},{value:'20 LAB',label:'VLAN 20 · LAB'},{value:'30 GUEST',label:'VLAN 30 · GUEST'},{value:'TRUNK',label:'TRUNK'}]} placeholder="Configurazione"/></div>)}</div></Panel>
    <Panel title="INTER-VLAN FORENSICS"><p className="instruction">Per consentire a un PC della VLAN 30 di raggiungere un server della VLAN 10, indicate tre elementi: il gateway che deve usare il PC, il tipo di collegamento switch-router necessario e se il broadcast della VLAN 30 attraversa o meno il router verso la VLAN 10.</p><div className="answer-pair"><label>Gateway VLAN 30</label><Input value={a.gw||''} onChange={v=>set('gw',v)} placeholder="es. 192.168.30.1"/><label>Link switch-router</label><Choice active={a.link==='trunk'} onClick={()=>set('link','trunk')}>TRUNK 802.1Q</Choice><label>Broadcast tra VLAN</label><Choice active={a.broadcast==='separati'} onClick={()=>set('broadcast','separati')}>domini separati</Choice></div></Panel>
   </>}

   {roomId===7 && <>
    <Panel title="STP LIVE / LOOP DETECTED"><p className="instruction">Avviate la simulazione del triangolo. Poi determinate quale switch è root, quali sono i root port e quale collegamento deve risultare alternate/blocking. Infine applicate STP e verificate che il loop venga eliminato.</p><div className={`stp-board ${stpRunning?'live':''} ${stpStable?'stable':''}`}>
      <div className="stp-link l12"><span>10</span></div><div className="stp-link l13"><span>10</span></div><div className="stp-link l23"><span>100</span></div>
      <div className="stp-switch stp1">SW1<small>BID 01 · ROOT CANDIDATE</small></div><div className="stp-switch stp2">SW2<small>BID 02</small></div><div className="stp-switch stp3">SW3<small>BID 03</small></div>
      {stpRunning&&<><i className="frame-dot fd1"/><i className="frame-dot fd2"/><i className="frame-dot fd3"/></>}
      <div className="stp-state">{stpStable?'TOPOLOGIA STABILE · LOOP ELIMINATO':stpRunning?'LOOP ATTIVO · FRAME IN CIRCOLO':'RETE FERMA · PRONTA AL TEST'}</div>
    </div><div className="stp-controls"><button type="button" className="cta cta-small" onClick={()=>{setStpRunning(true);setStpStable(false)}}>AVVIA TRAFFICO</button><button type="button" className="ghost-btn" onClick={()=>{setStpRunning(false);setStpStable(false)}}>RESET</button></div></Panel>
    <Panel title="STP / DECISION ENGINE"><p className="instruction">Usate i BID indicati e i costi dei collegamenti mostrati nella topologia. Determinate prima il root bridge, poi il root port di ciascuno switch non-root e infine quale porta deve risultare alternate/blocking.</p><div className="stp-answers"><div><label>ROOT BRIDGE</label><Choice active={a.root==='SW1'} onClick={()=>set('root','SW1')}>SW1 · BID 01</Choice></div><div><label>ROOT PORT SW2</label><Choice active={a.rp==='SW2-SW1'} onClick={()=>set('rp','SW2-SW1')}>SW2 → SW1</Choice></div><div><label>ROOT PORT SW3</label><Choice active={a.rp3==='SW3-SW1'} onClick={()=>set('rp3','SW3-SW1')}>SW3 → SW1</Choice></div><div><label>ALTERNATE / BLOCKING</label><Choice active={a.block==='SW2-SW3'} onClick={()=>set('block','SW2-SW3')}>SW2 — SW3</Choice></div></div><button type="button" className={`stabilize-btn ${stpStable?'done':''}`} onClick={stabilize}>{stpStable?'✓ STP STABILIZZATO':'APPLICA STP E STABILIZZA LA RETE'}</button></Panel>
    <Panel title="FAILURE TEST"><p className="instruction">Simulate la caduta del collegamento SW2—SW1. Indicate quale porta/link di SW2 deve passare da blocking/alternate a forwarding per ristabilire il percorso verso la root e spiegate perché il nuovo percorso non crea un loop.</p><div className="choice-grid"><Choice active={a.fail==='SW2-SW3'} onClick={()=>set('fail','SW2-SW3')}>SW2 → SW3 · entra in servizio</Choice><Choice active={a.fail==='SW1-SW3'} onClick={()=>set('fail','SW1-SW3')}>SW1 → SW3 · resta root link</Choice></div></Panel>
   </>}

   {roomId===8 && <>
    <Panel title="TERMINAL / CISCO CLI"><p className="instruction">Riordinate i comandi forniti seguendo la corretta sequenza IOS, dal prompt iniziale fino alla verifica finale. Poi completate i due comandi mancanti richiesti dalla configurazione.</p><div className="cli-builder">{['enable','configure terminal','interface g0/0','ip address 192.168.10.1 255.255.255.0','no shutdown','ip route 192.168.20.0 255.255.255.0 10.0.0.2'].map((x,i)=><div className="cli-row" key={x}><span>{i+1}</span><code>{x}</code><Input value={a[`c${i}`]||''} onChange={v=>set(`c${i}`,v)} placeholder="posizione"/></div>)}</div><div className="answer-pair"><label>Comando operativo</label><Choice active={a.up==='no shutdown'} onClick={()=>set('up','no shutdown')}>no shutdown</Choice><label>Test finale</label><Choice active={a.test==='ping 192.168.20.1'} onClick={()=>set('test','ping 192.168.20.1')}>ping 192.168.20.1</Choice></div></Panel>
    <Panel title="ULTIMO CONTROLLO"><p className="instruction">Indicate il comando/tabella che usereste per verificare che la rotta statica sia effettivamente presente nella routing table, non soltanto scritta nella configurazione.</p><Choice active={a.table==='routing'} onClick={()=>set('table','routing')}>tabella di routing</Choice></Panel>
   </>}

   <AdvancedMissions roomId={roomId} a={a} set={set}/>

   {step===3 && <Panel title="CORE / CHIAVE RECUPERATA"><div className="success-core"><div className="success-symbol">✓</div><div><div className="eyebrow">DISTRETTO 0{roomId} RIPRISTINATO</div><h2>TRACCIA VALIDATA</h2><p>Il Core ha riconosciuto la sequenza. Il distretto è stato ripristinato e la chiave è stata registrata.</p><div className="key-reveal"><span>CHIAVE</span><strong>{successKey}</strong></div><p className="next-hint">Torna alla mappa per vedere il nuovo distretto sbloccato.</p></div></div><button className="cta" onClick={()=>router.push('/synora')}>TORNA ALLA MAPPA →</button></Panel>}
   {step!==3 && <div className="challenge-actions"><div>{msg&&<div className={`result ${msg.includes('CORRETTA')?'ok':'bad'}`}>{msg}</div>}</div><button className="cta cta-small" disabled={busy||expired} onClick={submit}>{busy?'VERIFICA…':'INVIA AL CORE  →'}</button></div>}
   <div className="anti-ai"><span>◈</span><div><b>PROTOCOLLO DI VERIFICA</b><p>Il Core controlla la coerenza dell'intera ricostruzione. Una risposta isolata non è sufficiente: dati, percorso, configurazione e conseguenze devono essere compatibili.</p></div></div>
 </div>
}
