import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, category, summary, content } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing title or content' }, { status: 400 })
    }

    // JSON 객체가 넘어왔을 경우 깨지지 않게 문자열로 변환 (Gemini 특유의 JSON Output 포맷 대응)
    const finalContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2)

    const { data, error } = await supabase
      .from('research_reports')
      .insert([
        { title, category, summary, content: finalContent }
      ])
      .select()

    if (error) {
      console.error('Supabase Insert Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })

  } catch (error: any) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
