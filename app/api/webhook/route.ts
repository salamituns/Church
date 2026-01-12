import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, webhookSecret, isStripeConfigured, isWebhookConfigured } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  if (!isStripeConfigured() || !stripe || !isWebhookConfigured() || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe webhook is not configured. Please add STRIPE_WEBHOOK_SECRET to your environment variables.' },
      { status: 500 }
    )
  }

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
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle different event types
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
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    // Return 200 to acknowledge receipt even if processing failed
    // This prevents Stripe from retrying if our business logic has issues
    return NextResponse.json({ received: true, error: 'Processing failed' }, { status: 200 })
  }
}

// Webhook event handlers
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('✅ Payment succeeded:', paymentIntent.id)

  const metadata = paymentIntent.metadata
  const amount = paymentIntent.amount / 100 // Convert from cents
  const customerEmail = paymentIntent.receipt_email

  // TODO: Save to database
  // await saveOneTimeDonation({
  //   stripePaymentIntentId: paymentIntent.id,
  //   amount,
  //   currency: paymentIntent.currency,
  //   donorName: metadata.name,
  //   donorEmail: metadata.email || customerEmail || '',
  //   message: metadata.message || '',
  //   purpose: metadata.purpose || 'Offering',
  //   status: 'succeeded',
  //   createdAt: new Date(paymentIntent.created * 1000),
  // })

  // TODO: Send confirmation email
  // await sendDonationConfirmationEmail({
  //   to: metadata.email || customerEmail || '',
  //   name: metadata.name,
  //   amount,
  //   purpose: metadata.purpose || 'Offering',
  //   paymentIntentId: paymentIntent.id,
  // })

  // TODO: Send admin notification
  // await sendAdminNotification({
  //   type: 'one-time-donation',
  //   amount,
  //   donorName: metadata.name,
  //   purpose: metadata.purpose,
  // })
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id)

  const metadata = paymentIntent.metadata
  const customerEmail = paymentIntent.receipt_email
  const errorMessage = paymentIntent.last_payment_error?.message || 'Unknown error'

  // TODO: Update database
  // await updateDonationStatus({
  //   stripePaymentIntentId: paymentIntent.id,
  //   status: 'failed',
  //   errorMessage,
  // })

  // TODO: Send failure notification to customer
  // await sendPaymentFailureEmail({
  //   to: metadata.email || customerEmail || '',
  //   name: metadata.name,
  //   errorMessage,
  // })

  // TODO: Alert admin of failed payment
  // await sendAdminAlert({
  //   type: 'payment-failed',
  //   paymentIntentId: paymentIntent.id,
  //   errorMessage,
  // })
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription created:', subscription.id)

  const metadata = subscription.metadata
  const amount = subscription.items.data[0]?.price.unit_amount || 0
  const interval = subscription.items.data[0]?.price.recurring?.interval

  // TODO: Save to database
  // await saveSubscription({
  //   stripeSubscriptionId: subscription.id,
  //   stripeCustomerId: subscription.customer as string,
  //   amount: amount / 100,
  //   interval: interval || 'month',
  //   donorName: metadata.name,
  //   donorEmail: metadata.email || '',
  //   purpose: metadata.purpose || 'Offering',
  //   status: subscription.status,
  //   currentPeriodStart: new Date(subscription.current_period_start * 1000),
  //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  // })

  // TODO: Send welcome email
  // await sendSubscriptionWelcomeEmail({
  //   to: metadata.email || '',
  //   name: metadata.name,
  //   amount: amount / 100,
  //   interval,
  // })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription updated:', subscription.id)

  // TODO: Update database
  // await updateSubscription({
  //   stripeSubscriptionId: subscription.id,
  //   status: subscription.status,
  //   currentPeriodStart: new Date(subscription.current_period_start * 1000),
  //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  // })

  // Handle subscription status changes
  if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
    // TODO: Send cancellation email
    // await sendSubscriptionCanceledEmail({...})
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('🛑 Subscription canceled:', subscription.id)

  const metadata = subscription.metadata

  // TODO: Update database
  // await updateSubscription({
  //   stripeSubscriptionId: subscription.id,
  //   status: 'canceled',
  //   canceledAt: new Date(),
  // })

  // TODO: Send cancellation confirmation email
  // await sendSubscriptionCanceledEmail({
  //   to: metadata.email || '',
  //   name: metadata.name,
  // })

  // TODO: Notify admin
  // await sendAdminNotification({
  //   type: 'subscription-canceled',
  //   subscriptionId: subscription.id,
  // })
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('✅ Checkout session completed:', session.id)

  // For subscription checkouts, the subscription.created event will handle the logic
  // This is mainly for any additional processing needed

  const metadata = session.metadata

  // TODO: Log checkout completion
  // await logCheckoutCompletion({
  //   sessionId: session.id,
  //   customerId: session.customer as string,
  //   subscriptionId: session.subscription as string,
  //   metadata,
  // })
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('💰 Invoice payment succeeded:', invoice.id)

  // This fires for recurring subscription payments
  const subscriptionId = (invoice as any).subscription as string
  const amount = invoice.amount_paid / 100

  // TODO: Record recurring payment
  // await recordRecurringPayment({
  //   stripeInvoiceId: invoice.id,
  //   stripeSubscriptionId: subscriptionId,
  //   amount,
  //   paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
  // })

  // TODO: Send receipt email
  // await sendRecurringPaymentReceipt({
  //   invoiceId: invoice.id,
  //   amount,
  // })
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('❌ Invoice payment failed:', invoice.id)

  const subscriptionId = (invoice as any).subscription as string

  // TODO: Update subscription status
  // await updateSubscriptionPaymentStatus({
  //   stripeSubscriptionId: subscriptionId,
  //   lastPaymentFailed: true,
  //   failureReason: invoice.last_finalization_error?.message || 'Payment failed',
  // })

  // TODO: Send payment failure notification
  // await sendRecurringPaymentFailureEmail({
  //   invoiceId: invoice.id,
  // })
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log('💸 Charge refunded:', charge.id)

  const refundAmount = charge.amount_refunded / 100
  const paymentIntentId = charge.payment_intent as string

  // TODO: Update database
  // await recordRefund({
  //   stripeChargeId: charge.id,
  //   stripePaymentIntentId: paymentIntentId,
  //   refundAmount,
  //   refundedAt: new Date(),
  // })

  // TODO: Send refund confirmation
  // await sendRefundConfirmationEmail({
  //   chargeId: charge.id,
  //   amount: refundAmount,
  // })
}

// Disable body parsing for webhook route
export const runtime = 'nodejs'
