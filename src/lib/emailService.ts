import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export interface FeedbackEmailData {
  type: 'bug' | 'feature' | 'general' | 'privacy';
  message: string;
  userEmail?: string;
  userAgent?: string;
  timestamp: string;
}

/**
 * Formats feedback type for display in email
 */
function formatFeedbackType(type: string): string {
  const typeMap = {
    bug: '🐛 Bug Report',
    feature: '✨ Feature Request',
    privacy: '🔒 Privacy Concern',
    general: '💬 General Feedback'
  };
  return typeMap[type as keyof typeof typeMap] || '💬 General Feedback';
}

/**
 * Generates HTML email template for feedback
 */
function generateEmailHTML(data: FeedbackEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>EstimAIte Feedback</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">
          EstimAIte Feedback
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
          ${formatFeedbackType(data.type)}
        </p>
      </div>

      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px;">Message</h2>
        <div style="background: white; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <p style="margin: 0; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">
            ${data.message}
          </p>
        </div>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 16px;">Contact Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #718096; font-weight: 500; width: 120px;">User Email:</td>
            <td style="padding: 8px 0; color: #2d3748;">
              ${data.userEmail ? `<a href="mailto:${data.userEmail}" style="color: #667eea; text-decoration: none;">${data.userEmail}</a>` : 'Not provided'}
            </td>
          </tr>
        </table>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 16px;">Technical Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #718096; font-weight: 500; width: 120px;">Timestamp:</td>
            <td style="padding: 6px 0; color: #2d3748; font-family: 'Monaco', 'Consolas', monospace; font-size: 14px;">
              ${new Date(data.timestamp).toLocaleString('en-US', {
                timeZone: 'America/New_York',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })} EST
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #718096; font-weight: 500;">User Agent:</td>
            <td style="padding: 6px 0; color: #718096; font-family: 'Monaco', 'Consolas', monospace; font-size: 12px; word-break: break-all;">
              ${data.userAgent || 'Not available'}
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #718096; font-weight: 500;">Source:</td>
            <td style="padding: 6px 0; color: #2d3748;">EstimAIte Application</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 14px;">
        <p style="margin: 0;">
          This feedback was sent from the EstimAIte feedback system.<br>
          Delivered by <a href="https://resend.com" style="color: #667eea; text-decoration: none;">Resend</a>
        </p>
      </div>

    </body>
    </html>
  `;
}

/**
 * Generates plain text version of the email
 */
function generateEmailText(data: FeedbackEmailData): string {
  return `
EstimAIte Feedback - ${formatFeedbackType(data.type)}

MESSAGE:
${data.message}

CONTACT INFORMATION:
User Email: ${data.userEmail || 'Not provided'}

TECHNICAL DETAILS:
Timestamp: ${new Date(data.timestamp).toLocaleString('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
})} EST
User Agent: ${data.userAgent || 'Not available'}
Source: EstimAIte Application

---
This feedback was sent from the EstimAIte feedback system.
  `.trim();
}

/**
 * Sends feedback email using Resend
 * @param feedbackData - The feedback data to send
 * @returns Promise with send result
 */
export async function sendFeedbackEmail(feedbackData: FeedbackEmailData) {
  try {
    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    if (!process.env.FEEDBACK_EMAIL) {
      throw new Error('FEEDBACK_EMAIL is not configured');
    }
    if (!process.env.FROM_EMAIL) {
      throw new Error('FROM_EMAIL is not configured');
    }

    const emailSubject = `EstimAIte Feedback: ${formatFeedbackType(feedbackData.type)}`;

    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.FEEDBACK_EMAIL,
      subject: emailSubject,
      html: generateEmailHTML(feedbackData),
      text: generateEmailText(feedbackData),
      // Add reply-to if user provided email
      ...(feedbackData.userEmail && { replyTo: feedbackData.userEmail }),
      // Add tags for tracking
      tags: [
        { name: 'source', value: 'estimaite-feedback' },
        { name: 'type', value: feedbackData.type }
      ]
    });

    return {
      success: result.success,
      messageId: result.id,
      error: result.error
    };

  } catch (error) {
    console.error('Failed to send feedback email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Rate limiting helper - simple in-memory store
 * In production, use Redis or similar
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check if request should be rate limited
 * @param identifier - IP address or similar identifier
 * @param maxRequests - Maximum requests per window
 * @param windowMs - Time window in milliseconds
 * @returns boolean indicating if request should be allowed
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(identifier);

  if (!current || now > current.resetTime) {
    // First request or window expired
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  // Increment count
  current.count++;
  return true;
}

/**
 * Clean up expired rate limit entries (call periodically)
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}
