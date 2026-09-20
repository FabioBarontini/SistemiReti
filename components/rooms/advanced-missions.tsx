'use client'
import React, {useState} from 'react'

type Answers = Record<string,string>
function Panel({title,children,className='' }:{title:string;children:React.ReactNode;className?:string}){return <section className={`challenge-panel mission-panel ${className}`}><div className="panel-head"><span>{title}</span><i/></div>{children}</section>}
function Input({value,onChange,placeholder}:{value:string;onChange:(v:string)=>void;placeholder?:string}){return <input className="answer-input" value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>}
function Select({value,onChange,options,placeholder='Seleziona…'}:{value:string;onChange:(v:string)=>void;options:{value:string;label:string}[];placeholder?:string}){return <select className="answer-input" value={value||''} onChange={e=>onChange(e.target.value)}><option value="">{placeholder}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>}

const optionSets: Record<string,string[]> = {
 'm1_3':['Header Ethernet','Header IP','Header TCP','Payload applicativo'], 'm1_3b':['no','sì'], 'm1_4':['Trasporto','Rete','Applicazione','Collegamento dati'], 'm1_5':['Messaggio → Segmento → Pacchetto → Frame','Messaggio → Pacchetto → Segmento → Frame','Frame → Pacchetto → Segmento → Messaggio'], 'm1_6':['Router + tabella di routing','Switch + tabella MAC','Server + DNS','Access point + DHCP'], 'm1_7':['Ethernet → IP → TCP','TCP → IP → Ethernet','IP → Ethernet → TCP'], 'm1_8':['TCP 443 → Trasporto','TCP 443 → Rete','HTTPS 443 → Applicazione'], 'm1_9':['Header Ethernet + il frame è locale al collegamento mentre l IP resta end-to-end','Gli indirizzi IP cambiano a ogni router perché il pacchetto viene ricreato','MAC e IP restano entrambi invariati end-to-end'], 'm1_10':['HTTPS → TCP → IP → Ethernet','HTTPS → IP → TCP → Ethernet','Ethernet → IP → TCP → HTTPS'],
 'm2_3':['192.168.40.192 + block size 32','192.168.40.194 + block size 32','192.168.40.201 + block size 32'], 'm2_4':['192.168.40.191 + /26 ha blocchi di 64 indirizzi','192.168.40.192 + /26 ha blocchi di 32 indirizzi','192.168.40.190 + /26 ha blocchi di 64 indirizzi'], 'm2_5':['192.168.40.128/26 + 192.168.40.128–191','192.168.40.192/27 + 192.168.40.192–223','192.168.40.0/26 + 192.168.40.0–63'], 'm2_6':['/27 ha multipli di 32: 192 è multiplo, 194 no','/27 ha multipli di 16: 192 è multiplo, 194 no','/27 ha multipli di 64: 192 è multiplo, 194 no'], 'm2_7':['/26 + 64 indirizzi: /27 offre solo 32 e non basta','/27 + 32 indirizzi: /28 offre 16 e non basta','/25 + 128 indirizzi: /26 offre 64 e non basta'], 'm2_8':['10.10.8.64 | 10.10.8.95 | 10.10.8.94','10.10.8.64 | 10.10.8.96 | 10.10.8.95','10.10.8.32 | 10.10.8.63 | 10.10.8.62'], 'm2_9':['10.0.0.0/25 copre .0–.127 e contiene 10.0.0.96/27: sovrapposizione','10.0.0.0/25 copre .0–.127 e 10.0.0.96/27 è esterna','10.0.0.96/27 contiene tutta la /25'], 'm2_10':['/26 | 64 | 62','/27 | 32 | 30','/25 | 128 | 126'],
 'm3_3':['255.255.252.0 | block size 4','255.255.255.0 | block size 1','255.255.248.0 | block size 8'], 'm3_4':['172.16.36.0/24 | 172.16.32.0–172.16.35.255','172.16.35.0/24 | 172.16.32.0–172.16.35.255','172.16.40.0/24 | 172.16.32.0–172.16.39.255'], 'm3_5':['/24 | longest prefix match','/16 | shortest prefix match','/8 | default match'], 'm3_6':['192.168.8–11 | contigue e allineate a 4 reti /24','192.168.8–11 | contigue ma non allineate','192.168.8–12 | cinque reti /24'], 'm3_7':['Può attirare traffico verso una rete estranea producendo un percorso non appropriato/blackhole','Può eliminare automaticamente la rete estranea dalla tabella','Può aumentare la banda disponibile per la rete estranea'], 'm3_8':['10.20.32.0/23 | 512 indirizzi','10.20.32.0/24 | 256 indirizzi','10.20.31.0/23 | 512 indirizzi'], 'm3_9':['Riduce il numero di prefissi negli annunci di routing','Aumenta il numero di prefissi per ogni router','Sostituisce il routing con il DNS'], 'm3_10':['172.16.32.0 | 172.16.35.255 | 4 | 172.16.36.0/24','172.16.32.0 | 172.16.36.255 | 5 | 172.16.37.0/24','172.16.31.0 | 172.16.34.255 | 4 | 172.16.35.0/24'],
 'm4_4':['Si usa quando nessuna rotta più specifica corrisponde','Si usa sempre prima delle rotte specifiche','Si usa solo per reti direttamente connesse'], 'm4_5':['1 | al successivo forwarding diventerebbe 0 e il router scarta il pacchetto','2 | al successivo forwarding resterebbe 1','4 | il TTL non cambia nei router'], 'm4_6':['Il TTL scade e il router invia ICMP Time Exceeded, rivelando quell hop','Il router invia DHCP e rivela il proprio indirizzo','Il router modifica l IP destinazione e continua il forwarding'], 'm4_7':['È l indirizzo del router successivo a cui consegnare il pacchetto, non la rete destinazione','È sempre l indirizzo della rete destinazione','È l indirizzo MAC della destinazione finale'], 'm4_8':['1. stato interfaccia 2. raggiungibilità next-hop 3. routing table','1. DNS 2. DHCP 3. MAC table','1. HTTP 2. TCP 3. DNS'], 'm4_9':['Il probe non ha ricevuto risposta entro il timeout; il router può filtrare ICMP o non rispondere','Il router ha necessariamente spento la propria interfaccia','Il pacchetto è arrivato sicuramente a destinazione'], 'm4_10':['Routing table di R2/R3 + stato interfacce/next-hop; cercare rotta verso destinazione e link down','Solo il DNS del client e la cache ARP','Solo la tabella MAC dello switch'],
 'm5_4':['enable → configure terminal → interface g0/2','configure terminal → enable → interface g0/2','enable → interface g0/2 → configure terminal'], 'm5_5':['configure terminal | perché siamo già in privileged EXEC','enable | perché siamo in user EXEC','show ip route | perché siamo in configuration mode'], 'm5_6':['interface g0/2 + no shutdown | interface configuration mode','show ip route + no shutdown | privileged EXEC','configure terminal + ping | global configuration mode'], 'm5_7':['show ip interface brief | mostra stato e indirizzi rapidamente','show ip route | mostra solo le interfacce','show running-config | mostra esclusivamente lo stato fisico'], 'm5_8':['show ip route | 192.168.60.0/24 via 10.0.6.2','show ip interface brief | 192.168.60.0/24 via 10.0.6.2','show arp | 192.168.60.0/24 via 10.0.6.2'], 'm5_9':['administratively down → interfaccia non operativa → no shutdown → show ip interface brief','up/up → route assente → shutdown → ping','down/down → cambiare VLAN → show arp'], 'm5_10':['show ip interface brief → show ip route → running-config; cercare Gi0/2 down, route 192.168.60.0/24 e next-hop 10.0.6.2','show arp → show vlan → show mac address-table','ping → nslookup → show cdp neighbors'],
 'm6_4':['Trunk 802.1Q | una access appartiene a una sola VLAN','Access | una porta access trasporta tutte le VLAN','Routed port | una access appartiene a tutte le VLAN'], 'm6_5':['PC-A non invia il broadcast a PC-B | le VLAN separano i domini di broadcast','PC-A invia sempre il broadcast a tutte le VLAN','Le VLAN eliminano soltanto i pacchetti unicast'], 'm6_6':['PC → access port → trunk 802.1Q → subinterfaccia router → trunk → access port → PC','PC → access port → access port → router → PC','PC → trunk → DNS → access port → PC'], 'm6_7':['192.168.30.1 | .255 è broadcast e non assegnabile','192.168.30.255 | .1 è broadcast','192.168.30.0 | .1 è broadcast'], 'm6_8':['DHCPDISCOVER → DHCPOFFER → DHCPREQUEST → DHCPACK','DHCPOFFER → DHCPDISCOVER → DHCPACK → DHCPREQUEST','DHCPREQUEST → DHCPDISCOVER → DHCPOFFER → DHCPACK'], 'm6_9':['Allowed VLAN sul trunk | perché VLAN10 passa ma VLAN30 viene filtrata','Access VLAN sul PC | perché VLAN10 passa','Native VLAN | perché tutte le VLAN sono sempre consentite'], 'm6_10':['PC-A → switch VLAN10 → gateway L3 → routing → gateway VLAN30 → switch → SERVER','PC-A → switch VLAN10 → switch VLAN30 → SERVER senza routing','PC-A → DNS → DHCP → SERVER'],
 'm7_4':['10 vs 110 → diretto SW2→SW1','110 vs 10 → percorso via SW3','10 vs 100 → percorso via SW3'], 'm7_5':['Porta verso SW1 | costo 10','Porta verso SW3 | costo 100','Nessuna porta: SW3 è root'], 'm7_6':['SW2–SW3 | è il collegamento ridondante con costo 100','SW1–SW2 | è il collegamento ridondante','SW1–SW3 | è il collegamento con costo 100'], 'm7_7':['Bridge ID del mittente','IP sorgente del pacchetto','MAC della destinazione finale'], 'm7_8':['SW2–SW3 passa da blocking/alternate a forwarding dopo la riconvergenza','SW2–SW3 resta sempre blocking anche dopo il guasto','SW2–SW1 resta forwarding senza alcuna riconvergenza'], 'm7_9':['Senza blocking i frame di livello 2 possono circolare nel loop e moltiplicarsi','Senza blocking i frame diventano automaticamente unicast','Senza blocking il router assegna nuovi IP'], 'm7_10':['Root SW1 → root ports SW2/SW3 verso SW1 → SW2-SW3 blocking → caduta SW2-SW1 → SW2-SW3 forwarding','Root SW2 → root ports verso SW3 → SW1 blocking → caduta SW2-SW1 → SW1 forwarding','Root SW3 → tutti i link forwarding → caduta SW2-SW1 → nessun cambiamento'],
 'm8_4':['interface g0/0 → no shutdown | show ip interface brief','enable → ping → show ip route','show running-config → shutdown → ping'], 'm8_6':['ping host remoto | traceroute host remoto','show ip route | show arp','nslookup host remoto | ipconfig'], 'm8_8':['ip route 0.0.0.0 0.0.0.0 10.0.0.2 | quando nessuna rotta più specifica corrisponde','ip route 0.0.0.0 255.255.255.255 10.0.0.2 | sempre','ip default-gateway 10.0.0.2 | quando esiste una rotta più specifica'], 'm8_9':['show running-config | show ip route','show arp | show vlan','ping | traceroute']
}

