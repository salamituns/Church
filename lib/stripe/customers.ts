// Stripe customer management functions
import { stripe } from '../stripe'
import Stripe from 'stripe'
import { logger } from '@/lib/logger'

/**
 * Find or create a Stripe customer
 */
export async function findOrCreateCustomer(input: {
  email: string
  name: string
  phone?: string
  metadata?: Record<string, string>
}): Promise<Stripe.Customer | null> {
  if (!stripe) {
    logger.warn('Stripe is not configured')
    return null
  }

  try {
    // First, search for existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: input.email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      logger.info({ customerId: existingCustomers.data[0].id }, 'Found existing Stripe customer')
      return existingCustomers.data[0]
    }

    // Create new customer if not found
    const customer = await stripe.customers.create({
      email: input.email,
      name: input.name,
      phone: input.phone,
      metadata: input.metadata || {},
    })

    logger.info({ customerId: customer.id }, 'Created new Stripe customer')
    return customer
  } catch (error) {
    logger.error({ error }, 'Error finding/creating customer')
    return null
  }
}

/**
 * Get a customer by ID
 */
export async function getCustomer(customerId: string): Promise<Stripe.Customer | null> {
  if (!stripe) {
    logger.warn('Stripe is not configured')
    return null
  }

  try {
    const customer = await stripe.customers.retrieve(customerId)
    if (customer.deleted) {
      return null
    }
    return customer as Stripe.Customer
  } catch (error) {
    logger.error({ error, customerId }, 'Error retrieving customer')
    return null
  }
}

/**
 * Update customer information
 */
export async function updateCustomer(
  customerId: string,
  updates: {
    name?: string
    email?: string
    phone?: string
    metadata?: Record<string, string>
  }
): Promise<Stripe.Customer | null> {
  if (!stripe) {
    logger.warn('Stripe is not configured')
    return null
  }

  try {
    const customer = await stripe.customers.update(customerId, updates)
    logger.info({ customerId: customer.id }, 'Updated customer')
    return customer
  } catch (error) {
    logger.error({ error, customerId }, 'Error updating customer')
    return null
  }
}

/**
 * Attach a payment method to a customer
 */
export async function attachPaymentMethod(
  customerId: string,
  paymentMethodId: string,
  setAsDefault: boolean = true
): Promise<boolean> {
  if (!stripe) {
    logger.warn('Stripe is not configured')
    return false
  }

  try {
    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    })

    // Set as default if requested
    if (setAsDefault) {
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      })
    }

    logger.info({ customerId, paymentMethodId }, 'Payment method attached to customer')
    return true
  } catch (error) {
    logger.error({ error, customerId, paymentMethodId }, 'Error attaching payment method')
    return false
  }
}

/**
 * List all payment methods for a customer
 */
export async function listCustomerPaymentMethods(
  customerId: string,
  type: 'card' | 'us_bank_account' = 'card'
): Promise<Stripe.PaymentMethod[]> {
  if (!stripe) {
    logger.warn('Stripe is not configured')
    return []
  }

  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type,
    })
    return paymentMethods.data
  } catch (error) {
    logger.error({ error, customerId }, 'Error listing payment methods')
    return []
  }
}

/**
 * Detach a payment method from a customer
 */
export async function detachPaymentMethod(paymentMethodId: string): Promise<boolean> {
  if (!stripe) {
    logger.warn('Stripe is not configured')
    return false
  }

  try {
    await stripe.paymentMethods.detach(paymentMethodId)
    logger.info({ paymentMethodId }, 'Payment method detached')
    return true
  } catch (error) {
    logger.error({ error, paymentMethodId }, 'Error detaching payment method')
    return false
  }
}

/**
 * Get all subscriptions for a customer
 */
export async function getCustomerSubscriptions(
  customerId: string,
  status?: 'active' | 'past_due' | 'canceled' | 'all'
): Promise<Stripe.Subscription[]> {
  if (!stripe) {
    logger.warn('Stripe is not configured')
    return []
  }

  try {
    const params: Stripe.SubscriptionListParams = {
      customer: customerId,
      limit: 100,
    }

    if (status && status !== 'all') {
      params.status = status
    }

    const subscriptions = await stripe.subscriptions.list(params)
    return subscriptions.data
  } catch (error) {
    logger.error({ error, customerId }, 'Error listing subscriptions')
    return []
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<Stripe.Subscription | null> {
  if (!stripe) {
    logger.warn('Stripe is not configured')
    return null
  }

  try {
    let subscription: Stripe.Subscription

    if (immediately) {
      // Cancel immediately
      subscription = await stripe.subscriptions.cancel(subscriptionId)
    } else {
      // Cancel at period end
      subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      })
    }

    logger.info({ subscriptionId }, 'Subscription canceled')
    return subscription
  } catch (error) {
    logger.error({ error, subscriptionId }, 'Error canceling subscription')
    return null
  }
}

/**
 * Create a customer portal session
 * This allows customers to manage their subscriptions and payment methods
 */
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string | null> {
  if (!stripe) {
    logger.warn('Stripe is not configured')
    return null
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return session.url
  } catch (error) {
    logger.error({ error, customerId }, 'Error creating customer portal session')
    return null
  }
}

/**
 * Get customer's total donation amount
 */
export async function getCustomerTotalDonations(customerId: string): Promise<number> {
  if (!stripe) {
    logger.warn('Stripe is not configured')
    return 0
  }

  try {
    // Get all successful charges for this customer
    const charges = await stripe.charges.list({
      customer: customerId,
      limit: 100, // Adjust if needed
    })

    const total = charges.data
      .filter((charge) => charge.status === 'succeeded' && !charge.refunded)
      .reduce((sum, charge) => sum + charge.amount, 0)

    return total / 100 // Convert from cents to dollars
  } catch (error) {
    logger.error({ error, customerId }, 'Error calculating total donations')
    return 0
  }
}
