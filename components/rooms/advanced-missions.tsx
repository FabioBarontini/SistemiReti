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
   <p className="instruction">PC-A invia un pacchetto al server attraversando R1. Indicate che cosa succede agli indirizzi MAC quando R1 inoltra il pacchetto sul collegamento R1→R2 e indicate se l’IP di destinazione cambia durante questo forwarding.</p>
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
   <p className="instruction">La cattura mostra TCP con porta destinazione 443. Indicate a quale livello TCP/IP appartiene il campo porta e spiegate in una frase perché HTTPS, invece, identifica il protocollo applicativo.</p>
   <CodeBox>Ethernet {`{`} IP {`{`} TCP {`{`} dst port 443 {`}`} {`}`} {`}`}</CodeBox>
   <Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="livello + spiegazione breve"/>
  </Panel>
  <Panel title="MISSIONE 05 · LA CATENA DI INCAPSULAMENTO">
   <p className="instruction">Partendo dal dato dell’applicazione, scrivete nell’ordine le PDU generate durante l’incapsulamento fino al frame Ethernet. Usate i nomi corretti delle PDU TCP/IP.</p>
   <Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="Messaggio → … → … → …"/>
  </Panel>
  <Panel title="MISSIONE 06 · CHI DECIDE LA STRADA">
   <p className="instruction">R1 deve inoltrare un pacchetto destinato a 10.20.30.77. Indicate quale dispositivo sta prendendo la decisione e quale struttura dati deve consultare per scegliere l’interfaccia/next-hop.</p>
   <Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="dispositivo + struttura"/>
  </Panel>
  <Panel title="MISSIONE 07 · DECOSTRUZIONE">
   <p className="instruction">Il server riceve il frame Ethernet. Indicate l’ordine dei livelli durante la decapsulazione, dal frame Ethernet fino ai dati dell’applicazione.</p>
   <Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="Ethernet → … → …"/>
  </Panel>
  <Panel title="MISSIONE 08 · TROVA L'INCOERENZA">
   <p className="instruction">Nel blocco sono presenti quattro associazioni elemento→livello. Individuate l’unica associazione errata e indicate quale livello TCP/IP deve essere indicato al suo posto.</p>
   <CodeBox>MAC → Collegamento dati
IP → Rete
TCP 443 → Rete
HTTPS → Applicazione</CodeBox>
   <Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="elemento errato → collocazione corretta"/>
  </Panel>
  <Panel title="MISSIONE 09 · STESSO IP, NUOVO FRAME">
   <p className="instruction">Spiegate, riferendovi al forwarding di R1, perché l’IP di destinazione del pacchetto resta quello del server mentre gli indirizzi MAC del frame vengono ricostruiti sul nuovo collegamento.</p>
   <Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="spiegazione tecnica"/>
  </Panel>
  <Panel title="MISSIONE 10 · AUTOPSIA DELLA CATTURA">
   <p className="instruction">Usando tutti gli indizi forniti, ricostruite la pila della comunicazione indicando, nell’ordine, protocollo applicativo, protocollo di trasporto, IP e frame Ethernet. Indicate anche perché la porta 443 identifica TCP.</p>
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
   <p className="instruction">Tra i quattro candidati, individuate quale può essere l’indirizzo di rete di una subnet /27. Indicate anche la dimensione del blocco e spiegate perché gli altri candidati non sono allineati al confine di rete.</p><CodeBox>Candidati:
