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
    const { amount, name, email, message, purpose } = await request.json()

    // Validate amount (convert to cents)
    const amountInCents = Math.round(amount * 100)
    if (amountInCents < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least $1.00' },
        { status: 400 }
      )
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      description: `Church Donation - ${purpose || 'Offering'}`,
      metadata: {
        name,
        email,
        message: message || '',
        purpose: purpose || '',
        type: 'one-time-donation',
      },
      receipt_email: email,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    const errorResponse = handleStripeError(error)
    return NextResponse.json(
      { error: errorResponse.error, details: errorResponse.details },
      { status: errorResponse.status }
    )
  }
}
