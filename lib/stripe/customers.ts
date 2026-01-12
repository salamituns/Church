// Stripe customer management functions
import { stripe } from '../stripe'
import Stripe from 'stripe'

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
    console.error('Stripe is not configured')
    return null
  }

  try {
    // First, search for existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: input.email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      console.log('Found existing Stripe customer:', existingCustomers.data[0].id)
      return existingCustomers.data[0]
    }

    // Create new customer if not found
    const customer = await stripe.customers.create({
      email: input.email,
      name: input.name,
      phone: input.phone,
      metadata: input.metadata || {},
    })

    console.log('Created new Stripe customer:', customer.id)
    return customer
  } catch (error) {
    console.error('Error finding/creating customer:', error)
    return null
  }
}

/**
 * Get a customer by ID
 */
export async function getCustomer(customerId: string): Promise<Stripe.Customer | null> {
  if (!stripe) {
    console.error('Stripe is not configured')
    return null
  }

  try {
    const customer = await stripe.customers.retrieve(customerId)
    if (customer.deleted) {
      return null
    }
    return customer as Stripe.Customer
  } catch (error) {
    console.error('Error retrieving customer:', error)
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
    console.error('Stripe is not configured')
    return null
  }

  try {
    const customer = await stripe.customers.update(customerId, updates)
    console.log('Updated customer:', customer.id)
    return customer
  } catch (error) {
    console.error('Error updating customer:', error)
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
    console.error('Stripe is not configured')
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

    console.log('Payment method attached to customer:', customerId)
    return true
  } catch (error) {
    console.error('Error attaching payment method:', error)
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
    console.error('Stripe is not configured')
    return []
  }

  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type,
    })
    return paymentMethods.data
  } catch (error) {
    console.error('Error listing payment methods:', error)
    return []
  }
}

/**
 * Detach a payment method from a customer
 */
export async function detachPaymentMethod(paymentMethodId: string): Promise<boolean> {
  if (!stripe) {
    console.error('Stripe is not configured')
    return false
  }

  try {
    await stripe.paymentMethods.detach(paymentMethodId)
    console.log('Payment method detached:', paymentMethodId)
    return true
  } catch (error) {
    console.error('Error detaching payment method:', error)
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
    console.error('Stripe is not configured')
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
    console.error('Error listing subscriptions:', error)
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
    console.error('Stripe is not configured')
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

    console.log('Subscription canceled:', subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
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
    console.error('Stripe is not configured')
    return null
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return session.url
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    return null
  }
}

/**
 * Get customer's total donation amount
 */
export async function getCustomerTotalDonations(customerId: string): Promise<number> {
  if (!stripe) {
    console.error('Stripe is not configured')
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
    console.error('Error calculating total donations:', error)
    return 0
  }
}
