import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminControlRoom from '@/components/admin-control-room'

export const dynamic='force-dynamic'

export default async function AdminPage(){
 const s=await createClient(); const {data:{user}}=await s.auth.getUser(); if(!user)redirect('/admin/login')
 const {data:p}=await s.from('profiles').select('role').eq('id',user.id).maybeSingle(); if(p?.role!=='teacher')redirect('/synora')
 return <AdminControlRoom/>
}