function AnswerField({k,value,onChange,placeholder}:{k:string;value:string;onChange:(v:string)=>void;placeholder?:string}){const opts=optionSets[k]; return opts ? <Select value={value} onChange={onChange} options={opts.map(x=>({value:x,label:x}))}/> : <Input value={value} onChange={onChange} placeholder={placeholder}/>} 
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
   <div className="answer-pair"><label>Quale informazione viene ricostruita a ogni nuovo collegamento?</label><AnswerField k={p(3)} value={a[p(3)]||''} onChange={v=>set(p(3),v)} placeholder="nome dell'header…"/><label>Gli IP di destinazione cambiano durante il semplice forwarding?</label><Select value={a[p(3)+'b']||''} onChange={v=>set(p(3)+'b',v)} options={[{value:'no',label:'No'},{value:'sì',label:'Sì'}]}/></div>
  </Panel>
  <Panel title="MISSIONE 04 · PORTA 443 SOTTO INTERROGATORIO">
   <p className="instruction">La cattura mostra TCP con porta destinazione 443. Indicate a quale livello TCP/IP appartiene il campo porta e spiegate in una frase perché HTTPS, invece, identifica il protocollo applicativo.</p>
   <CodeBox>Ethernet {`{`} IP {`{`} TCP {`{`} dst port 443 {`}`} {`}`} {`}`}</CodeBox>
   <AnswerField k={p(4)} value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="livello + spiegazione breve"/>
  </Panel>
  <Panel title="MISSIONE 05 · LA CATENA DI INCAPSULAMENTO">
   <p className="instruction">Partendo dal dato dell’applicazione, scrivete nell’ordine le PDU generate durante l’incapsulamento fino al frame Ethernet. Usate i nomi corretti delle PDU TCP/IP.</p>
   <AnswerField k={p(5)} value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="Messaggio → … → … → …"/>
  </Panel>
  <Panel title="MISSIONE 06 · CHI DECIDE LA STRADA">
   <p className="instruction">R1 deve inoltrare un pacchetto destinato a 10.20.30.77. Indicate quale dispositivo sta prendendo la decisione e quale struttura dati deve consultare per scegliere l’interfaccia/next-hop.</p>
   <AnswerField k={p(6)} value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="dispositivo + struttura"/>
  </Panel>
  <Panel title="MISSIONE 07 · DECOSTRUZIONE">
   <p className="instruction">Il server riceve il frame Ethernet. Indicate l’ordine dei livelli durante la decapsulazione, dal frame Ethernet fino ai dati dell’applicazione.</p>
   <AnswerField k={p(7)} value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="Ethernet → … → …"/>
  </Panel>
  <Panel title="MISSIONE 08 · TROVA L'INCOERENZA">
   <p className="instruction">Nel blocco sono presenti quattro associazioni elemento→livello. Individuate l’unica associazione errata e indicate quale livello TCP/IP deve essere indicato al suo posto.</p>
   <CodeBox>MAC → Collegamento dati
