import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim()

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not configured in environment variables')
} else if (!stripeSecretKey.startsWith('sk_test_') && !stripeSecretKey.startsWith('sk_live_')) {
  console.error('STRIPE_SECRET_KEY appears to be invalid. It should start with "sk_test_" or "sk_live_"')
}

// Export the configured Stripe instance
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  : null

// Export webhook secret
export const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()

// Helper function to check if Stripe is configured
export function isStripeConfigured(): boolean {
  return stripe !== null
}

// Helper function to check if webhooks are configured
export function isWebhookConfigured(): boolean {
  return !!webhookSecret
}

// Type-safe error handler for Stripe errors
export function handleStripeError(error: any): { error: string; details?: string; status: number } {
  console.error('Stripe error:', error)

  if (error?.type === 'StripeAuthenticationError') {
    return {
      error: 'Invalid Stripe API key. Please check your STRIPE_SECRET_KEY in .env.local.',
      details: 'Make sure it starts with "sk_test_" for test mode or "sk_live_" for live mode.',
      status: 401,
    }
  }

  if (error?.type === 'StripeInvalidRequestError') {
    return {
      error: error.message || 'Invalid request to Stripe',
      status: 400,
    }
  }

  if (error?.type === 'StripeCardError') {
    return {
      error: error.message || 'Card was declined',
      status: 402,
    }
  }

  if (error?.type === 'StripeRateLimitError') {
    return {
      error: 'Too many requests. Please try again later.',
      status: 429,
    }
  }

  return {
    error: 'An unexpected error occurred',
    details: error?.message || 'Please try again later',
    status: 500,
  }
}
