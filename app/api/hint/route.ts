import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
export async function POST(req:Request){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user)return NextResponse.json({success:false},{status:401})
 const {roomId}=await req.json(); const id=Number(roomId); if(id<1||id>8)return NextResponse.json({success:false},{status:400})
 const rpc=await supabase.rpc('register_hint',{p_user_id:user.id,p_room_id:id})
 if(rpc.error)return NextResponse.json({success:false,message:rpc.error.message},{status:500})
 return NextResponse.json({success:true})
}
