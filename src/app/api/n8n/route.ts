import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { webhookUrl, payload } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Webhook URL is missing' },
        { status: 400 }
      )
    }

    // 서버(Next.js)에서 n8n 서버로 직접 통신 (CORS 규칙 무시됨)
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!n8nResponse.ok) {
      throw new Error(`n8n responsed with status: ${n8nResponse.status}`)
    }

    return NextResponse.json({ success: true, message: 'Successfully sent to n8n' })
  } catch (error: any) {
    console.error('n8n Proxy Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send data to n8n' },
      { status: 500 }
    )
  }
}
