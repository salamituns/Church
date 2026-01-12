import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeConfigured, handleStripeError } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.' },
      { status: 500 }
    )
  }

  try {
    const { amount, frequency, name, email, message, purpose } = await request.json()

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
    const price = await stripe.prices.create({
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

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (request.headers.get('origin') || 'http://localhost:3000')

    // Create checkout session for subscription
    const session = await stripe.checkout.sessions.create({
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
        message: message || '',
        purpose: purpose || '',
        type: 'recurring-donation',
        frequency,
      },
      success_url: `${baseUrl}/give/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/give?canceled=true`,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    const errorResponse = handleStripeError(error)
    return NextResponse.json(
      { error: errorResponse.error, details: errorResponse.details },
      { status: errorResponse.status }
    )
  }
}
