import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerSupabase } from '@/lib/supabase-server'

const SESSION_VALUE = 'eglise_admin_v1'

async function checkAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === SESSION_VALUE
}

export async function GET(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const method = searchParams.get('method') || ''
  const type = searchParams.get('type') || ''
  const dateFrom = searchParams.get('from') || ''
  const dateTo = searchParams.get('to') || ''
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '100', 10)

  try {
    const db = createServerSupabase()
    let query = db
      .from('contributions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (method) query = query.eq('payment_method', method)
    if (type) query = query.eq('type_label', type)
    if (dateFrom) query = query.gte('created_at', dateFrom + 'T00:00:00.000Z')
    if (dateTo) query = query.lte('created_at', dateTo + 'T23:59:59.999Z')
    if (search) {
      query = query.or(
        `contributor_name.ilike.%${search}%,contributor_phone.ilike.%${search}%,type_label.ilike.%${search}%`
      )
    }

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({ data: data || [], count: count || 0 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
