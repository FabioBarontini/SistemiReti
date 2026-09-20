import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'SESSIONE NON VALIDA' }, { status: 401 })
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'teacher') return NextResponse.json({ error: 'ACCESSO NEGATO' }, { status: 403 })

  const [{ data: profiles }, { data: progress }, { data: rooms }] = await Promise.all([
    supabase.from('profiles').select('id,display_name,role,created_at').order('display_name'),
    supabase.from('game_progress').select('user_id,current_room,completed_rooms,hints_used,errors,score,updated_at').order('score', { ascending: false }),
    supabase.from('room_progress').select('user_id,room_id,status,score,hints_used,started_at,completed_at').order('room_id'),
  ])

  const byUser = new Map((profiles ?? []).map(p => [p.id, p]))
  const roomMap = new Map<string, any[]>()
  for (const room of rooms ?? []) {
    const list = roomMap.get(room.user_id) ?? []
    list.push(room)
    roomMap.set(room.user_id, list)
  }
  const players = (progress ?? []).map(p => ({ ...p, profile: byUser.get(p.user_id) ?? null, rooms: roomMap.get(p.user_id) ?? [] }))
  return NextResponse.json({ players, generatedAt: new Date().toISOString() })
}
