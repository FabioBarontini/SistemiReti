import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const expected: Record<number, Record<string,string>> = {
  1:{A:'Trasporto',B:'Collegamento dati',C:'Rete',D:'Applicazione',order:'Collegamento → Rete → Trasporto → Applicazione',pduT:'Segmento',pduR:'Pacchetto'},
  2:{p0:'/26',p1:'/25',p2:'/27',p3:'/28',r0:'192.168.40.128',r1:'192.168.40.0',r2:'192.168.40.192',r3:'192.168.40.224',first:'192.168.40.1',bc:'192.168.40.127',last:'192.168.40.126'},
  3:{cidr:'172.16.32.0/22',mask:'255.255.252.0',count:'4',outside:'172.16.36.0/24'},
  4:{path:'0>1>2>3',next:'10.0.1.2',kind:'specifica',event:'Il router successivo non risponde entro il timeout',ttl:'1'},
  5:{anom0:'1',anom2:'1',cmd:'no shutdown',cli:'enable|configure terminal|interface g0/2|no shutdown|end|show ip interface brief|show ip route',route:'192.168.60.0/24',reason:'next-hop-raggiungibile',state:'up / up'},
  6:{staff_pcPort:'1',lab_pcPort:'3',guest_pcPort:'6',routerPort:'24',v1:'10 STAFF',v2:'10 STAFF',v3:'20 LAB',v4:'20 LAB',v5:'20 LAB',v6:'30 GUEST',v7:'30 GUEST',v8:'30 GUEST',v24:'TRUNK',gw:'192.168.30.1',link:'trunk',broadcast:'separati'},
  7:{root:'SW1',rp:'SW2-SW1',rp3:'SW3-SW1',block:'SW2-SW3',fail:'SW2-SW3'},
  8:{c0:'1',c1:'2',c2:'3',c3:'4',c4:'5',c5:'6',up:'no shutdown',test:'ping 192.168.20.1',table:'routing'},
}

const advancedExpected: Record<number, Record<string,string>> = {
  1:{m1_3:'Header Ethernet',m1_3b:'no',m1_4:'Trasporto',m1_5:'Messaggio → Segmento → Pacchetto → Frame',m1_6:'Router + tabella di routing',m1_7:'Ethernet → IP → TCP',m1_8:'TCP 443 → Trasporto',m1_9:'Header Ethernet + il frame è locale al collegamento mentre l IP resta end-to-end',m1_10:'HTTPS → TCP → IP → Ethernet'},
  2:{m2_3:'192.168.40.192 + block size 32',m2_4:'192.168.40.191 + /26 ha blocchi di 64 indirizzi',m2_5:'192.168.40.128/26 + 192.168.40.128–191',m2_6:'/27 ha multipli di 32: 192 è multiplo, 194 no',m2_7:'/26 + 64 indirizzi: /27 offre solo 32 e non basta',m2_8:'10.10.8.64 | 10.10.8.95 | 10.10.8.94',m2_9:'10.0.0.0/25 copre .0–.127 e contiene 10.0.0.96/27: sovrapposizione',m2_10:'/26 | 64 | 62'},
  3:{m3_3:'255.255.252.0 | block size 4',m3_4:'172.16.36.0/24 | 172.16.32.0–172.16.35.255',m3_5:'/24 | longest prefix match',m3_6:'192.168.8–11 | contigue e allineate a 4 reti /24',m3_7:'Può attirare traffico verso una rete estranea producendo un percorso non appropriato/blackhole',m3_8:'10.20.32.0/23 | 512 indirizzi',m3_9:'Riduce il numero di prefissi negli annunci di routing',m3_10:'172.16.32.0 | 172.16.35.255 | 4 | 172.16.36.0/24'},
  4:{m4_4:'Si usa quando nessuna rotta più specifica corrisponde',m4_5:'1 | al successivo forwarding diventerebbe 0 e il router scarta il pacchetto',m4_6:'Il TTL scade e il router invia ICMP Time Exceeded, rivelando quell hop',m4_7:'È l indirizzo del router successivo a cui consegnare il pacchetto, non la rete destinazione',m4_8:'1. stato interfaccia 2. raggiungibilità next-hop 3. routing table',m4_9:'Il probe non ha ricevuto risposta entro il timeout; il router può filtrare ICMP o non rispondere',m4_10:'Routing table di R2/R3 + stato interfacce/next-hop; cercare rotta verso destinazione e link down'},
  5:{m5_4:'enable → configure terminal → interface g0/2',m5_5:'configure terminal | perché siamo già in privileged EXEC',m5_6:'interface g0/2 + no shutdown | interface configuration mode',m5_7:'show ip interface brief | mostra stato e indirizzi rapidamente',m5_8:'show ip route | 192.168.60.0/24 via 10.0.6.2',m5_9:'administratively down → interfaccia non operativa → no shutdown → show ip interface brief',m5_10:'show ip interface brief → show ip route → running-config; cercare Gi0/2 down, route 192.168.60.0/24 e next-hop 10.0.6.2'},
  6:{m6_4:'Trunk 802.1Q | una access appartiene a una sola VLAN',m6_5:'PC-A non invia il broadcast a PC-B | le VLAN separano i domini di broadcast',m6_6:'PC → access port → trunk 802.1Q → subinterfaccia router → trunk → access port → PC',m6_7:'192.168.30.1 | .255 è broadcast e non assegnabile',m6_8:'DHCPDISCOVER → DHCPOFFER → DHCPREQUEST → DHCPACK',m6_9:'Allowed VLAN sul trunk | perché VLAN10 passa ma VLAN30 viene filtrata',m6_10:'PC-A → switch VLAN10 → gateway L3 → routing → gateway VLAN30 → switch → SERVER'},
  7:{m7_4:'10 vs 110 → diretto SW2→SW1',m7_5:'Porta verso SW1 | costo 10',m7_6:'SW2–SW3 | è il collegamento ridondante con costo 100',m7_7:'Bridge ID del mittente',m7_8:'SW2–SW3 passa da blocking/alternate a forwarding dopo la riconvergenza',m7_9:'Senza blocking i frame di livello 2 possono circolare nel loop e moltiplicarsi',m7_10:'Root SW1 → root ports SW2/SW3 verso SW1 → SW2-SW3 blocking → caduta SW2-SW1 → SW2-SW3 forwarding'},
  8:{m8_3:'enable → configure terminal → interface g0/0 → ip address 192.168.10.1 255.255.255.0 → no shutdown',m8_4:'interface g0/0 → no shutdown | show ip interface brief',m8_5:'ip route 192.168.20.0 255.255.255.0 10.0.0.2',m8_6:'ping host remoto | traceroute host remoto',m8_7x:'enable → configure terminal → interface g0/0 → ip address 192.168.10.1 255.255.255.0 → no shutdown → end',m8_8:'ip route 0.0.0.0 0.0.0.0 10.0.0.2 | quando nessuna rotta più specifica corrisponde',m8_9:'show running-config | show ip route',helioSuspect:'A',helioReason:'Marta Vieri · accesso alla rete · console R3 alle 02:17 · modifica route alle 02:17 · modifica VLAN alle 02:19',he0:'1',he1:'1',he2:'1'}
}

