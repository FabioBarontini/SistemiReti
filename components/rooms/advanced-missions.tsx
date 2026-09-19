'use client'
import React from 'react'

type Answers = Record<string,string>
function Panel({title,children}:{title:string;children:React.ReactNode}){return <section className="challenge-panel mission-panel"><div className="panel-head"><span>{title}</span><i/></div>{children}</section>}
function Choice({active,children,onClick}:{active:boolean;children:React.ReactNode;onClick:()=>void}){return <button type="button" className={`choice-card ${active?'selected':''}`} onClick={onClick}>{children}</button>}
function Input({value,onChange,placeholder}:{value:string;onChange:(v:string)=>void;placeholder?:string}){return <input className="answer-input" value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>} 
function Select({value,onChange,options}:{value:string;onChange:(v:string)=>void;options:string[]}){return <select value={value||''} onChange={e=>onChange(e.target.value)}><option value="">scegli…</option>{options.map(x=><option key={x}>{x}</option>)}</select>}

export default function AdvancedMissions({roomId,a,set}:{roomId:number;a:Answers;set:(k:string,v:string)=>void}){
 const p=(n:number)=>`m${roomId}_${n}`
 const common = (n:number,title:string,body:React.ReactNode,field:string,options:string[]) => <Panel title={`MISSIONE ${String(n).padStart(2,'0')} · ${title}`}><p className="instruction">{body}</p><Select value={a[p(n)]||''} onChange={v=>set(p(n),v)} options={options}/></Panel>
 if(roomId===1)return <>
  {common(3,'Header che cambia',<>Un pacchetto attraversa un router. Quale coppia di indirizzi viene riscritta normalmente a livello 2 sul nuovo collegamento, mentre gli indirizzi IP di destinazione restano quelli del percorso end-to-end?</>, 'x',['MAC sorgente e MAC destinazione','IP sorgente e IP destinazione','Porte TCP sorgente e destinazione','TTL e porta 443'])}
  {common(4,'Porta 443',<>La porta 443 compare nell'header TCP di una connessione HTTPS. A quale livello appartiene questa informazione?</>, 'x',['Trasporto','Rete','Collegamento dati','Applicazione'])}
  {common(5,'PDU corretta',<>Il payload applicativo viene incapsulato da TCP e poi da IP. Qual è la sequenza PDU corretta per questi tre passaggi?</>, 'x',['Messaggio → Segmento → Pacchetto','Pacchetto → Segmento → Messaggio','Frame → Pacchetto → Segmento','Messaggio → Pacchetto → Frame'])}
  {common(6,'Router o switch?',<>Un dispositivo decide il forwarding osservando l'indirizzo IP di destinazione e la propria tabella di routing. Quale dispositivo sta operando in questo scenario?</>, 'x',['Router','Switch Layer 2','Hub','Access point'])}
  {common(7,'Decapsulazione',<>Un host riceve un frame Ethernet contenente un pacchetto IP e un segmento TCP. Quale ordine descrive la rimozione degli header?</>, 'x',['Ethernet → IP → TCP','TCP → IP → Ethernet','IP → Ethernet → TCP','Ethernet → TCP → IP'])}
  {common(8,'Incoerenza',<>Una cattura mostra: MAC destinazione, IP destinazione, porta TCP 443. Quale associazione è sicuramente errata?</>, 'x',['MAC → collegamento dati','IP → rete','porta 443 → trasporto','porta 443 → rete'])}
  {common(9,'Stesso IP, nuovo frame',<>Il pacchetto passa da R1 a R2. Sul nuovo segmento Ethernet, quale informazione deve essere ricostruita per il nuovo collegamento?</>, 'x',['Header Ethernet','Indirizzo IP di destinazione','Porta TCP destinazione','URL richiesto'])}
  {common(10,'Diagnosi finale',<>Un browser invia una richiesta HTTPS. Quale catena è coerente con il modello TCP/IP a quattro livelli usato nel corso?</>, 'x',['HTTPS → TCP → IP → Ethernet','HTTPS → IP → TCP → Ethernet','TCP → HTTPS → IP → Ethernet','Ethernet → IP → TCP → HTTPS'])}
 </>
 if(roomId===2)return <>
  {common(3,'Host massimi',<>Una subnet /27 standard IPv4 deve ospitare host ordinari. Quanti indirizzi host utilizzabili ha?</>, 'x',['30','32','28','62'])}
  {common(4,'Broadcast /26',<>Qual è il broadcast della subnet 192.168.40.128/26?</>, 'x',['192.168.40.191','192.168.40.192','192.168.40.255','192.168.40.129'])}
  {common(5,'Appartenenza',<>A quale subnet appartiene 192.168.40.190 se le subnet sono 192.168.40.128/26 e 192.168.40.192/27?</>, 'x',['192.168.40.128/26','192.168.40.192/27','192.168.40.0/25','nessuna'])}
  {common(6,'Allineamento',<>Per una /27, quale valore dell'ultimo ottetto è un indirizzo di rete valido?</>, 'x',['192','194','198','201'])}
  {common(7,'Progettazione',<>Una rete deve contenere 50 host ordinari. Qual è il prefisso minimo che soddisfa 2^b ≥ H+2?</>, 'x',['/26','/27','/25','/28'])}
  {common(8,'Ultimo host',<>Qual è l'ultimo host utilizzabile di 10.10.8.64/27?</>, 'x',['10.10.8.94','10.10.8.95','10.10.8.96','10.10.8.93'])}
  {common(9,'Overlap',<>Hai 10.0.0.0/25 e 10.0.0.96/27. Il secondo blocco è contenuto nel primo: quale proprietà è violata?</>, 'x',['assenza di sovrapposizione','ordine decrescente delle richieste','uso di gateway','CIDR'])}
  {common(10,'Crescita',<>Un reparto richiede 62 host ordinari. Quale subnet è sufficiente senza spreco di un intero /24?</>, 'x',['/26','/27','/25','/28'])}
 </>
 if(roomId===3)return <>
  {common(3,'Mask /22',<>Qual è la maschera decimale di /22?</>, 'x',['255.255.252.0','255.255.255.0','255.255.248.0','255.255.252.255'])}
  {common(4,'Primo esterno',<>Dopo 172.16.32.0/22, qual è la prima rete /24 immediatamente successiva?</>, 'x',['172.16.36.0/24','172.16.35.0/24','172.16.40.0/24','172.16.31.0/24'])}
  {common(5,'Longer match',<>Rotte /8, /16 e /24 corrispondono tutte alla destinazione 10.20.30.77. Quale viene scelta?</>, 'x',['/24','/16','/8','default /0'])}
  {common(6,'Blocco valido',<>Quale insieme di quattro /24 è aggregabile in un /22 correttamente allineato?</>, 'x',['192.168.8–11','192.168.9–12','192.168.10–13','192.168.12–15'])}
  {common(7,'Troppo largo',<>Una supernet copre reti desiderate ma anche una rete estranea. Qual è il rischio principale di annunciarla?</>, 'x',['Traffico verso la rete estranea può seguire un percorso non appropriato','Le porte TCP cambiano','Il MAC diventa pubblico','Il DHCP si disattiva'])}
  {common(8,'Prefisso comune',<>Gli indirizzi 10.20.32.0/24 e 10.20.33.0/24 hanno quale aggregazione minima valida?</>, 'x',['10.20.32.0/23','10.20.32.0/24','10.20.33.0/23','10.20.0.0/16'])}
  {common(9,'Compressione',<>Qual è lo scopo principale della route summarization?</>, 'x',['Ridurre il numero di prefissi pubblicizzati','Aumentare il numero di broadcast','Sostituire TCP','Cambiare gli indirizzi MAC'])}
  {common(10,'Frontiera',<>Una rotta 172.16.32.0/22 comprende quattro reti /24. Quanti indirizzi totali contiene?</>, 'x',['1024','512','2048','256'])}
 </>
 if(roomId===4)return <>
  {common(4,'Default route',<>Se nessuna rotta specifica corrisponde alla destinazione, quale voce può essere usata come ultima risorsa?</>, 'x',['0.0.0.0/0','255.255.255.255/32','127.0.0.0/8','224.0.0.0/4'])}
  {common(5,'TTL',<>Un router inoltra un pacchetto IP con TTL 3. Dopo il forwarding, quale valore porta normalmente avanti il pacchetto?</>, 'x',['2','3','4','0'])}
  {common(6,'Traceroute',<>Nel traceroute, una risposta Time Exceeded da un router indica principalmente che…</>, 'x',['il TTL è scaduto durante il percorso','il DNS è sempre guasto','la destinazione ha risposto con HTTP 404','il MAC è duplicato'])}
  {common(7,'Next-hop',<>Una rotta statica è 192.168.20.0/24 via 10.0.1.2. Cosa rappresenta 10.0.1.2?</>, 'x',['Il router next-hop','La rete destinazione','Il broadcast','La porta TCP'])}
  {common(8,'Rete irraggiungibile',<>Una tabella contiene una rotta specifica ma l'interfaccia verso il next-hop è down. Quale elemento va verificato per primo?</>, 'x',['Connettività del next-hop/interfaccia','Il browser','Il DNS pubblico','Il MAC del server remoto'])}
  {common(9,'Hop mancante',<>Un hop di traceroute mostra * * *. Quale conclusione è lecita senza altre evidenze?</>, 'x',['Quel probe non ha ricevuto risposta entro il timeout','Quel router non esiste sicuramente','La rotta è sicuramente assente','Il server è spento sicuramente'])}
  {common(10,'Diagnosi incrociata',<>Se ping verso il gateway locale funziona ma traceroute si interrompe dopo il router R2, quale informazione è più utile per il passo successivo?</>, 'x',['Routing table e interfaccia del router successivo','Il colore del cavo','La porta 443 del browser','Il nome host del PC'])}
 </>
 if(roomId===5)return <>
  {common(4,'Privileged EXEC',<>Quale comando porta normalmente da User EXEC a Privileged EXEC?</>, 'x',['enable','configure terminal','interface g0/0','no shutdown'])}
  {common(5,'Configurazione globale',<>Da R5# quale comando apre la modalità Global Configuration?</>, 'x',['configure terminal','enable','show running-config','interface g0/0'])}
  {common(6,'Interfaccia down',<>Una porta è administratively down. Quale comando, eseguito nella modalità corretta, la riattiva?</>, 'x',['no shutdown','shutdown','enable interface','up'])}
  {common(7,'Verifica sintetica',<>Quale comando mostra rapidamente stato e indirizzi delle interfacce?</>, 'x',['show ip interface brief','show ip route','show running-config | section ip route','ping'])}
  {common(8,'Rotta statica',<>Quale comando mostra le rotte presenti nella tabella di routing?</>, 'x',['show ip route','show interfaces','show ip interface brief','show vlan'])}
  {common(9,'Next-hop non raggiungibile',<>Una static route punta a 10.0.6.2 ma l'interfaccia verso 10.0.6.0/30 è down. Qual è la prima causa da verificare?</>, 'x',["Stato dell'interfaccia",'DNS','HTTP','NAT'])}
  {common(10,'Sequenza diagnostica',<>Quale sequenza è più coerente per un guasto di connettività su una singola interfaccia?</>, 'x',['show ip interface brief → configurazione → no shutdown → verifica','ping → reload → erase startup-config','show ip route → cambiare DNS → shutdown','configure terminal → reload → ping'])}
 </>
 if(roomId===6)return <>
  {common(4,'Trunk',<>Una porta deve trasportare VLAN 10, 20 e 30 tra switch e router. Quale modalità è necessaria?</>, 'x',['Trunk','Access VLAN 10','Shutdown','Loopback'])}
  {common(5,'Broadcast domain',<>PC-A in VLAN 10 invia un broadcast. Quale PC riceve il broadcast se appartiene a VLAN 20 sullo stesso switch?</>, 'x',['Nessuno, se le VLAN sono configurate correttamente','PC della VLAN 20 sempre','Tutti i PC','Solo il router'])}
  {common(6,'Router-on-a-stick',<>In una configurazione router-on-a-stick, il collegamento switch-router deve essere…</>, 'x',['Trunk 802.1Q','Access VLAN 10','Un cavo per ogni VLAN obbligatoriamente','Spento'])}
  {common(7,'Gateway',<>Un host 192.168.30.20/24 appartiene alla VLAN 30. Quale gateway coerente può usare?</>, 'x',['192.168.30.1','192.168.20.1','192.168.30.255','192.168.31.1'])}
  {common(8,'DHCP',<>Qual è il primo messaggio tipico con cui un client DHCP cerca un server quando non conosce ancora il proprio indirizzo?</>, 'x',['DHCPDISCOVER','DHCPOFFER','DHCPACK','DHCPRELEASE'])}
  {common(9,'VLAN allowed',<>Due switch hanno trunk attivo, ma VLAN 30 non passa. Quale parametro va controllato subito?</>, 'x',['Allowed VLAN sul trunk','Porta TCP 443','TTL IP','DNS'])}
  {common(10,'Inter-VLAN',<>Perché due host appartenenti a VLAN differenti non comunicano direttamente a livello 2?</>, 'x',['Appartengono a domini di broadcast distinti e serve routing','Perché hanno sempre MAC uguali','Perché TCP blocca le VLAN','Perché DHCP impedisce il routing'])}
 </>
 if(roomId===7)return <>
  {common(4,'Costo verso root',<>SW2 ha un link diretto a SW1 con costo 10 e un percorso SW2→SW3→SW1 con costi 100+10. Quale percorso preferisce?</>, 'x',['Diretto SW2→SW1','Via SW3','Entrambi indistinguibili','Nessuno'])}
  {common(5,'Root Port SW3',<>Con SW1 root e link SW3→SW1 costo 10, qual è il root port di SW3?</>, 'x',['Porta verso SW1','Porta verso SW2','Entrambe','Nessuna'])}
  {common(6,'Link ridondante',<>Con SW1 root e costi 10,10,100 sul triangolo, quale collegamento è il candidato naturale a essere bloccato sul lato non-designated?</>, 'x',['SW2–SW3','SW1–SW2','SW1–SW3','Nessuno'])}
  {common(7,'Tie-break',<>Se due percorsi verso la root hanno lo stesso costo, quale informazione può essere usata per scegliere il BPDU migliore?</>, 'x',['Bridge ID del mittente','Porta TCP 80','Indirizzo IP del client','TTL del frame'])}
  {common(8,'Failure',<>Se cade il link diretto SW2→SW1 e SW2 aveva SW2→SW3 in alternate/blocking, cosa deve accadere per mantenere il percorso verso root?</>, 'x',['Il percorso SW2→SW3 può diventare forwarding dopo la riconvergenza','SW2 deve spegnersi','SW1 diventa automaticamente non-root','Tutti i link diventano blocking'])}
  {common(9,'Obiettivo STP',<>Qual è il risultato fondamentale ottenuto da STP in una rete con collegamenti ridondanti?</>, 'x',['Una topologia di forwarding senza loop di livello 2','Un unico indirizzo IP per tutti gli host','La sostituzione di DHCP','Il routing tra VLAN'])}
  {common(10,'Stato finale',<>Quando STP ha stabilizzato correttamente il triangolo, cosa deve accadere al traffico broadcast rispetto al loop iniziale?</>, 'x',['Il loop viene eliminato dal piano di forwarding','Il broadcast viene moltiplicato indefinitamente','Tutti i link vengono disattivati','Il router viene escluso'])}
 </>
 if(roomId===8)return <>
  {common(3,'Configurazione IP',<>Quale comando assegna 192.168.10.1/24 a Gi0/0?</>, 'x',['ip address 192.168.10.1 255.255.255.0','ip 192.168.10.1/24','set ip 192.168.10.1','address 192.168.10.1 24'])}
  {common(4,'Attiva interfaccia',<>Quale comando rende operativa un'interfaccia amministrativamente spenta?</>, 'x',['no shutdown','startup','enable port','interface up'])}
  {common(5,'Rotta statica',<>Quale comando instrada 192.168.20.0/24 via 10.0.0.2?</>, 'x',['ip route 192.168.20.0 255.255.255.0 10.0.0.2','route 192.168.20.0/24 10.0.0.2','ip static 192.168.20.0 10.0.0.2','ip forward 192.168.20.0 10.0.0.2'])}
  {common(6,'Verifica con ping',<>Quale comando verifica direttamente la raggiungibilità IP di 192.168.20.1?</>, 'x',['ping 192.168.20.1','test 192.168.20.1','trace 192.168.20.1','show ping 192.168.20.1'])}
  {common(7,'Ordine',<>Quale sequenza è necessaria per configurare un indirizzo su Gi0/0 partendo da R1&gt;?</>, 'x',['enable → configure terminal → interface g0/0 → ip address','configure terminal → enable → ip address → interface','interface g0/0 → enable → ip address','ip address → interface → enable'])}
  {common(8,'Default route',<>Quale comando configura una default route IPv4 verso 10.0.0.2?</>, 'x',['ip route 0.0.0.0 0.0.0.0 10.0.0.2','ip default 10.0.0.2','default-route 10.0.0.2','ip route default 10.0.0.2'])}
  {common(9,'Tabella',<>Dopo aver configurato una rotta statica, quale comando permette di verificare che sia presente nella routing table?</>, 'x',['show ip route','show interfaces','show vlan','show running-config | section interface'])}
  {common(10,'End-to-end',<>Una rete contiene LAN locale, link WAN e LAN remota. Quale verifica dimostra meglio la connettività end-to-end dopo la configurazione?</>, 'x',['ping verso un host della LAN remota','show version','show clock','hostname'])}
 </>
 return null
}
