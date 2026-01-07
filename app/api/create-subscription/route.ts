import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim()

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not configured')
} else if (!stripeSecretKey.startsWith('sk_test_') && !stripeSecretKey.startsWith('sk_live_')) {
  console.error('STRIPE_SECRET_KEY appears to be invalid. It should start with "sk_test_" or "sk_live_"')
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-12-15.clover',
    })
  : null

export async function POST(request: NextRequest) {
  if (!stripe) {
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
    console.error('Error creating subscription:', error)
    
    // Provide more specific error messages
    if (error?.type === 'StripeAuthenticationError') {
      return NextResponse.json(
        { 
          error: 'Invalid Stripe API key. Please check your STRIPE_SECRET_KEY in .env.local. Make sure it starts with "sk_test_" for test mode or "sk_live_" for live mode.',
          details: 'The API key may be incorrect, have extra spaces, or be the wrong type (publishable vs secret).'
        },
        { status: 401 }
      )
    }
    
    if (error?.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: error.message || 'Invalid request to Stripe' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create subscription',
        details: error?.message || 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}
