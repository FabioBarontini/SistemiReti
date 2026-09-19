import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const expected: Record<number, Record<string,string>> = {
  1:{A:'Trasporto',B:'Collegamento dati',C:'Rete',D:'Applicazione',order:'Collegamento → Rete → Trasporto → Applicazione'},
  2:{p0:'/26',p1:'/25',p2:'/27',p3:'/28',r0:'192.168.40.128',r1:'192.168.40.0',r2:'192.168.40.192',r3:'192.168.40.224',first:'192.168.40.129'},
  3:{cidr:'172.16.32.0/22',mask:'255.255.252.0',count:'4'},
  4:{next:'10.0.1.2',def:'default route'},
  5:{err:"La rotta verso 192.168.60.0 usa un'interfaccia down",fix:'no shutdown su Gi0/2'},
  6:{v1:'10 STAFF',v2:'10 STAFF',v3:'20 LAB',v4:'20 LAB',v5:'20 LAB',v6:'30 GUEST',v7:'30 GUEST',v8:'30 GUEST',v24:'TRUNK',broadcast:'tutti e tre separatamente'},
  7:{root:'SW1',block:'SW1 — SW3'},
  8:{c0:'1',c1:'2',c2:'3',c3:'4',c4:'5',c5:'6',up:'no shutdown'},
}
const keys: Record<number,string> = {1:'ENCAPSULATION',2:'VLSM',3:'CIDR',4:'NEXT-HOP',5:'DIAGNOSI',6:'VLAN',7:'REDUNDANZA',8:'SYNORA'}

export async function POST(req: Request){
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) return NextResponse.json({success:false,message:'SESSIONE NON VALIDA'},{status:401})
  const {roomId,answers}=await req.json(); const exp=expected[Number(roomId)]; if(!exp) return NextResponse.json({success:false,message:'DISTRETTO NON RICONOSCIUTO'},{status:400})
  const ok=Object.entries(exp).every(([k,v])=>answers?.[k]===v)
  await supabase.from('attempts').insert({user_id:user.id,room_id:Number(roomId),answer:JSON.stringify(answers),correct:ok})
  if(!ok){await supabase.rpc('register_error',{p_user_id:user.id}); return NextResponse.json({success:false,message:'TRACCIA INCOERENTE — almeno un passaggio non è compatibile con la topologia.'})}
  await supabase.rpc('complete_room',{p_user_id:user.id,p_room_id:Number(roomId)})
  return NextResponse.json({success:true,message:`TRACCIA CORRETTA — CHIAVE RECUPERATA: ${keys[Number(roomId)]}`})
}