IP → Rete
TCP 443 → Rete
HTTPS → Applicazione</CodeBox>
   <AnswerField k={p(8)} value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="elemento errato → collocazione corretta"/>
  </Panel>
  <Panel title="MISSIONE 09 · STESSO IP, NUOVO FRAME">
   <p className="instruction">Spiegate, riferendovi al forwarding di R1, perché l’IP di destinazione del pacchetto resta quello del server mentre gli indirizzi MAC del frame vengono ricostruiti sul nuovo collegamento.</p>
   <AnswerField k={p(9)} value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="spiegazione tecnica"/>
  </Panel>
  <Panel title="MISSIONE 10 · AUTOPSIA DELLA CATTURA">
   <p className="instruction">Usando tutti gli indizi forniti, ricostruite la pila della comunicazione indicando, nell’ordine, protocollo applicativo, protocollo di trasporto, IP e frame Ethernet. Indicate anche perché la porta 443 identifica TCP.</p>
   <CodeBox>dst TCP = 443
protocollo applicativo = HTTPS
IP src = 192.168.10.20
IP dst = 172.16.40.20
MAC dst sul primo link = gateway</CodeBox>
   <AnswerField k={p(10)} value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="HTTPS → … → … → Ethernet + spiegazione"/>
  </Panel>
 </>

 if(roomId===2)return <>
  <Panel title="MISSIONE 03 · IL BLOCCO DA 32">
   <p className="instruction">Tra i quattro candidati, individuate quale può essere l’indirizzo di rete di una subnet /27. Indicate anche la dimensione del blocco e spiegate perché gli altri candidati non sono allineati al confine di rete.</p><CodeBox>Candidati:
