'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdvancedMissions from './advanced-missions'

type Answers = Record<string,string>

const levels = ['Fisico','Collegamento dati','Rete','Trasporto','Sessione','Presentazione','Applicazione']
const keys: Record<number,string> = {1:'ENCAPSULATION',2:'VLSM',3:'CIDR',4:'NEXT-HOP',5:'DIAGNOSI',6:'VLAN',7:'REDUNDANZA',8:'SYNORA'}

function Panel({title,children}:{title:string;children:React.ReactNode}){return <section className="challenge-panel"><div className="panel-head"><span>{title}</span><i/></div>{children}</section>}
function Choice({active,children,onClick}:{active:boolean;children:React.ReactNode;onClick:()=>void}){return <button type="button" className={`choice-card ${active?'selected':''}`} onClick={onClick}>{children}</button>}
function Input({value,onChange,placeholder}:{value:string;onChange:(v:string)=>void;placeholder?:string}){return <input className="answer-input" value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>} 

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
 const set=(k:string,v:string)=>{setA(x=>({...x,[k]:v}));setMsg('')}
 const submit=async()=>{setBusy(true);setMsg('VERIFICA DELLA TRACCIA SUL CORE…');const res=await fetch('/api/attempt',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({roomId,answers:a})});const data=await res.json();setBusy(false);if(data.success){setSuccessKey(keys[roomId]);setStep(3);setMsg('')}else setMsg(data.message||'TRACCIA INCOERENTE')}

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

 return <div className="challenge-wrap">
   <div className="challenge-progress"><span className="active">01 TRACCIA</span><span>02 VERIFICA</span><span>03 CHIAVE</span><div><b>{keys[roomId]}</b> · 10 missioni nel distretto · protocollo locale</div></div>

   {roomId===1 && <>
    <Panel title="TRACE / FRAME 0017"><p className="instruction">Quattro frammenti sono stati recuperati. Attribuiteli al livello corretto e poi ricostruite il percorso inverso di rimozione degli header.</p><div className="packet-grid">{[['A','PORTA DESTINAZIONE','443'],['B','MAC SORGENTE','AA:7B:19:CC:04:91'],['C','IP DESTINAZIONE','172.16.40.20'],['D','PROTOCOLLO','HTTPS']].map(([id,k,v])=><div className="packet-chip" key={id}><b>{id}</b><span>{k}</span><code>{v}</code><select value={a[id]||''} onChange={e=>set(id,e.target.value)}><option value="">livello…</option>{levels.map(x=><option key={x}>{x}</option>)}</select></div>)}</div><div className="mini-question"><span>Rimozione degli header: dal frame ricevuto fino all'applicazione</span><select value={a.order||''} onChange={e=>set('order',e.target.value)}><option value="">scegli…</option><option>Applicazione → Trasporto → Rete → Collegamento</option><option>Collegamento → Rete → Trasporto → Applicazione</option><option>Trasporto → Rete → Collegamento → Applicazione</option></select></div></Panel>
    <Panel title="PDU / CONTROLLO DI COERENZA"><p className="instruction">Non basta riconoscere i livelli: indicate anche quale PDU attraversa ciascun passaggio.</p><div className="answer-pair three"><label>Trasporto</label><select value={a.pduT||''} onChange={e=>set('pduT',e.target.value)}><option value="">scegli…</option><option>Segmento</option><option>Pacchetto</option><option>Frame</option><option>Messaggio</option></select><label>Rete</label><select value={a.pduR||''} onChange={e=>set('pduR',e.target.value)}><option value="">scegli…</option><option>Segmento</option><option>Pacchetto</option><option>Frame</option><option>Messaggio</option></select></div></Panel>
   </>}

   {roomId===2 && <>
    <Panel title="ADDRESSING / VLSM"><p className="instruction">La rete 192.168.40.0/24 deve contenere quattro segmenti. Determinate il prefisso minimo, l'indirizzo di rete e il primo host. Ogni spazio deve essere consecutivo e senza sovrapposizioni.</p><div className="vlsm-grid">{[['SEGRETERIA','60'],['LAB','120'],['SERVER','28'],['GUEST','14']].map(([name,n],i)=><div className="vlsm-row" key={name}><b>{name}</b><span>{n} host</span><select value={a[`p${i}`]||''} onChange={e=>set(`p${i}`,e.target.value)}><option value="">/ ?</option>{['/25','/26','/27','/28','/29','/30'].map(x=><option key={x}>{x}</option>)}</select><Input value={a[`r${i}`]||''} onChange={v=>set(`r${i}`,v)} placeholder="rete"/></div>)}</div><div className="mini-question"><span>Primo indirizzo utilizzabile del segmento più grande</span><Input value={a.first||''} onChange={v=>set('first',v)} placeholder="x.x.x.x"/></div></Panel>
    <Panel title="VLSM / VERIFICA DI CONFINE"><p className="instruction">Il segmento LAB è il più grande. Indicate anche il broadcast e l'ultimo host utilizzabile: servono per dimostrare che il blocco è davvero /25.</p><div className="answer-pair"><label>Broadcast LAB</label><Input value={a.bc||''} onChange={v=>set('bc',v)} placeholder="x.x.x.x"/><label>Ultimo host LAB</label><Input value={a.last||''} onChange={v=>set('last',v)} placeholder="x.x.x.x"/></div></Panel>
   </>}

   {roomId===3 && <>
    <Panel title="AGGREGATION / CIDR"><p className="instruction">Quattro reti contigue devono essere annunciate con una sola rotta. Trovate il blocco minimo che le contiene e dimostrate che il confine non ingloba reti esterne.</p><div className="route-list">{['172.16.32.0/24','172.16.33.0/24','172.16.34.0/24','172.16.35.0/24'].map(x=><code key={x}>{x}</code>)}</div><div className="answer-pair"><label>Supernet</label><Input value={a.cidr||''} onChange={v=>set('cidr',v)} placeholder="es. 172.16.32.0/22"/><label>Maschera decimale</label><Input value={a.mask||''} onChange={v=>set('mask',v)} placeholder="255.255.x.0"/></div><div className="mini-question"><span>Numero di reti /24 contenute</span><Input value={a.count||''} onChange={v=>set('count',v)} placeholder="numero"/></div></Panel>
    <Panel title="BORDER TEST"><p className="instruction">Qual è la prima rete /24 immediatamente esterna al blocco aggregato? Scrivetela: serve a controllare che il confine sia corretto.</p><Input value={a.outside||''} onChange={v=>set('outside',v)} placeholder="es. 172.16.36.0/24"/></Panel>
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
    <Panel title="ROUTING TABLE / DECISIONE"><p className="instruction">Ora dimostrate perché il percorso è corretto. Per <b>10.20.30.77</b> la rotta /24 è più specifica della /16 e della default.</p><div className="route-evidence"><div className="evidence-table"><div className="table-head"><span>DESTINAZIONE</span><span>PREFISSO</span><span>NEXT-HOP</span><span>METRICA</span></div>{[['10.20.0.0','/16','10.0.0.2','10'],['10.20.30.0','/24','10.0.1.2','20'],['10.30.0.0','/16','10.0.2.2','5'],['0.0.0.0','/0','10.0.0.2','1']].map(r=><div className="table-row" key={r.join('-')}>{r.map(c=><code key={c}>{c}</code>)}</div>)}</div><div className="trace-log"><div>01 <b>192.168.1.1</b><small>R1 / LOCAL</small></div><div>02 <b>10.0.0.2</b><small>R2 / CORE</small></div><div>03 <b>10.0.1.2</b><small>R3 / EDGE</small></div><div className="lost">04 <b>* * *</b><small>NO REPLY</small></div></div></div>
      <div className="mini-question"><span>Next-hop</span><Input value={a.next||''} onChange={v=>set('next',v)} placeholder="x.x.x.x"/><span>Tipo rotta</span><Choice active={a.kind==='specifica'} onClick={()=>set('kind','specifica')}>specifica /24</Choice></div>
    </Panel>
    <Panel title="DIAGNOSTICA ICMP"><p className="instruction">Il quarto hop non risponde. Interpretate la traccia e calcolate il TTL residuo al terzo router partendo da TTL=4.</p><div className="answer-pair"><label>Evento</label><select value={a.event||''} onChange={e=>set('event',e.target.value)}><option value="">scegli…</option><option>Il router successivo non risponde entro il timeout</option><option>Il DNS non ha risolto il nome</option><option>Il client ha perso la propria interfaccia</option></select><label>TTL al terzo hop</label><Input value={a.ttl||''} onChange={v=>set('ttl',v)} placeholder="numero"/></div></Panel>
   </>}

   {roomId===5 && <>
    <Panel title="ROUTER BLACK BOX / INCIDENTE 05"><p className="instruction">R5 dichiara che tutto è operativo. Ma la rete verso <b>192.168.60.0/24</b> non è raggiungibile. Prima osservate l'output, poi intervenite nel terminale: qui non scegliete un comando da un menu, lo dovete digitare.</p><pre className="terminal">{`R5# show ip interface brief\nGi0/0   192.168.5.1    up                    up\nGi0/1   10.0.5.1       up                    up\nGi0/2   10.0.6.1       administratively down down\n\nR5# show ip route\nC 10.0.5.0/30 is directly connected, Gi0/1\nS 192.168.50.0/24 [1/0] via 10.0.5.2\nS 192.168.60.0/24 [1/0] via 10.0.6.2\n\nR5# show running-config | section ip route\nip route 192.168.50.0 255.255.255.0 10.0.5.2\nip route 192.168.60.0 255.255.255.0 10.0.6.2`}</pre></Panel>
    <Panel title="1 / ISOLA L'ANOMALIA"><p className="instruction">Selezionate esattamente le due evidenze che spiegano il guasto. Una collega lo stato fisico/logico dell'interfaccia alla route che dipende da quel next-hop.</p><div className="choice-grid">{['Gi0/2 amministratively down','Rotta 192.168.50.0 via 10.0.5.2','Rotta 192.168.60.0 via 10.0.6.2','Gi0/0 192.168.5.1 up/up'].map((x,i)=><Choice key={x} active={a[`anom${i}`]==='1'} onClick={()=>set(`anom${i}`,a[`anom${i}`]==='1'?'':'1')}>{x}</Choice>)}</div></Panel>
    <Panel title="2 / TERMINALE CISCO — DIGITA DAVVERO"><p className="instruction">Il prompt cambia come in IOS. Eseguite la procedura completa: ingresso in privileged mode, configurazione dell'interfaccia, riattivazione e verifica. Il sistema accetta il comando solo se appartiene alla sequenza corretta.</p><div className="cisco-terminal">
      <div className="terminal-screen">{cliLines.length===0&&<div className="terminal-dim">R5 router console · sessione aperta · attendi il primo comando</div>}{cliLines.map((l,i)=><div key={i}><div><span>{l.prompt}</span> {l.cmd}</div>{l.out&&<pre>{l.out}</pre>}</div>)}</div>
      <form className="terminal-command" onSubmit={e=>{e.preventDefault();runCli()}}><span>{cliPrompt}</span><input value={cliInput} onChange={e=>setCliInput(e.target.value)} autoComplete="off" spellCheck={false} placeholder="digita comando IOS…"/><button type="submit">INVIO</button></form>
      <div className="terminal-tools"><span>PROCEDURA {Math.min(cliIndex,cliScript.length)}/{cliScript.length}</span><button type="button" onClick={resetCli}>RESET TERMINALE</button></div>
    </div></Panel>
    <Panel title="3 / VERIFICA POST-REPAIR"><p className="instruction">Quando il terminale ha completato la procedura, dichiarate l'esito finale della route.</p><div className="answer-pair"><label>Route ripristinata</label><Input value={a.route||''} onChange={v=>set('route',v)} placeholder="rete /24"/><label>Perché?</label><Choice active={a.reason==='next-hop-raggiungibile'} onClick={()=>set('reason','next-hop-raggiungibile')}>il next-hop torna raggiungibile attraverso Gi0/2</Choice><label>Stato Gi0/2</label><select value={a.state||''} onChange={e=>set('state',e.target.value)}><option value="">scegli…</option><option>up / up</option><option>up / down</option><option>administratively down / down</option></select></div></Panel>
   </>}

   {roomId===6 && <>
    <Panel title="SWITCH ROOM / CABLING"><p className="instruction">Quattro apparati sono scollegati. Collegate fisicamente ogni apparato alla porta corretta dello switch. Potete trascinare un apparato sulla porta oppure selezionare prima l'apparato e poi la porta: i cavi sono registrati dal Core.</p>
      <div className="switch-lab"><div className="device-rack">{room6Devices.map(d=><button key={d.id} type="button" draggable onDragStart={e=>e.dataTransfer.setData('text/plain',d.id)} className={`device-node ${selectedDevice===d.id?'selected':''} ${cables[d.id]?'connected':''}`} onClick={()=>setSelectedDevice(selectedDevice===d.id?'':d.id)}><strong>{d.label}</strong><small>{d.meta}</small><em>{cables[d.id]?`Gi${cables[d.id]}`:'DISCONNESSO'}</em></button>)}</div>
      <div className="switch-face"><div className="switch-title">SYNORA-SW1 · 24 PORT</div><div className="port-grid">{room6Ports.map(p=>{const device=Object.entries(cables).find(([,port])=>port===String(p))?.[0];return <button key={p} type="button" className={`switch-port ${p===24?'trunk-port':''} ${device?'occupied':''}`} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const d=e.dataTransfer.getData('text/plain');if(d)connectDevice(d,String(p))}} onClick={()=>selectedDevice&&connectDevice(selectedDevice,String(p))}><span>Gi{p}</span><b>{device||'EMPTY'}</b><small>{p===24?'TRUNK':p<=2?'STAFF':p<=5?'LAB':'GUEST'}</small></button>})}</div></div></div>
      <div className="cable-status"><span>{Object.keys(cables).length}/4 CAVI COLLEGATI</span><button type="button" onClick={resetCables}>SCOLLEGA TUTTO</button></div>
    </Panel>
    <Panel title="PORT MAP / VLAN"><p className="instruction">Dopo il cablaggio, assegnate le VLAN alle porte dati. La porta 24 deve restare trunk verso il router.</p><div className="port-config-grid">{[1,2,3,4,5,6,7,8,24].map(p=><div className="port-config" key={p}><b>Gi{p}</b><select value={a[`v${p}`]||''} onChange={e=>set(`v${p}`,e.target.value)}><option value="">VLAN…</option><option>10 STAFF</option><option>20 LAB</option><option>30 GUEST</option><option>TRUNK</option></select></div>)}</div></Panel>
    <Panel title="INTER-VLAN FORENSICS"><p className="instruction">Un PC della VLAN 30 deve raggiungere un server della VLAN 10. Indicate gateway, tipo di link verso il router e comportamento dei broadcast.</p><div className="answer-pair"><label>Gateway VLAN 30</label><Input value={a.gw||''} onChange={v=>set('gw',v)} placeholder="es. 192.168.30.1"/><label>Link switch-router</label><Choice active={a.link==='trunk'} onClick={()=>set('link','trunk')}>TRUNK 802.1Q</Choice><label>Broadcast tra VLAN</label><Choice active={a.broadcast==='separati'} onClick={()=>set('broadcast','separati')}>domini separati</Choice></div></Panel>
   </>}

   {roomId===7 && <>
    <Panel title="STP LIVE / LOOP DETECTED"><p className="instruction">Avviate la rete. Il triangolo genera un loop: i frame broadcast continuano a circolare. La vostra missione è stabilizzare la topologia con STP, non semplicemente indicare una risposta.</p><div className={`stp-board ${stpRunning?'live':''} ${stpStable?'stable':''}`}>
      <div className="stp-link l12"><span>10</span></div><div className="stp-link l13"><span>10</span></div><div className="stp-link l23"><span>100</span></div>
      <div className="stp-switch stp1">SW1<small>BID 01 · ROOT CANDIDATE</small></div><div className="stp-switch stp2">SW2<small>BID 02</small></div><div className="stp-switch stp3">SW3<small>BID 03</small></div>
      {stpRunning&&<><i className="frame-dot fd1"/><i className="frame-dot fd2"/><i className="frame-dot fd3"/></>}
      <div className="stp-state">{stpStable?'TOPOLOGIA STABILE · LOOP ELIMINATO':stpRunning?'LOOP ATTIVO · FRAME IN CIRCOLO':'RETE FERMA · PRONTA AL TEST'}</div>
    </div><div className="stp-controls"><button type="button" className="cta cta-small" onClick={()=>{setStpRunning(true);setStpStable(false)}}>AVVIA TRAFFICO</button><button type="button" className="ghost-btn" onClick={()=>{setStpRunning(false);setStpStable(false)}}>RESET</button></div></Panel>
    <Panel title="STP / DECISION ENGINE"><p className="instruction">I BID più bassi vincono. A parità di scenario, il costo del percorso verso la root decide il root port. Con i costi mostrati, il link più costoso può diventare quello alternate/blocking.</p><div className="stp-answers"><div><label>ROOT BRIDGE</label><Choice active={a.root==='SW1'} onClick={()=>set('root','SW1')}>SW1 · BID 01</Choice></div><div><label>ROOT PORT SW2</label><Choice active={a.rp==='SW2-SW1'} onClick={()=>set('rp','SW2-SW1')}>SW2 → SW1</Choice></div><div><label>ROOT PORT SW3</label><Choice active={a.rp3==='SW3-SW1'} onClick={()=>set('rp3','SW3-SW1')}>SW3 → SW1</Choice></div><div><label>ALTERNATE / BLOCKING</label><Choice active={a.block==='SW2-SW3'} onClick={()=>set('block','SW2-SW3')}>SW2 — SW3</Choice></div></div><button type="button" className={`stabilize-btn ${stpStable?'done':''}`} onClick={stabilize}>{stpStable?'✓ STP STABILIZZATO':'APPLICA STP E STABILIZZA LA RETE'}</button></Panel>
    <Panel title="FAILURE TEST"><p className="instruction">Ora simulate la caduta del link SW2—SW1. Quale collegamento deve riaprire il percorso verso la root senza ricreare un loop?</p><div className="choice-grid"><Choice active={a.fail==='SW2-SW3'} onClick={()=>set('fail','SW2-SW3')}>SW2 → SW3 · entra in servizio</Choice><Choice active={a.fail==='SW1-SW3'} onClick={()=>set('fail','SW1-SW3')}>SW1 → SW3 · resta root link</Choice></div></Panel>
   </>}

   {roomId===8 && <>
    <Panel title="TERMINAL / CISCO CLI"><p className="instruction">Il core è tornato raggiungibile. Ricostruite una configurazione reale: i comandi sono mescolati. Riordinateli e completate i due comandi mancanti.</p><div className="cli-builder">{['enable','configure terminal','interface g0/0','ip address 192.168.10.1 255.255.255.0','no shutdown','ip route 192.168.20.0 255.255.255.0 10.0.0.2'].map((x,i)=><div className="cli-row" key={x}><span>{i+1}</span><code>{x}</code><select value={a[`c${i}`]||''} onChange={e=>set(`c${i}`,e.target.value)}><option value="">posizione</option>{[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></div>)}</div><div className="answer-pair"><label>Comando operativo</label><Choice active={a.up==='no shutdown'} onClick={()=>set('up','no shutdown')}>no shutdown</Choice><label>Test finale</label><Choice active={a.test==='ping 192.168.20.1'} onClick={()=>set('test','ping 192.168.20.1')}>ping 192.168.20.1</Choice></div></Panel>
    <Panel title="ULTIMO CONTROLLO"><p className="instruction">Quale tabella deve contenere la rotta statica appena inserita?</p><Choice active={a.table==='routing'} onClick={()=>set('table','routing')}>tabella di routing</Choice></Panel>
   </>}

   <AdvancedMissions roomId={roomId} a={a} set={set}/>

   {step===3 && <Panel title="CORE / CHIAVE RECUPERATA"><div className="success-core"><div className="success-symbol">✓</div><div><div className="eyebrow">DISTRETTO 0{roomId} RIPRISTINATO</div><h2>TRACCIA VALIDATA</h2><p>Il Core ha riconosciuto la sequenza. Il distretto è stato ripristinato e la chiave è stata registrata.</p><div className="key-reveal"><span>CHIAVE</span><strong>{successKey}</strong></div><p className="next-hint">Torna alla mappa per vedere il nuovo distretto sbloccato.</p></div></div><button className="cta" onClick={()=>router.push('/synora')}>TORNA ALLA MAPPA →</button></Panel>}
   {step!==3 && <div className="challenge-actions"><div>{msg&&<div className={`result ${msg.includes('CORRETTA')?'ok':'bad'}`}>{msg}</div>}</div><button className="cta cta-small" disabled={busy} onClick={submit}>{busy?'VERIFICA…':'INVIA AL CORE  →'}</button></div>}
   <div className="anti-ai"><span>◈</span><div><b>PROTOCOLLO DI VERIFICA</b><p>Il Core controlla la coerenza dell'intera ricostruzione. Una risposta isolata non è sufficiente: dati, percorso, configurazione e conseguenze devono essere compatibili.</p></div></div>
 </div>
}
