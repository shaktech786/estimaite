import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, message, email } = body;

    // Validate required fields
    if (!type || !message || !message.trim()) {
      return NextResponse.json(
        { error: 'Feedback type and message are required' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Send email via service like SendGrid, Resend, or similar
    // 2. Log to monitoring service like Sentry, LogRocket, etc.
    // 3. Store temporarily in Redis or send to webhook

    // For development, log the feedback
    console.log('=== FEEDBACK RECEIVED ===');
    console.log('Type:', type);
    console.log('Message:', message);
    console.log('Email:', email || 'Not provided');
    console.log('Timestamp:', new Date().toISOString());
    console.log('User-Agent:', request.headers.get('user-agent') || 'Unknown');
    console.log('========================');

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'Feedback received successfully'
    });

  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
}
