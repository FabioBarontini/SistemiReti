'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
export default function LogoutButton(){ const router=useRouter(); const supabase=createClient(); return <button className="logout" onClick={async()=>{await supabase.auth.signOut();router.push('/login');router.refresh()}}>Abbandona sessione</button> }
