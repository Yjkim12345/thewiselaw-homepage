import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, category, message, privacy } = body;

    // Validate fields
    if (!name || !phone || !message || !privacy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into Supabase table "contact_inquiries"
    const { data, error } = await supabase
      .from('contact_inquiries')
      .insert([
        {
          name,
          phone,
          email,
          category,
          message,
          created_at: new Date().toISOString(),
          status: 'pending'
        }
      ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('API Route Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
