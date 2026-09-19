'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const fragments=[
 {id:'f1',label:'A',text:'DESTINATION PORT: 443'},
 {id:'f2',label:'B',text:'SOURCE MAC: AA:7B:19:CC:04:91'},
 {id:'f3',label:'C',text:'DESTINATION IP: 172.16.40.20'},
 {id:'f4',label:'D',text:'APPLICATION: HTTPS'},
]
const levels=['Physical','Data Link','Network','Transport','Session','Presentation','Application']

export default function RoomOne(){
 const router=useRouter(); const [answers,setAnswers]=useState<Record<string,string>>({}); const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false)
 async function submit(){setBusy(true);setMessage('VERIFICA DELLA TRACCIA…'); const res=await fetch('/api/attempt',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({roomId:1,answers})}); const data=await res.json(); setBusy(false); setMessage(data.message); if(data.success) setTimeout(()=>router.push('/synora'),1300)}
 return <div className="room-card" style={{marginTop:30}}><div className="kicker">TRACE // PACKET 0017</div><h2 style={{fontSize:28,margin:'10px 0'}}>Ricostruite l'incapsulamento</h2><p style={{color:'#91a9ba',lineHeight:1.7}}>Il pacchetto che attraversa Synora è stato frammentato. Ogni informazione appartiene a un livello preciso. Ricostruite la traccia completa. Una combinazione apparentemente plausibile non è sufficiente: il sistema controllerà la coerenza dell'intera sequenza.</p><div className="room-grid" style={{marginTop:22}}><div><div className="kicker">FRAMMENTI RECUPERATI</div>{fragments.map(f=><div className="fragment" key={f.id} style={{marginTop:10}}><b>{f.label}</b> — {f.text}</div>)}</div><div><div className="kicker">ATTRIBUZIONE DEI LIVELLI</div><div className="select-grid">{fragments.map(f=><div key={f.id}><label style={{display:'block',fontSize:10,color:'#7f9bad',marginBottom:5}}>FRAMMENTO {f.label}</label><select value={answers[f.id]??''} onChange={e=>setAnswers({...answers,[f.id]:e.target.value})}><option value="">seleziona…</option>{levels.map(l=><option key={l}>{l}</option>)}</select></div>)}</div><button className="cta" style={{marginTop:18}} onClick={submit} disabled={busy}>{busy?'ANALISI…':'INVIA LA TRACCIA'}</button>{message&&<div className="notice">{message}</div>}</div></div><div className="notice">INDIZIO DI SISTEMA: non confondere il contenuto applicativo con il protocollo che ne garantisce il trasporto.</div></div>
}
