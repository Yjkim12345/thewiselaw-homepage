import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Next.js Edge Runtime 또는 Node.js 환경에서 작동합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
// 서비스 역할 키가 있으면 사용하고(RLS 우회), 없으면 익명 키 사용(RLS 설정 필요)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // n8n에서 보내올 JSON 데이터 구조 (title, category, summary, content)
    const { title, category, summary, content } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing title or content' }, { status: 400 })
    }

    // Supabase의 'research_reports' 테이블에 데이터 INSERT (홈페이지 DB에 저장)
    const { data, error } = await supabase
      .from('research_reports')
      .insert([
        { title, category, summary, content }
      ])
      .select()

    if (error) {
      console.error('Supabase Insert Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Successfully saved report to Supabase:', title)
    return NextResponse.json({ success: true, data }, { status: 200 })

  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
