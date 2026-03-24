import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    const expectedUser = process.env.ADMIN_USER || 'admin';
    const expectedPwd = process.env.ADMIN_PASSWORD || 'thewise2026';

    if (username !== expectedUser || password !== expectedPwd) {
      return NextResponse.json({ error: 'Invalid Credentials' }, { status: 401 });
    }

    const body = await request.json();
    const { title, category, content, summary } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields: title, content' }, { status: 400 });
    }

    // JSON 객체가 넘어왔을 경우 깨지지 않게 문자열로 변환 (Gemini 특유의 JSON Output 포맷 대응)
    const finalContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);

    // 1차 시도: 수신된 category 그대로 저장 시도
    let { data, error } = await supabase
      .from('research_reports')
      .insert([
        { 
          title, 
          category: category || '법률', 
          content: finalContent,
          summary: summary || ''
        }
      ])
      .select();

    // 2차 시도: Check 제약 조건 위반 에러 발생 시, 안전한 폴백('법률')으로 재시도
    if (error && error.message && error.message.includes('check constraint')) {
      console.warn(`Category '${category}' violated DB check constraint. Retrying with fallback category '법률'...`);
      const retryResult = await supabase
        .from('research_reports')
        .insert([
          { 
            title, 
            category: '법률', // Safe Fallback
            content: finalContent,
            summary: summary || ''
          }
        ])
        .select();
        
      if (retryResult.error) {
        throw retryResult.error;
      }
      data = retryResult.data;
    } else if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (err: any) {
    console.error('Webhook Processing Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
