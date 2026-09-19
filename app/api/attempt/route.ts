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
  1:{m1_3:'MAC sorgente e MAC destinazione',m1_4:'Trasporto',m1_5:'Messaggio → Segmento → Pacchetto',m1_6:'Router',m1_7:'Ethernet → IP → TCP',m1_8:'porta 443 → rete',m1_9:'Header Ethernet',m1_10:'HTTPS → TCP → IP → Ethernet'},
  2:{m2_3:'30',m2_4:'192.168.40.191',m2_5:'192.168.40.128/26',m2_6:'192',m2_7:'/26',m2_8:'10.10.8.94',m2_9:'assenza di sovrapposizione',m2_10:'/26'},
  3:{m3_3:'255.255.252.0',m3_4:'172.16.36.0/24',m3_5:'/24',m3_6:'192.168.8–11',m3_7:'Traffico verso la rete estranea può seguire un percorso non appropriato',m3_8:'10.20.32.0/23',m3_9:'Ridurre il numero di prefissi pubblicizzati',m3_10:'1024'},
  4:{m4_4:'Longest prefix match',m4_5:'0.0.0.0/0',m4_6:'2',m4_7:'Il router next-hop',m4_8:'Connettività del next-hop/interfaccia',m4_9:'Quel probe non ha ricevuto risposta entro il timeout',m4_10:'Routing table e interfaccia del router successivo'},
  5:{m5_4:'enable',m5_5:'configure terminal',m5_6:'no shutdown',m5_7:'show ip interface brief',m5_8:'show ip route',m5_9:"Stato dell'interfaccia",m5_10:'show ip interface brief → configurazione → no shutdown → verifica'},
  6:{m6_4:'Trunk',m6_5:'Nessuno, se le VLAN sono configurate correttamente',m6_6:'Trunk 802.1Q',m6_7:'192.168.30.1',m6_8:'DHCPDISCOVER',m6_9:'Allowed VLAN sul trunk',m6_10:'Appartengono a domini di broadcast distinti e serve routing'},
  7:{m7_4:'Diretto SW2→SW1',m7_5:'Porta verso SW1',m7_6:'SW2–SW3',m7_7:'Bridge ID del mittente',m7_8:'Il percorso SW2→SW3 può diventare forwarding dopo la riconvergenza',m7_9:'Una topologia di forwarding senza loop di livello 2',m7_10:'Il loop viene eliminato dal piano di forwarding'},
  8:{m8_3:'ip address 192.168.10.1 255.255.255.0',m8_4:'no shutdown',m8_5:'ip route 192.168.20.0 255.255.255.0 10.0.0.2',m8_6:'ping 192.168.20.1',m8_7:'enable → configure terminal → interface g0/0 → ip address',m8_8:'ip route 0.0.0.0 0.0.0.0 10.0.0.2',m8_9:'show ip route',m8_10:'ping verso un host della LAN remota'},
}

const keys: Record<number,string> = {1:'ENCAPSULATION',2:'VLSM',3:'CIDR',4:'NEXT-HOP',5:'DIAGNOSI',6:'VLAN',7:'REDUNDANZA',8:'SYNORA'}

export async function POST(req: Request){
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) return NextResponse.json({success:false,message:'SESSIONE NON VALIDA'},{status:401})
  const {roomId,answers}=await req.json(); const exp=expected[Number(roomId)]; if(!exp) return NextResponse.json({success:false,message:'DISTRETTO NON RICONOSCIUTO'},{status:400})
  const adv=advancedExpected[Number(roomId)]||{}
  const fullExp={...exp,...adv}
  const ok=Object.entries(fullExp).every(([k,v])=>answers?.[k]===v)
  await supabase.from('attempts').insert({user_id:user.id,room_id:Number(roomId),answer:JSON.stringify(answers),correct:ok})
  if(!ok){await supabase.rpc('register_error',{p_user_id:user.id}); return NextResponse.json({success:false,message:'TRACCIA INCOERENTE — almeno un passaggio non è compatibile con le altre evidenze.'})}
  await supabase.rpc('complete_room',{p_user_id:user.id,p_room_id:Number(roomId)})
  return NextResponse.json({success:true,message:`TRACCIA CORRETTA — CHIAVE RECUPERATA: ${keys[Number(roomId)]}`})
}
