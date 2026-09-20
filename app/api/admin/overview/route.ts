import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'SESSIONE NON VALIDA' }, { status: 401 })

  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'teacher') return NextResponse.json({ error: 'ACCESSO NEGATO' }, { status: 403 })

  const [{ data: profiles, error: profilesError }, { data: progress, error: progressError }, { data: rooms, error: roomsError }] = await Promise.all([
    supabase.from('profiles').select('id,display_name,role,created_at').eq('role', 'student').order('display_name'),
    supabase.from('game_progress').select('user_id,current_room,completed_rooms,hints_used,errors,score,updated_at'),
    supabase.from('room_progress').select('user_id,room_id,status,score,hints_used,started_at,completed_at').order('room_id'),
  ])

  if (profilesError || progressError || roomsError) {
    return NextResponse.json({
      error: 'DATI CONTROL ROOM NON DISPONIBILI',
      detail: profilesError?.message ?? progressError?.message ?? roomsError?.message,
    }, { status: 500 })
  }

  const progressMap = new Map((progress ?? []).map(p => [p.user_id, p]))
  const roomMap = new Map<string, any[]>()
  for (const room of rooms ?? []) {
    const list = roomMap.get(room.user_id) ?? []
    list.push(room)
    roomMap.set(room.user_id, list)
  }

  // Build from profiles rather than from game_progress so a newly registered
  // student appears in the Control Room even before their first mission event.
  const players = (profiles ?? []).map(profile => {
    const p = progressMap.get(profile.id)
    return {
      user_id: profile.id,
      current_room: p?.current_room ?? 1,
      completed_rooms: p?.completed_rooms ?? 0,
      hints_used: p?.hints_used ?? 0,
      errors: p?.errors ?? 0,
      score: p?.score ?? 0,
      updated_at: p?.updated_at ?? profile.created_at,
      profile,
      rooms: roomMap.get(profile.id) ?? [],
    }
  })

  players.sort((a, b) => b.score - a.score || a.profile.display_name.localeCompare(b.profile.display_name, 'it'))
  return NextResponse.json({ players, generatedAt: new Date().toISOString() })
}
