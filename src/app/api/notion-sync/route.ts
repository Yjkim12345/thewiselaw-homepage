import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // This is a placeholder for the Notion Webhook or Sync logic.
    // In the future, n8n or Supabase Edge Functions can call this endpoint
    // to trigger a rebuild (On-Demand Revalidation) or update cached data
    // when a Notion page is published.

    const body = await request.json();
    
    // Validate secret token to ensure the request comes from authorized source (e.g. n8n)
    const token = request.headers.get('authorization');
    // Using a dummy token for local dev, in production use proper env vars
    const expectedToken = process.env.NOTION_SYNC_SECRET || 'dev_secret_token';

    if (token !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Received Notion Sync Webhook:', body);

    // TODO: Implement revalidateTag('insights') or similar Next.js cache busting
    // import { revalidateTag } from 'next/cache';
    // revalidateTag('insights');

    return NextResponse.json({ success: true, message: 'Sync triggered successfully' });
  } catch (err) {
    console.error('Notion Sync Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
