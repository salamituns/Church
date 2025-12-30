import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not configured')
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
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
