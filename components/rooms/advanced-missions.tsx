'use client'
import React, {useState} from 'react'

type Answers = Record<string,string>
function Panel({title,children,className='' }:{title:string;children:React.ReactNode;className?:string}){return <section className={`challenge-panel mission-panel ${className}`}><div className="panel-head"><span>{title}</span><i/></div>{children}</section>}
function Input({value,onChange,placeholder}:{value:string;onChange:(v:string)=>void;placeholder?:string}){return <input className="answer-input" value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>} 
function Evidence({active,children,onClick}:{active:boolean;children:React.ReactNode;onClick:()=>void}){return <button type="button" className={`evidence-card ${active?'selected':''}`} onClick={onClick}><span className="evidence-check">{active?'✓':'+'}</span>{children}</button>}
function CodeBox({children}:{children:React.ReactNode}){return <pre className="mission-code">{children}</pre>}
function Stepper({value,onChange,max=6}:{value:string;onChange:(v:string)=>void;max?:number}){return <div className="stepper">{Array.from({length:max},(_,i)=>String(i+1)).map(n=><button type="button" key={n} className={value===n?'selected':''} onClick={()=>onChange(n)}>{n}</button>)}</div>}

export default function AdvancedMissions({roomId,a,set}:{roomId:number;a:Answers;set:(k:string,v:string)=>void}){
 const p=(n:number)=>`m${roomId}_${n}`
 const toggle=(k:string)=>set(k,a[k]==='1'?'':'1')

 if(roomId===1)return <>
  <Panel title="MISSIONE 03 · IL FRAME CHE CAMBIA">
   <p className="instruction">PC-A invia un pacchetto al server remoto. Il pacchetto attraversa R1. Non limitarti a nominare un livello: ricostruisci cosa succede al frame sul nuovo segmento Ethernet.</p>
   <CodeBox>PC-A → SW → R1 → R2 → SERVER

Prima del router:
MAC src = AA:AA:AA:10:10:10
MAC dst = 00:11:22:33:44:55
IP dst  = 172.16.40.20

Dopo il router, sul link R1→R2:
MAC dst = ?
IP dst  = ?</CodeBox>
   <div className="answer-pair"><label>Quale informazione viene ricostruita a ogni nuovo collegamento?</label><Input value={a[p(3)]||''} onChange={v=>set(p(3),v)} placeholder="nome dell'header…"/><label>Gli IP di destinazione cambiano durante il semplice forwarding?</label><Input value={a[p(3)+'b']||''} onChange={v=>set(p(3)+'b',v)} placeholder="sì / no + motivo"/></div>
  </Panel>
  <Panel title="MISSIONE 04 · PORTA 443 SOTTO INTERROGATORIO">
   <p className="instruction">Una cattura mostra TCP dst=443. Spiegate la collocazione della porta senza confondere protocollo applicativo e livello che trasporta l'informazione.</p>
   <CodeBox>Ethernet {`{`} IP {`{`} TCP {`{`} dst port 443 {`}`} {`}`} {`}`}</CodeBox>
   <Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="livello + spiegazione breve"/>
  </Panel>
  <Panel title="MISSIONE 05 · LA CATENA DI INCAPSULAMENTO">
   <p className="instruction">Scrivete la catena completa dal dato applicativo al frame Ethernet, usando esattamente le PDU corrette per TCP/IP.</p>
   <Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="Messaggio → … → … → …"/>
  </Panel>
  <Panel title="MISSIONE 06 · CHI DECIDE LA STRADA">
   <p className="instruction">R1 riceve un pacchetto con destinazione 10.20.30.77. Deve consultare una struttura dati per decidere il forwarding. Indicate dispositivo e struttura consultata.</p>
   <Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="dispositivo + struttura"/>
  </Panel>
  <Panel title="MISSIONE 07 · DECOSTRUZIONE">
   <p className="instruction">Il server riceve un frame Ethernet contenente IP e TCP. Scrivete l'ordine con cui gli involucri vengono rimossi.</p>
   <Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="Ethernet → … → …"/>
  </Panel>
  <Panel title="MISSIONE 08 · TROVA L'INCOERENZA">
   <p className="instruction">Individuate l'unico elemento collocato nel livello sbagliato e spiegate la correzione.</p>
   <CodeBox>MAC → Collegamento dati
IP → Rete
TCP 443 → Rete
HTTPS → Applicazione</CodeBox>
   <Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="elemento errato → collocazione corretta"/>
  </Panel>
  <Panel title="MISSIONE 09 · STESSO IP, NUOVO FRAME">
   <p className="instruction">Spiegate perché il pacchetto IP può mantenere la destinazione mentre il frame Ethernet viene ricostruito sul collegamento successivo.</p>
   <Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="spiegazione tecnica"/>
  </Panel>
  <Panel title="MISSIONE 10 · AUTOPSIA DELLA CATTURA">
   <p className="instruction">Ricostruite la comunicazione completa partendo da questi indizi. Non basta elencare i livelli: indicate anche il protocollo di trasporto.</p>
   <CodeBox>dst TCP = 443
protocollo applicativo = HTTPS
IP src = 192.168.10.20
IP dst = 172.16.40.20
MAC dst sul primo link = gateway</CodeBox>
   <Input value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="HTTPS → … → … → Ethernet + spiegazione"/>
  </Panel>
 </>

 if(roomId===2)return <>
  <Panel title="MISSIONE 03 · IL BLOCCO DA 32">
   <p className="instruction">Un progettista deve scegliere l'indirizzo di rete di una /27. Tra i candidati, solo uno è allineato correttamente.</p><CodeBox>Candidati:
192.168.40.192
192.168.40.194
192.168.40.198
192.168.40.201</CodeBox><Input value={a[p(3)]||''} onChange={v=>set(p(3),v)} placeholder="network corretta + calcolo del block size"/></Panel>
  <Panel title="MISSIONE 04 · CONFINE /26"><p className="instruction">Calcolate il broadcast di 192.168.40.128/26 e spiegate come avete ricavato il confine.</p><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="broadcast + ragionamento"/></Panel>
  <Panel title="MISSIONE 05 · HOST O RETE?"><p className="instruction">Avete 192.168.40.190, con reti 192.168.40.128/26 e 192.168.40.192/27. Stabilite dove appartiene e dimostratelo con gli intervalli.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="subnet + intervallo"/></Panel>
  <Panel title="MISSIONE 06 · ALLINEAMENTO"><p className="instruction">Perché 192.168.40.192 è un network address valido per /27 mentre .194 non lo è?</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="spiegazione con multipli"/></Panel>
  <Panel title="MISSIONE 07 · PROGETTO MINIMO"><p className="instruction">Un reparto richiede 50 host ordinari. Calcolate il prefisso minimo e mostrate il confronto con il prefisso immediatamente più piccolo.</p><Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="/xx + 2^n ≥ H+2"/></Panel>
  <Panel title="MISSIONE 08 · ULTIMO HOST"><p className="instruction">Per 10.10.8.64/27 calcolate network, broadcast e ultimo host. Inserite tutti e tre.</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="network | broadcast | ultimo host"/></Panel>
  <Panel title="MISSIONE 09 · OVERLAP"><p className="instruction">10.0.0.0/25 e 10.0.0.96/27 vengono assegnate a due reparti distinti. Dimostrate perché il piano è invalido.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="intervalli + tipo di errore"/></Panel>
  <Panel title="MISSIONE 10 · CRESCITA SENZA /24"><p className="instruction">Un reparto passa a 62 host ordinari. Determinate il prefisso minimo, gli indirizzi totali e gli host utilizzabili.</p><Input value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="/xx | totali | utilizzabili"/></Panel>
 </>

 if(roomId===3)return <>
  <Panel title="MISSIONE 03 · MASCHERA /22"><p className="instruction">Convertite /22 in decimale puntato e indicate il block size nell'ottetto interessante.</p><Input value={a[p(3)]||''} onChange={v=>set(p(3),v)} placeholder="255.x.x.x | block size"/></Panel>
  <Panel title="MISSIONE 04 · DOPO LA SUPERNET"><p className="instruction">172.16.32.0/22 contiene quattro /24. Qual è la prima rete /24 esterna? Dimostrate l'intervallo coperto.</p><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="rete successiva + intervallo"/></Panel>
  <Panel title="MISSIONE 05 · LONGEST PREFIX MATCH"><p className="instruction">Per 10.20.30.77 esistono /8, /16 e /24. Scrivete quale viene scelta e perché.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="prefisso + regola"/></Panel>
  <Panel title="MISSIONE 06 · AGGREGAZIONE VALIDATA"><p className="instruction">Confrontate i blocchi 192.168.8–11, 9–12, 10–13 e 12–15. Identificate quello aggregabile in /22 e spiegate allineamento e contiguità.</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="blocco + spiegazione"/></Panel>
  <Panel title="MISSIONE 07 · ROUTE LEAK"><p className="instruction">Una supernet copre una rete estranea. Spiegate quale errore di progettazione può produrre nell'instradamento.</p><Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="conseguenza sul traffico"/></Panel>
  <Panel title="MISSIONE 08 · DUE /24, UNA ROTTA"><p className="instruction">10.20.32.0/24 e 10.20.33.0/24 devono essere riassunte. Calcolate la supernet e il numero di indirizzi totali.</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="supernet | indirizzi"/></Panel>
  <Panel title="MISSIONE 09 · PERCHÉ AGGREGARE?"><p className="instruction">Non indicate semplicemente “ridurre la tabella”. Spiegate quale effetto ha la summarization sugli annunci di routing.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="effetto tecnico"/></Panel>
  <Panel title="MISSIONE 10 · 172.16.32.0/22 SOTTO ESAME"><p className="instruction">Calcolate network, broadcast, numero di /24 contenute e primo /24 esterno.</p><Input value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="network | broadcast | /24 | esterno"/></Panel>
 </>

 if(roomId===4)return <>
  <Panel title="MISSIONE 04 · LA DEFAULT NON È UNA SCORCIATOIA"><p className="instruction">Una tabella contiene rotte specifiche e 0.0.0.0/0. Spiegate in quali condizioni viene utilizzata la default route.</p><CodeBox>10.20.30.0/24 via 10.0.1.2
10.30.0.0/16 via 10.0.2.2
0.0.0.0/0 via 10.0.0.2</CodeBox><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="regola di selezione"/></Panel>
  <Panel title="MISSIONE 05 · TTL RESIDUO"><p className="instruction">Un pacchetto parte con TTL=3 e attraversa due router. Calcolate il TTL dopo il secondo forwarding e indicate cosa accadrebbe al successivo.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="TTL residuo | conseguenza"/></Panel>
  <Panel title="MISSIONE 06 · TIME EXCEEDED"><p className="instruction">Spiegate cosa permette a traceroute di scoprire quando un router restituisce ICMP Time Exceeded.</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="TTL + ICMP + hop"/></Panel>
  <Panel title="MISSIONE 07 · NEXT-HOP NASCOSTO"><p className="instruction">Rotta: 192.168.20.0/24 via 10.0.1.2. Spiegate cosa rappresenta 10.0.1.2 e perché non è l'IP della rete destinazione.</p><Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="definizione + spiegazione"/></Panel>
  <Panel title="MISSIONE 08 · L'INTERFACCIA PRIMA DI TUTTO"><p className="instruction">La route esiste, ma il link verso il next-hop è down. Elencate le verifiche da fare in ordine logico.</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="1. … 2. … 3. …"/></Panel>
  <Panel title="MISSIONE 09 · L'HOP FANTASMA"><p className="instruction">Traceroute: 1=R1, 2=R2, 3=* * *, 4=R4. Interpretate il terzo hop senza concludere che il router sia assente.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="interpretazione precisa"/></Panel>
  <Panel title="MISSIONE 10 · AUTOPSIA DEL PERCORSO"><p className="instruction">Gateway locale raggiungibile, R2 raggiungibile, poi nessuna risposta. Indicate quali due fonti consultare per restringere il guasto e cosa cerchereste.</p><Input value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="due fonti + evidenza da cercare"/></Panel>
 </>

 if(roomId===5)return <>
  <Panel title="MISSIONE 04 · ENTRA NELLA MODALITÀ GIUSTA"><p className="instruction">Partendo da R5&gt;, scrivete la sequenza minima per arrivare a R5(config-if)# su Gi0/2.</p><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="comando → comando → comando"/></Panel>
  <Panel title="MISSIONE 05 · CONFIGURAZIONE GLOBALE"><p className="instruction">Siete in R5#. Quale comando apre la modalità globale? Poi spiegate perché enable non serve più.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="comando + spiegazione"/></Panel>
  <Panel title="MISSIONE 06 · INTERFACCIA SPENTA"><p className="instruction">L'output dice administratively down/down. Indicate il comando e la modalità IOS necessaria.</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="modalità + comando"/></Panel>
  <Panel title="MISSIONE 07 · PRIMA FOTOGRAFIA"><p className="instruction">Prima di modificare il router, quale comando usereste per avere rapidamente stato e indirizzi di tutte le interfacce? Spiegate perché è più utile di show ip route per questo sintomo.</p><Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="comando + motivazione"/></Panel>
  <Panel title="MISSIONE 08 · LA ROUTING TABLE"><p className="instruction">Dopo aver riattivato Gi0/2, quale comando verifica la presenza delle rotte e quale riga dovreste ritrovare?</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="comando + rete attesa"/></Panel>
  <Panel title="MISSIONE 09 · NEXT-HOP IRRAGGIUNGIBILE"><p className="instruction">Una static route punta a 10.0.6.2 ma Gi0/2 è down. Costruite una catena causale: sintomo → causa → correzione → verifica.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="sintomo → causa → fix → verifica"/></Panel>
  <Panel title="MISSIONE 10 · TROUBLESHOOTING SENZA INDOVINARE"><p className="instruction">Avete un solo tentativo di modifica. Prima dovete scegliere le evidenze da raccogliere: show ip interface brief, show ip route, running-config. Spiegate in quale ordine le usereste e cosa cerchereste.</p><Input value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="ordine + evidenze"/></Panel>
 </>

 if(roomId===6)return <>
  <Panel title="MISSIONE 04 · TRUNK, MA DIMOSTRALO"><p className="instruction">Due switch devono trasportare VLAN 10,20,30 sullo stesso link. Spiegate perché una porta access non può svolgere lo stesso ruolo e quale configurazione logica serve.</p><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="modalità + motivazione"/></Panel>
  <Panel title="MISSIONE 05 · BROADCAST DOMAIN TEST"><p className="instruction">PC-A è VLAN10 e PC-B VLAN20 sullo stesso switch. Prevedete il risultato di un broadcast e spiegate il ruolo delle VLAN.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="chi riceve + perché"/></Panel>
  <Panel title="MISSIONE 06 · ROUTER-ON-A-STICK"><p className="instruction">Descrivete il percorso di un pacchetto VLAN20 che deve raggiungere VLAN30 passando da un unico collegamento switch-router.</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="PC → switch → ... → PC"/></Panel>
  <Panel title="MISSIONE 07 · GATEWAY DA RICAVARE"><p className="instruction">Host 192.168.30.20/24 in VLAN30. Il gateway è il primo indirizzo utilizzabile scelto dal progetto. Calcolatelo e spiegate perché il broadcast non può esserlo.</p><Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="gateway + spiegazione"/></Panel>
  <Panel title="MISSIONE 08 · DHCP FORENSICS"><p className="instruction">Un client appena collegato non possiede ancora un IP. Ricostruite l'ordine dei quattro messaggi DHCP e indicate quale assegna definitivamente la configurazione.</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="DISCOVER → OFFER → … → …"/></Panel>
  <Panel title="MISSIONE 09 · VLAN ALLOWED"><p className="instruction">Trunk up, VLAN 10 funziona, VLAN 30 no. Indicate il controllo più mirato e spiegate perché non partireste dal DNS.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="controllo + motivazione"/></Panel>
  <Panel title="MISSIONE 10 · INTER-VLAN FORENSICS"><p className="instruction">PC-A 192.168.10.20/24 deve raggiungere SERVER 192.168.30.50/24. Ricostruite il percorso L2/L3 e indicate dove entra in gioco il gateway.</p><Input value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="percorso completo"/></Panel>
 </>

 if(roomId===7)return <>
  <Panel title="MISSIONE 04 · CALCOLA IL ROOT PATH"><p className="instruction">SW1 è root. SW2 può raggiungerlo direttamente con costo 10 oppure via SW3 con costo 110. Calcolate i due costi e motivate la scelta.</p><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="10 vs 110 → scelta"/></Panel>
  <Panel title="MISSIONE 05 · ROOT PORT DI SW3"><p className="instruction">SW3 ha un link diretto verso SW1 di costo 10 e uno verso SW2 di costo 100. Determinate il root port.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="porta + costo verso root"/></Panel>
  <Panel title="MISSIONE 06 · IL LINK DA BLOCCARE"><p className="instruction">Triangolo: SW1-SW2=10, SW1-SW3=10, SW2-SW3=100. Dopo aver determinato i root port, indicate il link alternate/blocking e spiegate il motivo.</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="link + motivazione STP"/></Panel>
  <Panel title="MISSIONE 07 · TIE-BREAK"><p className="instruction">Due percorsi hanno lo stesso costo verso la root. Quale informazione del BPDU entra nel confronto successivo? Non rispondete con un semplice “il più basso”: indicate l'identificatore.</p><Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="identificatore + regola"/></Panel>
  <Panel title="MISSIONE 08 · FAILURE TEST"><p className="instruction">Cade SW2-SW1. Il collegamento SW2-SW3 era blocking. Prevedete quale transizione deve avvenire dopo la riconvergenza e perché non crea un nuovo loop.</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="stato → stato + motivo"/></Panel>
  <Panel title="MISSIONE 09 · PERCHÉ STP?" className="mission-dark"><p className="instruction">Non date la definizione scolastica. Spiegate cosa cambierebbe nella rete se tutti i link del triangolo restassero contemporaneamente in forwarding.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="effetto sui frame broadcast"/></Panel>
  <Panel title="MISSIONE 10 · STP LIVE"><p className="instruction">Avviate il traffico, osservate il loop, determinate root/root ports/blocking, applicate STP e poi simulate la caduta del link principale. Scrivete la sequenza di decisioni che avete seguito.</p><Input value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="decisione 1 → 2 → 3 → 4"/></Panel>
 </>

 if(roomId===8)return <>
  <Panel title="MISSIONE 03 · CONFIGURA SENZA GUI"><p className="instruction">Partendo da R1&gt;, scrivete la sequenza minima per configurare Gi0/0 con 192.168.10.1/24 e renderla attiva.</p><Input value={a[p(3)]||''} onChange={v=>set(p(3),v)} placeholder="enable → ..."/></Panel>
  <Panel title="MISSIONE 04 · INTERFACCIA OPERATIVA"><p className="instruction">Un'interfaccia è administratively down. Indicate comando e modalità, poi la verifica che usereste.</p><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="comando | verifica"/></Panel>
  <Panel title="MISSIONE 05 · ROTTA STATICA"><p className="instruction">Configurate mentalmente la rotta 192.168.20.0/24 via 10.0.0.2. Scrivete il comando IOS completo.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="ip route ..."/></Panel>
  <Panel title="MISSIONE 06 · PROVA END-TO-END"><p className="instruction">La rete è configurata. Quale test inviereste per primo a un host remoto e quale comando usereste se fallisse per capire dove si interrompe il percorso?</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="test 1 | test 2"/></Panel>
  <Panel title="MISSIONE 07 · ORDINE DI CONFIGURAZIONE"><p className="instruction">Scrivete nell'ordine corretto le operazioni necessarie per configurare Gi0/0 partendo da R1&gt;.</p><Stepper value={a[p(7)]||''} onChange={v=>set(p(7),v)} max={6}/><Input value={a[p(7)+'x']||''} onChange={v=>set(p(7)+'x',v)} placeholder="sequenza comandi"/></Panel>
  <Panel title="MISSIONE 08 · DEFAULT ROUTE"><p className="instruction">Scrivete il comando IOS per una default route verso 10.0.0.2 e spiegate quando verrà utilizzata.</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="comando + condizione"/></Panel>
  <Panel title="MISSIONE 09 · VERIFICA DELLA ROUTE"><p className="instruction">Dopo una static route, distinguete tra configurazione presente e route effettivamente installata nella tabella. Indicate i due comandi utili.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="comando 1 + comando 2"/></Panel>
  <HeliosInvestigation a={a} set={set}/>
 </>
 return null
}