192.168.40.192
192.168.40.194
192.168.40.198
192.168.40.201</CodeBox><Input value={a[p(3)]||''} onChange={v=>set(p(3),v)} placeholder="network corretta + calcolo del block size"/></Panel>
  <Panel title="MISSIONE 04 · CONFINE /26"><p className="instruction">Calcolate il broadcast di 192.168.40.128/26 e spiegate come avete ricavato il confine.</p><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="broadcast + ragionamento"/></Panel>
  <Panel title="MISSIONE 05 · HOST O RETE?"><p className="instruction">Determinate a quale delle due subnet appartiene 192.168.40.190. Per giustificare la risposta, indicate l’intervallo di indirizzi coperto da ciascuna subnet.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="subnet + intervallo"/></Panel>
  <Panel title="MISSIONE 06 · ALLINEAMENTO"><p className="instruction">Spiegate perché 192.168.40.192 è allineato al confine di una /27 mentre 192.168.40.194 è un indirizzo interno allo stesso blocco e quindi non può essere il network address.</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="spiegazione con multipli"/></Panel>
  <Panel title="MISSIONE 07 · PROGETTO MINIMO"><p className="instruction">Per 50 host ordinari, calcolate il prefisso minimo che lascia abbastanza indirizzi utilizzabili. Mostrate anche perché il prefisso immediatamente più piccolo non è sufficiente.</p><Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="/xx + 2^n ≥ H+2"/></Panel>
  <Panel title="MISSIONE 08 · ULTIMO HOST"><p className="instruction">Per 10.10.8.64/27 calcolate network, broadcast e ultimo host. Inserite tutti e tre.</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="network | broadcast | ultimo host"/></Panel>
  <Panel title="MISSIONE 09 · OVERLAP"><p className="instruction">Verificate se 10.0.0.0/25 e 10.0.0.96/27 si sovrappongono. Indicate gli intervalli dei due blocchi e spiegate perché questa sovrapposizione rende invalida l’assegnazione a due reparti distinti.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="intervalli + tipo di errore"/></Panel>
  <Panel title="MISSIONE 10 · CRESCITA SENZA /24"><p className="instruction">Un reparto passa a 62 host ordinari. Determinate il prefisso minimo, gli indirizzi totali e gli host utilizzabili.</p><Input value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="/xx | totali | utilizzabili"/></Panel>
 </>

 if(roomId===3)return <>
  <Panel title="MISSIONE 03 · MASCHERA /22"><p className="instruction">Convertite /22 in decimale puntato e indicate il block size nell'ottetto interessante.</p><Input value={a[p(3)]||''} onChange={v=>set(p(3),v)} placeholder="255.x.x.x | block size"/></Panel>
  <Panel title="MISSIONE 04 · DOPO LA SUPERNET"><p className="instruction">172.16.32.0/22 contiene quattro /24. Qual è la prima rete /24 esterna? Dimostrate l'intervallo coperto.</p><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="rete successiva + intervallo"/></Panel>
  <Panel title="MISSIONE 05 · LONGEST PREFIX MATCH"><p className="instruction">Per 10.20.30.77 esistono /8, /16 e /24. Scrivete quale viene scelta e perché.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="prefisso + regola"/></Panel>
  <Panel title="MISSIONE 06 · AGGREGAZIONE VALIDATA"><p className="instruction">Tra i quattro intervalli indicati, individuate l’unico blocco di quattro reti /24 che può essere rappresentato da una /22. Indicate quale blocco scegliete e verificate sia la contiguità sia l’allineamento richiesto per /22.</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="blocco + spiegazione"/></Panel>
  <Panel title="MISSIONE 07 · ROUTE LEAK"><p className="instruction">Se una supernet comprende anche una rete che non dovrebbe essere raggiunta tramite quell’annuncio, indicate quale problema di instradamento può verificarsi e che cosa può accadere al traffico destinato a quella rete estranea.</p><Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="conseguenza sul traffico"/></Panel>
  <Panel title="MISSIONE 08 · DUE /24, UNA ROTTA"><p className="instruction">10.20.32.0/24 e 10.20.33.0/24 devono essere riassunte. Calcolate la supernet e il numero di indirizzi totali.</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="supernet | indirizzi"/></Panel>
  <Panel title="MISSIONE 09 · PERCHÉ AGGREGARE?"><p className="instruction">Spiegate quale effetto produce la summarization sul numero e sull’ampiezza degli annunci di routing. Indicate anche quale informazione aggregata viene resa visibile agli altri router.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="effetto tecnico"/></Panel>
  <Panel title="MISSIONE 10 · 172.16.32.0/22 SOTTO ESAME"><p className="instruction">Calcolate network, broadcast, numero di /24 contenute e primo /24 esterno.</p><Input value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="network | broadcast | /24 | esterno"/></Panel>
 </>

 if(roomId===4)return <>
  <Panel title="MISSIONE 04 · LA DEFAULT NON È UNA SCORCIATOIA"><p className="instruction">Considerando le rotte mostrate, indicate quando viene scelta 0.0.0.0/0: specificate la condizione rispetto alle rotte più specifiche presenti nella tabella.</p><CodeBox>10.20.30.0/24 via 10.0.1.2
