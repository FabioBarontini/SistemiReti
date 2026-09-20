import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })

  let roomId: number | null = null
  try {
    const body = await req.json()
    roomId = Number(body?.roomId)
  } catch {}

  const { error } = await supabase.rpc('heartbeat', {
    p_user_id: user.id,
    p_room_id: Number.isInteger(roomId) ? roomId : null,
  })

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, at: new Date().toISOString() })
}