192.168.40.192
192.168.40.194
192.168.40.198
192.168.40.201</CodeBox><AnswerField k={p(3)} value={a[p(3)]||''} onChange={v=>set(p(3),v)} placeholder="network corretta + calcolo del block size"/></Panel>
  <Panel title="MISSIONE 04 · CONFINE /26"><p className="instruction">Calcolate il broadcast di 192.168.40.128/26 e spiegate come avete ricavato il confine.</p><AnswerField k={p(4)} value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="broadcast + ragionamento"/></Panel>
  <Panel title="MISSIONE 05 · HOST O RETE?"><p className="instruction">Determinate a quale delle due subnet appartiene 192.168.40.190. Per giustificare la risposta, indicate l’intervallo di indirizzi coperto da ciascuna subnet.</p><AnswerField k={p(5)} value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="subnet + intervallo"/></Panel>
  <Panel title="MISSIONE 06 · ALLINEAMENTO"><p className="instruction">Spiegate perché 192.168.40.192 è allineato al confine di una /27 mentre 192.168.40.194 è un indirizzo interno allo stesso blocco e quindi non può essere il network address.</p><AnswerField k={p(6)} value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="spiegazione con multipli"/></Panel>
  <Panel title="MISSIONE 07 · PROGETTO MINIMO"><p className="instruction">Per 50 host ordinari, calcolate il prefisso minimo che lascia abbastanza indirizzi utilizzabili. Mostrate anche perché il prefisso immediatamente più piccolo non è sufficiente.</p><AnswerField k={p(7)} value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="/xx + 2^n ≥ H+2"/></Panel>
  <Panel title="MISSIONE 08 · ULTIMO HOST"><p className="instruction">Per 10.10.8.64/27 calcolate network, broadcast e ultimo host. Inserite tutti e tre.</p><AnswerField k={p(8)} value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="network | broadcast | ultimo host"/></Panel>
  <Panel title="MISSIONE 09 · OVERLAP"><p className="instruction">Verificate se 10.0.0.0/25 e 10.0.0.96/27 si sovrappongono. Indicate gli intervalli dei due blocchi e spiegate perché questa sovrapposizione rende invalida l’assegnazione a due reparti distinti.</p><AnswerField k={p(9)} value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="intervalli + tipo di errore"/></Panel>
  <Panel title="MISSIONE 10 · CRESCITA SENZA /24"><p className="instruction">Un reparto passa a 62 host ordinari. Determinate il prefisso minimo, gli indirizzi totali e gli host utilizzabili.</p><AnswerField k={p(10)} value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="/xx | totali | utilizzabili"/></Panel>
 </>

 if(roomId===3)return <>
  <Panel title="MISSIONE 03 · MASCHERA /22"><p className="instruction">Convertite /22 in decimale puntato e indicate il block size nell'ottetto interessante.</p><AnswerField k={p(3)} value={a[p(3)]||''} onChange={v=>set(p(3),v)} placeholder="255.x.x.x | block size"/></Panel>
  <Panel title="MISSIONE 04 · DOPO LA SUPERNET"><p className="instruction">172.16.32.0/22 contiene quattro /24. Qual è la prima rete /24 esterna? Dimostrate l'intervallo coperto.</p><AnswerField k={p(4)} value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="rete successiva + intervallo"/></Panel>
  <Panel title="MISSIONE 05 · LONGEST PREFIX MATCH"><p className="instruction">Per 10.20.30.77 esistono /8, /16 e /24. Scrivete quale viene scelta e perché.</p><AnswerField k={p(5)} value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="prefisso + regola"/></Panel>
  <Panel title="MISSIONE 06 · AGGREGAZIONE VALIDATA"><p className="instruction">Tra i quattro intervalli indicati, individuate l’unico blocco di quattro reti /24 che può essere rappresentato da una /22. Indicate quale blocco scegliete e verificate sia la contiguità sia l’allineamento richiesto per /22.</p><AnswerField k={p(6)} value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="blocco + spiegazione"/></Panel>
  <Panel title="MISSIONE 07 · ROUTE LEAK"><p className="instruction">Se una supernet comprende anche una rete che non dovrebbe essere raggiunta tramite quell’annuncio, indicate quale problema di instradamento può verificarsi e che cosa può accadere al traffico destinato a quella rete estranea.</p><AnswerField k={p(7)} value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="conseguenza sul traffico"/></Panel>
  <Panel title="MISSIONE 08 · DUE /24, UNA ROTTA"><p className="instruction">10.20.32.0/24 e 10.20.33.0/24 devono essere riassunte. Calcolate la supernet e il numero di indirizzi totali.</p><AnswerField k={p(8)} value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="supernet | indirizzi"/></Panel>
  <Panel title="MISSIONE 09 · PERCHÉ AGGREGARE?"><p className="instruction">Spiegate quale effetto produce la summarization sul numero e sull’ampiezza degli annunci di routing. Indicate anche quale informazione aggregata viene resa visibile agli altri router.</p><AnswerField k={p(9)} value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="effetto tecnico"/></Panel>
  <Panel title="MISSIONE 10 · 172.16.32.0/22 SOTTO ESAME"><p className="instruction">Calcolate network, broadcast, numero di /24 contenute e primo /24 esterno.</p><AnswerField k={p(10)} value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="network | broadcast | /24 | esterno"/></Panel>
 </>

 if(roomId===4)return <>
  <Panel title="MISSIONE 04 · LA DEFAULT NON È UNA SCORCIATOIA"><p className="instruction">Considerando le rotte mostrate, indicate quando viene scelta 0.0.0.0/0: specificate la condizione rispetto alle rotte più specifiche presenti nella tabella.</p><CodeBox>10.20.30.0/24 via 10.0.1.2