const keys: Record<number,string> = {1:'ENCAPSULATION',2:'VLSM',3:'CIDR',4:'NEXT-HOP',5:'DIAGNOSI',6:'VLAN',7:'REDUNDANZA',8:'SYNORA'}

export async function POST(req: Request){
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) return NextResponse.json({success:false,message:'SESSIONE NON VALIDA'},{status:401})
  const {roomId,answers}=await req.json(); const exp=expected[Number(roomId)]; if(!exp) return NextResponse.json({success:false,message:'DISTRETTO NON RICONOSCIUTO'},{status:400})
  const adv=advancedExpected[Number(roomId)]||{}
  const fullExp={...exp,...adv}
  const norm=(x:unknown)=>String(x??'').toLowerCase().trim().replace(/\s+/g,' ').replace(/→/g,'->')
  const significant=(x:string)=>norm(x).split(/[^a-z0-9/.-]+/).filter(t=>t.length>2 && !['che','con','una','uno','per','del','dei','della','delle','sono','verso','dopo','quale','quali','come','deve','deve','non','può','puo','tra','nel','nella','sul','sui','gli','alla','dove','anche'].includes(t))
  const matches=(key:string, expectedValue:string, actual:unknown)=>{
    const got=norm(actual); const expn=norm(expectedValue)
    if(!got) return false
    if(got===expn) return true
    // Le prove aperte accettano formulazioni diverse purché contengano i concetti tecnici necessari.
    if(expectedValue.length>=42){
      const tokens=[...new Set(significant(expectedValue))]
      return tokens.filter(t=>got.includes(t)).length>=Math.max(2,Math.ceil(tokens.length*.58))
    }
    return false
  }
  let ok=Object.entries(fullExp).every(([k,v])=>matches(k,v,answers?.[k]))
  if(Number(roomId)===8){
    const picked=['he0','he1','he2','he3','he4'].filter(k=>answers?.[k]==='1')
    ok = ok && picked.length===3 && picked.join(',')==='he0,he1,he2'
  }
  await supabase.from('attempts').insert({user_id:user.id,room_id:Number(roomId),answer:JSON.stringify(answers),correct:ok})
  if(!ok){await supabase.rpc('register_error',{p_user_id:user.id}); return NextResponse.json({success:false,message:'TRACCIA INCOERENTE — almeno un passaggio non è compatibile con le altre evidenze.'})}
  const completed=await supabase.rpc('complete_room',{p_user_id:user.id,p_room_id:Number(roomId),p_key:keys[Number(roomId)]})
  if(completed.error) return NextResponse.json({success:false,message:'CORE NON DISPONIBILE — riprovare tra poco.'},{status:500})
  return NextResponse.json({success:true,score:completed.data,message:`TRACCIA CORRETTA — CHIAVE RECUPERATA: ${keys[Number(roomId)]} · +${completed.data} PUNTI`})
}