function HeliosInvestigation({a,set}:{a:Answers;set:(k:string,v:string)=>void}){
 const [tab,setTab]=useState<'case'|'profiles'|'evidence'|'timeline'>('case')
 const suspects=[
  {id:'A',name:'Marta Vieri',role:'Network Engineer',color:'cyan',detail:'Badge NETWORK FLOOR 02:13. Account privilegiato su R3. Può modificare routing e VLAN dalla console.'},
  {id:'B',name:'Luca Ferri',role:'SOC Analyst',color:'amber',detail:'Accesso ai log SOC e console di monitoraggio. Nessun privilegio di configurazione su R3.'},
  {id:'C',name:'Nadia Rinaldi',role:'DevOps',color:'violet',detail:'Accesso ai server applicativi e alla pipeline. VPN attiva alle 02:05, ma nessun accesso alla console R3.'},
  {id:'D',name:'Paolo Serra',role:'System Administrator',color:'green',detail:'Può modificare VLAN e DHCP sugli switch di accesso, ma non ha accesso privilegiato al core R3.'},
  {id:'E',name:'Elena Conti',role:'Security Consultant',color:'rose',detail:'Account audit temporaneo. VPN autorizzata 02:00–02:10; nessun accesso fisico al NETWORK FLOOR.'},
 ]
 const [selected,setSelected]=useState(a.helioSuspect||'')
 const evidence=['E3 · badge alle 02:13','E7 · console R3 alle 02:17','E11 · modifica VLAN alle 02:19','E14 · VPN audit alle 02:05','E18 · DHCP log alle 02:21']
 const choose=(id:string)=>{setSelected(id);set('helioSuspect',id)}
 return <Panel title="MISSIONE 10 · HELIOS CORP — L'INCIDENTE DELLE 02:17" className="helios-case">
  <div className="helios-hero"><div><div className="eyebrow">CASE FILE HC-0217</div><h2>CHI HA ALTERATO LA RETE?</h2><p>Alle 02:17 il core router R3 ha perso la rotta verso il data center. Alle 02:19 una VLAN è stata modificata. Cinque persone avevano accesso fisico o logico all'infrastruttura.</p></div><div className="case-stamp">CLASSIFIED<br/><strong>HELIOS CORP</strong></div></div>
  <div className="helios-tabs">{[['case','DOSSIER'],['profiles','SOSPETTATI'],['evidence','EVIDENZE'],['timeline','TIMELINE']].map(([id,label])=><button type="button" key={id} className={tab===id?'active':''} onClick={()=>setTab(id as typeof tab)}>{label}</button>)}</div>
  {tab==='case'&&<div className="helios-dossier"><CodeBox>INCIDENT WINDOW
02:05  VPN audit session opened
02:13  badge event: NETWORK FLOOR
02:17  R3 route anomaly
02:19  VLAN 30 changed
02:21  DHCP lease burst
02:24  anomaly detected by SOC

KNOWN FACTS
• R3 console requires privileged access.
• VLAN changes are logged.
• The attacker did not need to compromise a workstation.
• Exactly one suspect's known access pattern is consistent with ALL events.</CodeBox><p className="instruction">Non scegliere ancora il colpevole. Raccogliete almeno tre indizi prima di formulare la conclusione.</p></div>}
  {tab==='profiles'&&<div className="suspect-grid">{suspects.map(s=><button type="button" key={s.id} className={`suspect-card suspect-${s.color} ${selected===s.id?'selected':''}`} onClick={()=>choose(s.id)}><div className="suspect-avatar">{s.id}</div><div><h3>{s.name}</h3><span>{s.role}</span><p>{s.detail}</p></div></button>)}</div>}
  {tab==='evidence'&&<div className="evidence-grid">{evidence.map((e,i)=><Evidence key={e} active={a[`he${i}`]==='1'} onClick={()=>toggleEvidence(set,a,i)}>{e}</Evidence>)}<CodeBox>LOG R3
02:16:58 login: local-console / privileged
02:17:03 route 172.20.40.0/24 removed
02:17:09 route 172.20.40.0/24 added via 10.0.3.9
02:19:14 vlan 30 modified by admin-console
02:21:02 DHCPDISCOVER burst on VLAN 30</CodeBox></div>}
  {tab==='timeline'&&<div className="timeline-board"><div className="timeline-event"><b>02:13</b><span>Badge NETWORK FLOOR</span><small>Physical access</small></div><div className="timeline-event critical"><b>02:17</b><span>R3 route removed</span><small>Privileged console</small></div><div className="timeline-event critical"><b>02:19</b><span>VLAN 30 modified</span><small>Admin console</small></div><div className="timeline-event"><b>02:21</b><span>DHCP burst</span><small>VLAN 30</small></div></div>}
  <div className="helios-final"><div><label>CONCLUSIONE INVESTIGATIVA</label><p>Selezionate il sospettato e poi spiegate la catena tecnica che collega accesso → console → modifica route → modifica VLAN.</p></div><div className="suspect-choice-row">{suspects.map(s=><button type="button" key={s.id} className={selected===s.id?'selected':''} onClick={()=>choose(s.id)}>{s.id} · {s.name}</button>)}</div><Input value={a.helioReason||''} onChange={v=>set('helioReason',v)} placeholder="catena delle evidenze, con orari e accessi"/></div>
 </Panel>
}
function toggleEvidence(set:(k:string,v:string)=>void,a:Answers,i:number){set(`he${i}`,a[`he${i}`]==='1'?'':'1')}
