import { NextRequest, NextResponse } from 'next/server';
import { sendFeedbackEmail, checkRateLimit, type FeedbackEmailData } from '@/lib/emailService';

// Rate limiting configuration
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '5', 10);
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to a default identifier
  return 'unknown';
}

/**
 * Validate feedback type
 */
function isValidFeedbackType(type: string): type is FeedbackEmailData['type'] {
  return ['bug', 'feature', 'general', 'privacy'].includes(type);
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { type, message, email } = body;

    // Validate required fields
    if (!type || !message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Feedback type and message are required' },
        { status: 400 }
      );
    }

    // Validate feedback type
    if (!isValidFeedbackType(type)) {
      return NextResponse.json(
        { error: 'Invalid feedback type' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && typeof email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000 / 60) // minutes
        },
        { status: 429 }
      );
    }

    // Prepare feedback data
    const userAgent = request.headers.get('user-agent');
    const trimmedEmail = email?.trim();
    
    const feedbackData: FeedbackEmailData = {
      type,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      ...(trimmedEmail && { userEmail: trimmedEmail }),
      ...(userAgent && { userAgent })
    };

    // Log feedback for development/debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('=== FEEDBACK RECEIVED ===');
      console.log('Type:', feedbackData.type);
      console.log('Message:', feedbackData.message);
      console.log('User Email:', feedbackData.userEmail || 'Not provided');
      console.log('Timestamp:', feedbackData.timestamp);
      console.log('User Agent:', feedbackData.userAgent || 'Unknown');
      console.log('Client IP:', clientIP);
      console.log('========================');
    }

    // Send email
    const emailResult = await sendFeedbackEmail(feedbackData);

    if (!emailResult.success) {
      console.error('Failed to send feedback email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send feedback. Please try again later.' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Feedback sent successfully'
    });

  } catch (error) {
    console.error('Error processing feedback:', error);
    
    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
