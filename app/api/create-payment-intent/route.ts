import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeConfigured, handleStripeError } from '@/lib/stripe'
import { paymentIntentSchema } from '@/lib/validations/payment'
import { paymentRateLimiter, getClientIP, checkRateLimit } from '@/lib/ratelimit'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIP = getClientIP(request)
  const rateLimitResult = await checkRateLimit(paymentRateLimiter, clientIP)
  
  if (!rateLimitResult.success) {
    logger.warn({ clientIP, limit: rateLimitResult.limit }, 'Rate limit exceeded for payment intent')
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

  if (!isStripeConfigured() || !stripe) {
    logger.error('Stripe is not configured')
    return NextResponse.json(
      { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.' },
      { status: 500 }
    )
  }

  // At this point, stripe is guaranteed to be non-null
  const stripeInstance = stripe

  try {
    // Parse and validate request body
    const body = await request.json()
    const validated = paymentIntentSchema.parse(body)
    const { amount, name, email, message, purpose } = validated

    // Validate amount (convert to cents)
    const amountInCents = Math.round(amount * 100)
    if (amountInCents < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least $1.00' },
        { status: 400 }
      )
    }

    // Create Payment Intent
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      description: `Church Donation - ${purpose || 'Offering'}`,
      metadata: {
        name,
        email,
        message,
        purpose,
        type: 'one-time-donation',
      },
      receipt_email: email,
    })

    logger.info({ 
      paymentIntentId: paymentIntent.id, 
      amount: amountInCents,
      purpose,
    }, 'Payment intent created successfully')

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      logger.warn({ error: error.errors }, 'Payment intent validation failed')
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
        },
        { status: 400 }
      )
    }

    logger.error({ error: error.message }, 'Failed to create payment intent')
    const errorResponse = handleStripeError(error)
    return NextResponse.json(
      { error: errorResponse.error, details: errorResponse.details },
      { status: errorResponse.status }
    )
  }
}