10.30.0.0/16 via 10.0.2.2
0.0.0.0/0 via 10.0.0.2</CodeBox><AnswerField k={p(4)} value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="regola di selezione"/></Panel>
  <Panel title="MISSIONE 05 · TTL RESIDUO"><p className="instruction">Un pacchetto parte con TTL=3 e attraversa due router. Calcolate il TTL dopo il secondo forwarding e indicate cosa accadrebbe al successivo.</p><AnswerField k={p(5)} value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="TTL residuo | conseguenza"/></Panel>
  <Panel title="MISSIONE 06 · TIME EXCEEDED"><p className="instruction">Spiegate cosa permette a traceroute di scoprire quando un router restituisce ICMP Time Exceeded.</p><AnswerField k={p(6)} value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="TTL + ICMP + hop"/></Panel>
  <Panel title="MISSIONE 07 · NEXT-HOP NASCOSTO"><p className="instruction">Rotta: 192.168.20.0/24 via 10.0.1.2. Spiegate cosa rappresenta 10.0.1.2 e perché non è l'IP della rete destinazione.</p><AnswerField k={p(7)} value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="definizione + spiegazione"/></Panel>
  <Panel title="MISSIONE 08 · L'INTERFACCIA PRIMA DI TUTTO"><p className="instruction">La route verso la destinazione è presente, ma il collegamento verso il next-hop è down. Indicate in ordine almeno tre verifiche: stato dell’interfaccia, raggiungibilità del next-hop e presenza/coerenza della route.</p><AnswerField k={p(8)} value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="1. … 2. … 3. …"/></Panel>
  <Panel title="MISSIONE 09 · L'HOP FANTASMA"><p className="instruction">Nella traccia il terzo hop mostra * * *. Indicate due possibili motivi per cui non compare una risposta e spiegate perché gli asterischi, da soli, non dimostrano che il router sia assente.</p><AnswerField k={p(9)} value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="interpretazione precisa"/></Panel>
  <Panel title="MISSIONE 10 · AUTOPSIA DEL PERCORSO"><p className="instruction">Dopo il gateway locale e R2 non arrivano più risposte. Indicate due fonti di diagnostica da consultare e, per ciascuna, specificate quale informazione cerchereste per individuare il punto del guasto.</p><AnswerField k={p(10)} value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="due fonti + evidenza da cercare"/></Panel>
 </>

 if(roomId===5)return <>
  <Panel title="MISSIONE 04 · ENTRA NELLA MODALITÀ GIUSTA"><p className="instruction">Partendo da R5&gt;, scrivete la sequenza minima per arrivare a R5(config-if)# su Gi0/2.</p><AnswerField k={p(4)} value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="comando → comando → comando"/></Panel>
  <Panel title="MISSIONE 05 · CONFIGURAZIONE GLOBALE"><p className="instruction">Partendo dal prompt R5#, indicate il comando che porta a R5(config)# e spiegate perché il comando enable non è necessario quando si è già in modalità privilegiata.</p><AnswerField k={p(5)} value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="comando + spiegazione"/></Panel>
  <Panel title="MISSIONE 06 · INTERFACCIA SPENTA"><p className="instruction">L’interfaccia è indicata come administratively down/down. Indicate il comando che la riattiva e il prompt/modalità IOS in cui deve essere eseguito.</p><AnswerField k={p(6)} value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="modalità + comando"/></Panel>
  <Panel title="MISSIONE 07 · PRIMA FOTOGRAFIA"><p className="instruction">Prima di modificare il router, indicate il comando IOS che mostra rapidamente stato e indirizzi di tutte le interfacce. Spiegate perché è il controllo più diretto per un sintomo administratively down/down.</p><AnswerField k={p(7)} value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="comando + motivazione"/></Panel>
  <Panel title="MISSIONE 08 · LA ROUTING TABLE"><p className="instruction">Dopo la riattivazione di Gi0/2, indicate il comando per verificare la routing table e la route attesa verso 192.168.60.0/24.</p><AnswerField k={p(8)} value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="comando + rete attesa"/></Panel>
  <Panel title="MISSIONE 09 · NEXT-HOP IRRAGGIUNGIBILE"><p className="instruction">Una static route punta a 10.0.6.2 ma Gi0/2 è down. Ricostruite la relazione tra il problema, la correzione e la verifica.</p><AnswerField k={p(9)} value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="sintomo → causa → fix → verifica"/></Panel>
  <Panel title="MISSIONE 10 · TROUBLESHOOTING SENZA INDOVINARE"><p className="instruction">Avete un solo tentativo di modifica. Indicate quali informazioni raccogliereste prima di intervenire e spiegate perché.</p><AnswerField k={p(10)} value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="ordine + evidenze"/></Panel>
 </>

 if(roomId===6)return <>
  <Panel title="MISSIONE 04 · TRUNK, MA DIMOSTRALO"><p className="instruction">Sul collegamento tra i due switch devono viaggiare contemporaneamente VLAN 10, 20 e 30. Indicate quale configurazione del collegamento è necessaria e motivatela.</p><AnswerField k={p(4)} value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="modalità + motivazione"/></Panel>
  <Panel title="MISSIONE 05 · BROADCAST DOMAIN TEST"><p className="instruction">Se PC-A, appartenente a VLAN 10, invia un broadcast, indicate se PC-B della VLAN 20 lo riceve e spiegate perché le VLAN separano i domini di broadcast.</p><AnswerField k={p(5)} value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="chi riceve + perché"/></Panel>
  <Panel title="MISSIONE 06 · ROUTER-ON-A-STICK"><p className="instruction">Per un pacchetto inviato da VLAN 20 verso un host della VLAN 30, descrivete il percorso completo e indicate dove avviene il routing.</p><AnswerField k={p(6)} value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="PC → switch → ... → PC"/></Panel>
  <Panel title="MISSIONE 07 · GATEWAY DA RICAVARE"><p className="instruction">Per l’host 192.168.30.20/24 in VLAN30, indicate il gateway e motivate la scelta.</p><AnswerField k={p(7)} value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="gateway + spiegazione"/></Panel>
  <Panel title="MISSIONE 08 · DHCP FORENSICS"><p className="instruction">Per un client che non possiede ancora un indirizzo IP, scrivete nell’ordine i quattro messaggi DHCP e indicate quale messaggio contiene l’offerta e quale conferma definitivamente l’assegnazione scelta dal client.</p><AnswerField k={p(8)} value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="DISCOVER → OFFER → … → …"/></Panel>
  <Panel title="MISSIONE 09 · VLAN ALLOWED"><p className="instruction">Il trunk è operativo e VLAN 10 attraversa il collegamento, ma VLAN 30 no. Indicate quale controllo effettuereste sul trunk e motivate la scelta.</p><AnswerField k={p(9)} value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="controllo + motivazione"/></Panel>
  <Panel title="MISSIONE 10 · INTER-VLAN FORENSICS"><p className="instruction">Per PC-A 192.168.10.20/24 → SERVER 192.168.30.50/24, descrivete il percorso distinguendo passaggi L2 e L3. Indicate esplicitamente in quale momento PC-A utilizza il proprio default gateway.</p><AnswerField k={p(10)} value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="percorso completo"/></Panel>
 </>

 if(roomId===7)return <>
  <Panel title="MISSIONE 04 · CALCOLA IL ROOT PATH"><p className="instruction">Con SW1 come root, considerate i due percorsi disponibili da SW2 verso SW1. Indicate il costo di ciascun percorso e quale viene scelto.</p><AnswerField k={p(4)} value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="10 vs 110 → scelta"/></Panel>
  <Panel title="MISSIONE 05 · ROOT PORT DI SW3"><p className="instruction">Con SW1 come root, indicate il root port di SW3 e il costo del percorso scelto.</p><AnswerField k={p(5)} value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="porta + costo verso root"/></Panel>
  <Panel title="MISSIONE 06 · IL LINK DA BLOCCARE"><p className="instruction">Nel triangolo indicato, indicate quale porta/link sul collegamento SW2–SW3 deve risultare alternate/blocking e motivate la scelta.</p><AnswerField k={p(6)} value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="link + motivazione STP"/></Panel>
  <Panel title="MISSIONE 07 · TIE-BREAK"><p className="instruction">Se due percorsi hanno lo stesso costo verso la root, indicate quale identificatore del BPDU viene confrontato nel passo successivo della selezione STP e specificate quale valore viene preferito.</p><AnswerField k={p(7)} value={a[p(7)]||''} onChange={v=>set(p(7),v)} placeholder="identificatore + regola"/></Panel>
  <Panel title="MISSIONE 08 · FAILURE TEST"><p className="instruction">Dopo la caduta di SW2–SW1, indicate quale stato deve assumere il collegamento SW2–SW3 per ristabilire il percorso verso la root e motivate la risposta.</p><AnswerField k={p(8)} value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="stato → stato + motivo"/></Panel>
  <Panel title="MISSIONE 09 · PERCHÉ STP?" className="mission-dark"><p className="instruction">Se tutti e tre i link del triangolo rimanessero contemporaneamente in forwarding, descrivete che cosa accadrebbe ai frame broadcast e perché questo può causare un loop di livello 2.</p><AnswerField k={p(9)} value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="effetto sui frame broadcast"/></Panel>
  <Panel title="MISSIONE 10 · STP LIVE"><p className="instruction">Utilizzate la simulazione STP per analizzare il triangolo, stabilizzare la rete e verificare il comportamento dopo la caduta del link principale. Riportate le decisioni prese.</p><AnswerField k={p(10)} value={a[p(10)]||''} onChange={v=>set(p(10),v)} placeholder="decisione 1 → 2 → 3 → 4"/></Panel>
 </>

 if(roomId===8)return <>
  <Panel title="MISSIONE 03 · CONFIGURA SENZA GUI"><p className="instruction">Partendo da R1&gt;, scrivete la sequenza minima per configurare Gi0/0 con 192.168.10.1/24 e renderla attiva.</p><AnswerField k={p(3)} value={a[p(3)]||''} onChange={v=>set(p(3),v)} placeholder="enable → ..."/></Panel>
  <Panel title="MISSIONE 04 · INTERFACCIA OPERATIVA"><p className="instruction">Per un’interfaccia in stato administratively down, indicate il comando per riattivarla, la modalità IOS in cui va eseguito e il comando di verifica.</p><AnswerField k={p(4)} value={a[p(4)]||''} onChange={v=>set(p(4),v)} placeholder="comando | verifica"/></Panel>
  <Panel title="MISSIONE 05 · ROTTA STATICA"><p className="instruction">Scrivete il comando IOS completo per aggiungere una rotta statica verso 192.168.20.0/24 usando 10.0.0.2 come next-hop.</p><AnswerField k={p(5)} value={a[p(5)]||''} onChange={v=>set(p(5),v)} placeholder="ip route ..."/></Panel>
  <Panel title="MISSIONE 06 · PROVA END-TO-END"><p className="instruction">Indicate un comando per verificare il raggiungimento di un host remoto e un comando per individuare il punto in cui il percorso si interrompe.</p><AnswerField k={p(6)} value={a[p(6)]||''} onChange={v=>set(p(6),v)} placeholder="test 1 | test 2"/></Panel>
  <Panel title="MISSIONE 07 · ORDINE DI CONFIGURAZIONE"><p className="instruction">Scrivete nell'ordine corretto le operazioni necessarie per configurare Gi0/0 partendo da R1&gt;.</p><Stepper value={a[p(7)]||''} onChange={v=>set(p(7),v)} max={6}/><AnswerField k={p(7)+'x'} value={a[p(7)+'x']||''} onChange={v=>set(p(7)+'x',v)} placeholder="sequenza comandi"/></Panel>
  <Panel title="MISSIONE 08 · DEFAULT ROUTE"><p className="instruction">Scrivete il comando IOS completo per configurare 0.0.0.0/0 con next-hop 10.0.0.2. Poi indicate la condizione che deve verificarsi perché questa route venga utilizzata: assenza di una rotta più specifica.</p><AnswerField k={p(8)} value={a[p(8)]||''} onChange={v=>set(p(8),v)} placeholder="comando + condizione"/></Panel>
  <Panel title="MISSIONE 09 · VERIFICA DELLA ROUTE"><p className="instruction">Indicate due comandi IOS: uno per verificare la presenza della static route nella configurazione e uno per verificarne la presenza nella routing table.</p><AnswerField k={p(9)} value={a[p(9)]||''} onChange={v=>set(p(9),v)} placeholder="comando 1 + comando 2"/></Panel>
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
  <div className="helios-final"><div><label>CONCLUSIONE INVESTIGATIVA</label><p>Selezionate il sospettato e poi spiegate la catena tecnica che collega accesso → console → modifica route → modifica VLAN.</p></div><div className="suspect-choice-row">{suspects.map(s=><button type="button" key={s.id} className={selected===s.id?'selected':''} onClick={()=>choose(s.id)}>{s.id} · {s.name}</button>)}</div><Select value={a.helioReason||''} onChange={v=>set('helioReason',v)} options={[{value:'Marta Vieri · accesso alla rete · console R3 alle 02:17 · modifica route alle 02:17 · modifica VLAN alle 02:19',label:'Marta Vieri · accesso alla rete · console R3 alle 02:17 · modifica route alle 02:17 · modifica VLAN alle 02:19'},{value:'Luca Ferri · accesso SOC · console R3 alle 02:17 · modifica VLAN alle 02:19',label:'Luca Ferri · accesso SOC · console R3 alle 02:17 · modifica VLAN alle 02:19'},{value:'Nadia Rinaldi · VPN alle 02:05 · accesso console R3 alle 02:17 · modifica VLAN alle 02:19',label:'Nadia Rinaldi · VPN alle 02:05 · accesso console R3 alle 02:17 · modifica VLAN alle 02:19'}]}/></div>
 </Panel>
}
function toggleEvidence(set:(k:string,v:string)=>void,a:Answers,i:number){set(`he${i}`,a[`he${i}`]==='1'?'':'1')}
