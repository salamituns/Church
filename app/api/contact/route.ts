import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations/contact'
import { sendContactFormEmail } from '@/lib/email/contact'
import { contactRateLimiter, getClientIP, checkRateLimit } from '@/lib/ratelimit'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIP = getClientIP(request)
  const rateLimitResult = await checkRateLimit(contactRateLimiter, clientIP)
  
  if (!rateLimitResult.success) {
    logger.warn({ clientIP, limit: rateLimitResult.limit }, 'Rate limit exceeded for contact form')
    return NextResponse.json(
      { 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
      },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    )
  }

  try {
    // Parse and validate request body
    const body = await request.json()
    const validated = contactFormSchema.parse(body)

    // Send email
    await sendContactFormEmail(validated)

    logger.info({ 
      type: validated.type,
      email: validated.email,
    }, 'Contact form submitted successfully')

    return NextResponse.json(
      { success: true, message: 'Your message has been sent successfully!' },
      { status: 200 }
    )
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      logger.warn({ error: error.errors }, 'Contact form validation failed')
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
        },
        { status: 400 }
      )
    }

    logger.error({ error: error.message }, 'Failed to send contact form email')
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}
