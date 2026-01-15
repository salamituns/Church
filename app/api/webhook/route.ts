import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, webhookSecret, isStripeConfigured, isWebhookConfigured } from '@/lib/stripe'
import { logger } from '@/lib/logger'
import { webhookRateLimiter, getClientIP, checkRateLimit } from '@/lib/ratelimit'
import {
  saveOneTimeDonation,
  updateDonationStatus,
  recordRefund,
  saveSubscription,
  updateSubscription,
  updateSubscriptionPaymentStatus,
  recordRecurringPayment,
  isEventProcessed,
  markEventProcessed,
  createAdminNotification,
} from '@/lib/db/donations'
import {
  sendDonationConfirmationEmail,
  sendPaymentFailureEmail,
  sendSubscriptionWelcomeEmail,
  sendRecurringPaymentReceipt,
  sendRecurringPaymentFailureEmail,
  sendSubscriptionCanceledEmail,
  sendRefundConfirmationEmail,
  sendAdminNotification,
  sendAdminAlert,
} from '@/lib/email/notifications'

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIP = getClientIP(request)
  const rateLimitResult = await checkRateLimit(webhookRateLimiter, clientIP)
  if (!rateLimitResult.success) {
    logger.warn({ clientIP, limit: rateLimitResult.limit }, 'Rate limit exceeded for webhook')
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

  if (!isStripeConfigured() || !stripe || !isWebhookConfigured() || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe webhook is not configured. Please add STRIPE_WEBHOOK_SECRET to your environment variables.' },
      { status: 500 }
    )
  }

  // At this point, stripe and webhookSecret are guaranteed to be non-null
  const stripeInstance = stripe
  const webhookSecretValue = webhookSecret

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripeInstance.webhooks.constructEvent(body, signature, webhookSecretValue)
  } catch (err) {
    // Log generic error to avoid information leakage
    logger.error('Webhook signature verification failed')
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Check if event was already processed (idempotency)
  const alreadyProcessed = await isEventProcessed(event.id)
  if (alreadyProcessed) {
    return NextResponse.json({ received: true, message: 'Event already processed' })
  }

  // Handle different event types
  let processingError: string | undefined

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, stripeInstance)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, stripeInstance)
        break

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge, stripeInstance)
        break

      default:
        // Log unhandled events for monitoring but don't treat as errors
        logger.debug({ eventType: event.type, eventId: event.id }, 'Unhandled webhook event type')
    }

    // Mark event as successfully processed
    await markEventProcessed(event.id, event.type, event.data, undefined)

    return NextResponse.json({ received: true })
  } catch (error) {
    // Log generic error message to avoid information leakage
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error({ 
      eventType: event.type, 
      eventId: event.id,
      error: errorMessage,
    }, 'Error processing webhook event')
    processingError = errorMessage

    // Mark event as processed with error
    await markEventProcessed(event.id, event.type, event.data, errorMessage).catch(() => {
      // If marking fails, log but don't throw
      logger.error({ eventId: event.id }, 'Failed to mark event as processed')
    })

    // Send admin alert for critical errors
    await sendAdminAlert({
      type: 'webhook-error',
      message: `Failed to process webhook event: ${event.type}`,
      details: { eventId: event.id, eventType: event.type },
    }).catch(() => {
      // Don't fail if alert sending fails
    })

    // Return 200 to acknowledge receipt even if processing failed
    // This prevents Stripe from retrying if our business logic has issues
    return NextResponse.json({ received: true, error: 'Processing failed' }, { status: 200 })
  }
}

