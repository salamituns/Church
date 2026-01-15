import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeConfigured, handleStripeError } from '@/lib/stripe'
import { subscriptionSchema } from '@/lib/validations/payment'
import { paymentRateLimiter, getClientIP, checkRateLimit } from '@/lib/ratelimit'
import { logger } from '@/lib/logger'

// Allowed origins for security
const getAllowedOrigins = (): string[] => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const origins: string[] = []
  
  if (baseUrl) {
    origins.push(baseUrl)
  }
  
  // Add production domain if different
  if (process.env.NODE_ENV === 'production') {
    origins.push('https://rccgshilohmega.org')
  }
  
  return origins
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIP = getClientIP(request)
  const rateLimitResult = await checkRateLimit(paymentRateLimiter, clientIP)
  
  if (!rateLimitResult.success) {
    logger.warn({ clientIP, limit: rateLimitResult.limit }, 'Rate limit exceeded for subscription')
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
    const validated = subscriptionSchema.parse(body)
    const { amount, frequency, name, email, message, purpose } = validated

    const amountInCents = Math.round(amount * 100)
    if (amountInCents < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least $1.00' },
        { status: 400 }
      )
    }

    // Map frequency to Stripe interval
    const interval = frequency === 'weekly' ? 'week' : 'month'
    const intervalCount = 1

    // Create or retrieve price
    const price = await stripeInstance.prices.create({
      unit_amount: amountInCents,
      currency: 'usd',
      recurring: {
        interval: interval as 'week' | 'month',
        interval_count: intervalCount,
      },
      product_data: {
        name: `Church Donation - ${frequency}`,
      },
    })

    // Get base URL with security validation
    const allowedOrigins = getAllowedOrigins()
    const origin = request.headers.get('origin')
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (origin && allowedOrigins.includes(origin) ? origin : 'http://localhost:3000')

    // Create checkout session for subscription
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email,
      metadata: {
        name,
        message,
        purpose,
        type: 'recurring-donation',
        frequency,
      },
      success_url: `${baseUrl}/give/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/give?canceled=true`,
    })

    logger.info({ 
      sessionId: session.id, 
      amount: amountInCents,
      frequency,
    }, 'Subscription checkout session created successfully')

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      logger.warn({ error: error.errors }, 'Subscription validation failed')
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
        },
        { status: 400 }
      )
    }

    logger.error({ error: error.message }, 'Failed to create subscription')
    const errorResponse = handleStripeError(error)
    return NextResponse.json(
      { error: errorResponse.error, details: errorResponse.details },
      { status: errorResponse.status }
    )
  }
}