10.30.0.0/16 via 10.0.2.2
0.0.0.0/0 via 10.0.0.2</CodeBox><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="regola di selezione"/></Panel>
  <Panel title="MISSIONE 05 · TTL RESIDUO"><p className="instruction">Un pacchetto parte con TTL=3 e attraversa due router. Calcolate il TTL dopo il secondo forwarding e indicate cosa accadrebbe al successivo.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="TTL residuo | conseguenza"/></Panel>
  <Panel title="MISSIONE 06 · TIME EXCEEDED"><p className="instruction">Spiegate cosa permette a traceroute di scoprire quando un router restituisce ICMP Time Exceeded.</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="TTL + ICMP + hop"/></Panel>
  <Panel title="MISSIONE 07 · NEXT-HOP NASCOSTO"><p className="instruction">Rotta: 192.168.20.0/24 via 10.0.1.2. Spiegate cosa rappresenta 10.0.1.2 e perché non è l'IP della rete destinazione.</p><Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="definizione + spiegazione"/></Panel>
  <Panel title="MISSIONE 08 · L'INTERFACCIA PRIMA DI TUTTO"><p className="instruction">La route verso la destinazione è presente, ma il collegamento verso il next-hop è down. Indicate in ordine almeno tre verifiche: stato dell’interfaccia, raggiungibilità del next-hop e presenza/coerenza della route.</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="1. … 2. … 3. …"/></Panel>
  <Panel title="MISSIONE 09 · L'HOP FANTASMA"><p className="instruction">Nella traccia il terzo hop mostra * * *. Indicate due possibili motivi per cui non compare una risposta e spiegate perché gli asterischi, da soli, non dimostrano che il router sia assente.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="interpretazione precisa"/></Panel>
  <Panel title="MISSIONE 10 · AUTOPSIA DEL PERCORSO"><p className="instruction">Dopo il gateway locale e R2 non arrivano più risposte. Indicate due fonti di diagnostica da consultare e, per ciascuna, specificate quale informazione cerchereste per individuare il punto del guasto.</p><Input value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="due fonti + evidenza da cercare"/></Panel>
 </>

 if(roomId===5)return <>
  <Panel title="MISSIONE 04 · ENTRA NELLA MODALITÀ GIUSTA"><p className="instruction">Partendo da R5&gt;, scrivete la sequenza minima per arrivare a R5(config-if)# su Gi0/2.</p><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="comando → comando → comando"/></Panel>
  <Panel title="MISSIONE 05 · CONFIGURAZIONE GLOBALE"><p className="instruction">Partendo dal prompt R5#, indicate il comando che porta a R5(config)# e spiegate perché il comando enable non è necessario quando si è già in modalità privilegiata.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="comando + spiegazione"/></Panel>
  <Panel title="MISSIONE 06 · INTERFACCIA SPENTA"><p className="instruction">L’interfaccia è indicata come administratively down/down. Indicate il comando che la riattiva e il prompt/modalità IOS in cui deve essere eseguito.</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="modalità + comando"/></Panel>
  <Panel title="MISSIONE 07 · PRIMA FOTOGRAFIA"><p className="instruction">Prima di modificare il router, indicate il comando IOS che mostra rapidamente stato e indirizzi di tutte le interfacce. Spiegate perché è il controllo più diretto per un sintomo administratively down/down.</p><Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="comando + motivazione"/></Panel>
  <Panel title="MISSIONE 08 · LA ROUTING TABLE"><p className="instruction">Dopo la riattivazione di Gi0/2, indicate il comando per verificare la routing table e la route attesa verso 192.168.60.0/24.</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="comando + rete attesa"/></Panel>
  <Panel title="MISSIONE 09 · NEXT-HOP IRRAGGIUNGIBILE"><p className="instruction">Una static route punta a 10.0.6.2 ma Gi0/2 è down. Ricostruite la relazione tra il problema, la correzione e la verifica.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="sintomo → causa → fix → verifica"/></Panel>
  <Panel title="MISSIONE 10 · TROUBLESHOOTING SENZA INDOVINARE"><p className="instruction">Avete un solo tentativo di modifica. Indicate quali informazioni raccogliereste prima di intervenire e spiegate perché.</p><Input value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="ordine + evidenze"/></Panel>
 </>

 if(roomId===6)return <>
  <Panel title="MISSIONE 04 · TRUNK, MA DIMOSTRALO"><p className="instruction">Sul collegamento tra i due switch devono viaggiare contemporaneamente VLAN 10, 20 e 30. Indicate quale configurazione del collegamento è necessaria e motivatela.</p><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="modalità + motivazione"/></Panel>
  <Panel title="MISSIONE 05 · BROADCAST DOMAIN TEST"><p className="instruction">Se PC-A, appartenente a VLAN 10, invia un broadcast, indicate se PC-B della VLAN 20 lo riceve e spiegate perché le VLAN separano i domini di broadcast.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="chi riceve + perché"/></Panel>
  <Panel title="MISSIONE 06 · ROUTER-ON-A-STICK"><p className="instruction">Per un pacchetto inviato da VLAN 20 verso un host della VLAN 30, descrivete il percorso completo e indicate dove avviene il routing.</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="PC → switch → ... → PC"/></Panel>
  <Panel title="MISSIONE 07 · GATEWAY DA RICAVARE"><p className="instruction">Per l’host 192.168.30.20/24 in VLAN30, indicate il gateway e motivate la scelta.</p><Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="gateway + spiegazione"/></Panel>
  <Panel title="MISSIONE 08 · DHCP FORENSICS"><p className="instruction">Per un client che non possiede ancora un indirizzo IP, scrivete nell’ordine i quattro messaggi DHCP e indicate quale messaggio contiene l’offerta e quale conferma definitivamente l’assegnazione scelta dal client.</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="DISCOVER → OFFER → … → …"/></Panel>
  <Panel title="MISSIONE 09 · VLAN ALLOWED"><p className="instruction">Il trunk è operativo e VLAN 10 attraversa il collegamento, ma VLAN 30 no. Indicate quale controllo effettuereste sul trunk e motivate la scelta.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="controllo + motivazione"/></Panel>
  <Panel title="MISSIONE 10 · INTER-VLAN FORENSICS"><p className="instruction">Per PC-A 192.168.10.20/24 → SERVER 192.168.30.50/24, descrivete il percorso distinguendo passaggi L2 e L3. Indicate esplicitamente in quale momento PC-A utilizza il proprio default gateway.</p><Input value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="percorso completo"/></Panel>
 </>

 if(roomId===7)return <>
  <Panel title="MISSIONE 04 · CALCOLA IL ROOT PATH"><p className="instruction">Con SW1 come root, considerate i due percorsi disponibili da SW2 verso SW1. Indicate il costo di ciascun percorso e quale viene scelto.</p><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="10 vs 110 → scelta"/></Panel>
  <Panel title="MISSIONE 05 · ROOT PORT DI SW3"><p className="instruction">Con SW1 come root, indicate il root port di SW3 e il costo del percorso scelto.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="porta + costo verso root"/></Panel>
  <Panel title="MISSIONE 06 · IL LINK DA BLOCCARE"><p className="instruction">Nel triangolo indicato, indicate quale porta/link sul collegamento SW2–SW3 deve risultare alternate/blocking e motivate la scelta.</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="link + motivazione STP"/></Panel>
  <Panel title="MISSIONE 07 · TIE-BREAK"><p className="instruction">Se due percorsi hanno lo stesso costo verso la root, indicate quale identificatore del BPDU viene confrontato nel passo successivo della selezione STP e specificate quale valore viene preferito.</p><Input value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="identificatore + regola"/></Panel>
  <Panel title="MISSIONE 08 · FAILURE TEST"><p className="instruction">Dopo la caduta di SW2–SW1, indicate quale stato deve assumere il collegamento SW2–SW3 per ristabilire il percorso verso la root e motivate la risposta.</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="stato → stato + motivo"/></Panel>
  <Panel title="MISSIONE 09 · PERCHÉ STP?" className="mission-dark"><p className="instruction">Se tutti e tre i link del triangolo rimanessero contemporaneamente in forwarding, descrivete che cosa accadrebbe ai frame broadcast e perché questo può causare un loop di livello 2.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="effetto sui frame broadcast"/></Panel>
  <Panel title="MISSIONE 10 · STP LIVE"><p className="instruction">Utilizzate la simulazione STP per analizzare il triangolo, stabilizzare la rete e verificare il comportamento dopo la caduta del link principale. Riportate le decisioni prese.</p><Input value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="decisione 1 → 2 → 3 → 4"/></Panel>
 </>

 if(roomId===8)return <>
  <Panel title="MISSIONE 03 · CONFIGURA SENZA GUI"><p className="instruction">Partendo da R1&gt;, scrivete la sequenza minima per configurare Gi0/0 con 192.168.10.1/24 e renderla attiva.</p><Input value={a[p(3)]||''} onChange={v=>set(p(3),v)} placeholder="enable → ..."/></Panel>
  <Panel title="MISSIONE 04 · INTERFACCIA OPERATIVA"><p className="instruction">Per un’interfaccia in stato administratively down, indicate il comando per riattivarla, la modalità IOS in cui va eseguito e il comando di verifica.</p><Input value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="comando | verifica"/></Panel>
  <Panel title="MISSIONE 05 · ROTTA STATICA"><p className="instruction">Scrivete il comando IOS completo per aggiungere una rotta statica verso 192.168.20.0/24 usando 10.0.0.2 come next-hop.</p><Input value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="ip route ..."/></Panel>
  <Panel title="MISSIONE 06 · PROVA END-TO-END"><p className="instruction">Indicate un comando per verificare il raggiungimento di un host remoto e un comando per individuare il punto in cui il percorso si interrompe.</p><Input value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="test 1 | test 2"/></Panel>
  <Panel title="MISSIONE 07 · ORDINE DI CONFIGURAZIONE"><p className="instruction">Scrivete nell'ordine corretto le operazioni necessarie per configurare Gi0/0 partendo da R1&gt;.</p><Stepper value={a[p(7)]||''} onChange={v=>set(p(7),v)} max={6}/><Input value={a[p(7)+'x']||''} onChange={v=>set(p(7)+'x',v)} placeholder="sequenza comandi"/></Panel>
  <Panel title="MISSIONE 08 · DEFAULT ROUTE"><p className="instruction">Scrivete il comando IOS completo per configurare 0.0.0.0/0 con next-hop 10.0.0.2. Poi indicate la condizione che deve verificarsi perché questa route venga utilizzata: assenza di una rotta più specifica.</p><Input value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="comando + condizione"/></Panel>
  <Panel title="MISSIONE 09 · VERIFICA DELLA ROUTE"><p className="instruction">Indicate due comandi IOS: uno per verificare la presenza della static route nella configurazione e uno per verificarne la presenza nella routing table.</p><Input value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="comando 1 + comando 2"/></Panel>
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
• Exactly one suspect's known access pattern is consistent with ALL events.</CodeBox><p className="instruction">Selezionate almeno tre evidenze dal dossier e usatele per motivare la scelta del sospettato.</p></div>}
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