// Webhook event handlers
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const metadata = paymentIntent.metadata
  const amount = paymentIntent.amount / 100 // Convert from cents
  const customerEmail = paymentIntent.receipt_email || undefined
  const donorEmail = metadata.email || customerEmail || ''
  const donorName = metadata.name || 'Anonymous'

  // Save to database
  await saveOneTimeDonation({
    stripePaymentIntentId: paymentIntent.id,
    stripeCustomerId: typeof paymentIntent.customer === 'string' ? paymentIntent.customer : undefined,
    stripeChargeId: typeof paymentIntent.latest_charge === 'string' ? paymentIntent.latest_charge : undefined,
    amount,
    currency: paymentIntent.currency,
    donorName,
    donorEmail,
    message: metadata.message || '',
    purpose: metadata.purpose || 'Offering',
    status: 'succeeded',
    createdAt: new Date(paymentIntent.created * 1000),
  })

  // Send confirmation email
  if (donorEmail) {
    await sendDonationConfirmationEmail({
      to: donorEmail,
      name: donorName,
      amount,
      purpose: metadata.purpose || 'Offering',
      paymentIntentId: paymentIntent.id,
    })
  }

  // Send admin notification
  await sendAdminNotification({
    type: 'one-time-donation',
    amount,
    donorName,
    purpose: metadata.purpose || 'Offering',
  })
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const metadata = paymentIntent.metadata
  const customerEmail = paymentIntent.receipt_email || undefined
  const errorMessage = paymentIntent.last_payment_error?.message || 'Unknown error'
  const donorEmail = metadata.email || customerEmail || ''
  const donorName = metadata.name || 'Anonymous'

  // Update database
  await updateDonationStatus(paymentIntent.id, 'failed', errorMessage)

  // Send failure notification to customer
  if (donorEmail) {
    await sendPaymentFailureEmail({
      to: donorEmail,
      name: donorName,
      errorMessage,
    })
  }

  // Alert admin of failed payment
  await sendAdminAlert({
    type: 'payment-failed',
    message: `Payment failed for ${donorName}`,
    details: {
      paymentIntentId: paymentIntent.id,
      errorMessage,
      donorEmail,
    },
  })
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const metadata = subscription.metadata
  const amount = subscription.items.data[0]?.price.unit_amount || 0
  const interval = subscription.items.data[0]?.price.recurring?.interval || 'month'
  const donorEmail = metadata.email || ''
  const donorName = metadata.name || 'Anonymous'
  const stripeCustomerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id || ''
  const stripePriceId = subscription.items.data[0]?.price.id || ''

  // Save to database
  // Type assertion: current_period_start and current_period_end are required fields in Stripe subscriptions
  const periodStart = (subscription as any).current_period_start ?? subscription.created
  const periodEnd = (subscription as any).current_period_end ?? subscription.created
  await saveSubscription({
    stripeSubscriptionId: subscription.id,
    stripeCustomerId,
    stripePriceId,
    amount: amount / 100,
    currency: subscription.currency || 'usd',
    interval: interval as 'week' | 'month' | 'year',
    donorName,
    donorEmail,
    message: metadata.message || '',
    purpose: metadata.purpose || 'Offering',
    status: subscription.status,
    currentPeriodStart: new Date(periodStart * 1000),
    currentPeriodEnd: new Date(periodEnd * 1000),
  })

  // Send welcome email
  if (donorEmail) {
    await sendSubscriptionWelcomeEmail({
      to: donorEmail,
      name: donorName,
      amount: amount / 100,
      interval,
    })
  }

  // Send admin notification
  await sendAdminNotification({
    type: 'subscription',
    donorName,
    amount: amount / 100,
    purpose: metadata.purpose || 'Offering',
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Update database
  // Type assertion: current_period_start and current_period_end are required fields in Stripe subscriptions
  const periodStart = (subscription as any).current_period_start
  const periodEnd = (subscription as any).current_period_end
  await updateSubscription({
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodStart: periodStart ? new Date(periodStart * 1000) : undefined,
    currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
  })

  // Handle subscription status changes
  if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
    const metadata = subscription.metadata
    const donorEmail = metadata.email || ''
    const donorName = metadata.name || 'Anonymous'

    if (donorEmail) {
      await sendSubscriptionCanceledEmail({
        to: donorEmail,
        name: donorName,
      })
    }

    await sendAdminNotification({
      type: 'subscription-canceled',
      donorName,
    })
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const metadata = subscription.metadata
  const donorEmail = metadata.email || ''
  const donorName = metadata.name || 'Anonymous'

  // Update database
  await updateSubscription({
    stripeSubscriptionId: subscription.id,
    status: 'canceled',
    canceledAt: new Date(),
  })

  // Send cancellation confirmation email
  if (donorEmail) {
    await sendSubscriptionCanceledEmail({
      to: donorEmail,
      name: donorName,
    })
  }

  // Notify admin
  await sendAdminNotification({
    type: 'subscription-canceled',
    donorName,
  })
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // For subscription checkouts, the subscription.created event will handle the logic
  // This is mainly for any additional processing needed
  // No action needed here as subscription.created handles the main logic
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, stripeInstance: Stripe) {
  // This fires for recurring subscription payments
  // Type assertion: subscription and charge are expandable fields in Stripe invoices
  const invoiceAny = invoice as any
  const subscriptionId = typeof invoiceAny.subscription === 'string' 
    ? invoiceAny.subscription 
    : invoiceAny.subscription?.id || ''
  const amount = invoice.amount_paid / 100
  const chargeId = typeof invoiceAny.charge === 'string' 
    ? invoiceAny.charge 
    : invoiceAny.charge?.id || undefined
  const paidAt = invoiceAny.status_transitions?.paid_at
    ? new Date(invoiceAny.status_transitions.paid_at * 1000)
    : new Date()

  // Record recurring payment
  await recordRecurringPayment({
    stripeInvoiceId: invoice.id,
    stripeSubscriptionId: subscriptionId,
    stripeChargeId: chargeId,
    amount,
    currency: invoice.currency || 'usd',
    status: 'paid',
    paidAt,
  })

  // Get subscription to find donor info
  const subscription = await stripeInstance.subscriptions.retrieve(subscriptionId).catch(() => null)
  const metadata = subscription?.metadata || {}
  const donorEmail = metadata.email || invoice.customer_email || ''
  const donorName = metadata.name || 'Anonymous'

  // Calculate next payment date
  // Type assertion: current_period_end is a required field in Stripe subscriptions
  const subscriptionAny = subscription as any
  const nextPaymentDate = subscriptionAny?.current_period_end
    ? new Date(subscriptionAny.current_period_end * 1000)
    : undefined

  // Send receipt email
  if (donorEmail) {
    await sendRecurringPaymentReceipt({
      to: donorEmail,
      name: donorName,
      amount,
      invoiceId: invoice.id,
      nextPaymentDate,
    })
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, stripeInstance: Stripe) {
  // Type assertion: subscription is an expandable field in Stripe invoices
  const invoiceAny = invoice as any
  const subscriptionId = typeof invoiceAny.subscription === 'string' 
    ? invoiceAny.subscription 
    : invoiceAny.subscription?.id || ''
  const failureReason = invoiceAny.last_finalization_error?.message || 'Payment failed'

  // Update subscription status
  await updateSubscriptionPaymentStatus({
    stripeSubscriptionId: subscriptionId,
    lastPaymentFailed: true,
    failureReason,
  })

  // Record failed payment
  await recordRecurringPayment({
    stripeInvoiceId: invoice.id,
    stripeSubscriptionId: subscriptionId,
    amount: invoice.amount_due / 100,
    currency: invoice.currency || 'usd',
    status: 'failed',
    failureMessage: failureReason,
  })

  // Get subscription to find donor info
  const subscription = await stripeInstance.subscriptions.retrieve(subscriptionId).catch(() => null)
  const metadata = subscription?.metadata || {}
  const donorEmail = metadata.email || invoice.customer_email || ''
  const donorName = metadata.name || 'Anonymous'

  // Send payment failure notification
  if (donorEmail) {
    await sendRecurringPaymentFailureEmail({
      to: donorEmail,
      name: donorName,
      errorMessage: failureReason,
      invoiceId: invoice.id,
    })
  }
}

async function handleChargeRefunded(charge: Stripe.Charge, stripeInstance: Stripe) {
  const refundAmount = charge.amount_refunded / 100
  const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id || ''

  // Update database
  await recordRefund({
    stripeChargeId: charge.id,
    stripePaymentIntentId: paymentIntentId,
    refundAmount,
    refundedAt: new Date(),
  })

  // Get payment intent to find donor info
  const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId).catch(() => null)
  const metadata = paymentIntent?.metadata || {}
  const donorEmail = metadata.email || paymentIntent?.receipt_email || ''
  const donorName = metadata.name || 'Anonymous'

  // Send refund confirmation
  if (donorEmail) {
    await sendRefundConfirmationEmail({
      to: donorEmail,
      name: donorName,
      amount: refundAmount,
      chargeId: charge.id,
    })
  }

  // Notify admin
  await sendAdminNotification({
    type: 'refund',
    donorName,
    amount: refundAmount,
  })
}

// Disable body parsing for webhook route
export const runtime = 'nodejs'
