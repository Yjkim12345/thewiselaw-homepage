import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // 1. Check Authorization Header
    const authHeader = request.headers.get('Authorization');
    const expectedKey = `Bearer ${process.env.N8N_API_KEY}`;
    
    // If the environment variable is not set, we'll allow it for now, 
    // but log a warning. In production, this should always be checked.
    if (process.env.N8N_API_KEY && authHeader !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API Key' },
        { status: 401 }
      );
    }

    // 2. Parse the incoming JSON body from n8n
    const body = await request.json();
    const { title, category, summary, content } = body;

    // 3. Validate required fields
    if (!title || !category || !content) {
      return NextResponse.json(
        { error: 'Missing required fields (title, category, content)' },
        { status: 400 }
      );
    }

    // 4. Insert into Supabase table "research_reports"
    const { data, error } = await supabase
      .from('research_reports')
      .insert([
        {
          title,
          category,
          summary: summary || '',
          content,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Supabase insert error (ai-reports):', error);
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      );
    }

    // 5. Success response
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('API Route Error (ai-reports):', err);
    return NextResponse.json(
      { error: 'Internal server error processing report' },
      { status: 500 }
    );
  }
}
