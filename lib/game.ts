export type Room = {
  id: number
  name: string
  subtitle: string
  topic: string
  lore: string
}

export const ROOMS: Room[] = [
  { id:1, name:'La Torre dei Sette Livelli', subtitle:'Il segnale è arrivato, ma nessuno sa dove appartenga.', topic:'OSI · TCP/IP · PDU · Incapsulamento', lore:'Un messaggio è stato spezzato in tracce. Ricomponete il viaggio senza confondere ciò che trasporta con ciò che viene trasportato.' },
  { id:2, name:'La Città senza Indirizzi', subtitle:'Le strade esistono. Gli indirizzi sono spariti.', topic:'IPv4 · subnetting · VLSM', lore:'Quattro distretti devono convivere nello stesso spazio di indirizzamento. Ogni indirizzo assegnato male crea una casa fantasma.' },
  { id:3, name:'Il Distretto Impossibile', subtitle:'Le reti sono troppe. Lo spazio è uno solo.', topic:'CIDR · supernetting · aggregazione', lore:'Synora deve annunciare meno rotte senza perdere nessuna destinazione. Trovate il confine che rende possibile l’aggregazione.' },
  { id:4, name:'Il Pacchetto Scomparso', subtitle:'Parte. Arriva quasi. Poi scompare.', topic:'Routing · next-hop · default route · traceroute', lore:'Una rotta errata devia il traffico verso un quartiere che non esiste. Seguite gli indizi e ricostruite il cammino.' },
  { id:5, name:'Il Router che Mente', subtitle:'La tabella dice una cosa. La rete ne fa un’altra.', topic:'Diagnosi · interfacce · routing statico', lore:'Un router continua a dichiararsi innocente. Ma una sola voce della configurazione è incompatibile con la topologia.' },
  { id:6, name:'La Rete Fantasma', subtitle:'Gli host si vedono. Ma non dovrebbero vedersi.', topic:'LAN · VLAN · Wi-Fi · broadcast domain', lore:'Un laboratorio, una segreteria e una rete ospiti condividono gli stessi switch. Qualcuno ha aperto una porta nel posto sbagliato.' },
  { id:7, name:'Synora deve Sopravvivere', subtitle:'Due strade bastano. Tre possono distruggere tutto.', topic:'Ridondanza · STP · loop', lore:'La ridondanza è stata attivata. Ora la rete è diventata un anello chiuso. Dovete capire quale collegamento deve restare in attesa.' },
  { id:8, name:'Il Terminale', subtitle:'La città vi consegna l’ultima console.', topic:'Cisco CLI · sintesi', lore:'Non c’è più una domanda isolata. Dovete leggere una rete, interpretarla e impartire i comandi che la riportano in vita.' },
]
