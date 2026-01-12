// Database types for the Church donation system
// These types mirror the Prisma schema but can be used without Prisma

export interface Donation {
  id: string
  createdAt: Date
  updatedAt: Date

  // Stripe fields
  stripePaymentIntentId: string
  stripeCustomerId?: string
  stripeChargeId?: string

  // Donation details
  amount: number
  currency: string
  status: 'succeeded' | 'failed' | 'refunded' | 'pending'

  // Donor information
  donorName: string
  donorEmail: string
  message?: string
  purpose: string

  // Refund tracking
  refunded: boolean
  refundAmount?: number
  refundedAt?: Date
  refundReason?: string

  // Failed payment tracking
  failureMessage?: string
}

export interface Subscription {
  id: string
  createdAt: Date
  updatedAt: Date

  // Stripe fields
  stripeSubscriptionId: string
  stripeCustomerId: string
  stripePriceId: string

  // Subscription details
  amount: number
  currency: string
  interval: 'week' | 'month' | 'year'
  status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'unpaid' | 'trialing'

  // Donor information
  donorName: string
  donorEmail: string
  message?: string
  purpose: string

  // Period tracking
  currentPeriodStart: Date
  currentPeriodEnd: Date

  // Cancellation tracking
  canceledAt?: Date
  cancellationNote?: string

  // Payment tracking
  lastPaymentFailed: boolean
  failureReason?: string
}

export interface RecurringPayment {
  id: string
  createdAt: Date

  // Stripe fields
  stripeInvoiceId: string
  stripeSubscriptionId: string
  stripeChargeId?: string

  // Payment details
  amount: number
  currency: string
  status: 'paid' | 'failed' | 'pending'
  paidAt?: Date

  // Failure tracking
  failureMessage?: string
}

export interface Donor {
  id: string
  createdAt: Date
  updatedAt: Date

  // Donor information
  email: string
  name: string
  phone?: string
  address?: string

  // Stripe customer ID
  stripeCustomerId?: string

  // Preferences
  receiveEmails: boolean
  preferredPurpose?: string
  notes?: string
}

export interface WebhookEvent {
  id: string
  createdAt: Date

  // Stripe event details
  stripeEventId: string
  eventType: string
  processed: boolean
  processingError?: string

  // Event data
  eventData: any
}

export interface AdminNotification {
  id: string
  createdAt: Date

  // Notification details
  type: 'donation' | 'subscription' | 'failure' | 'refund' | 'cancellation'
  message: string
  metadata?: any

  // Status
  sent: boolean
  sentAt?: Date
  readAt?: Date
}

// Input types for creating records
export interface CreateDonationInput {
  stripePaymentIntentId: string
  stripeCustomerId?: string
  stripeChargeId?: string
  amount: number
  currency: string
  donorName: string
  donorEmail: string
  message?: string
  purpose: string
  status: 'succeeded' | 'failed' | 'pending'
  createdAt?: Date
}

export interface CreateSubscriptionInput {
  stripeSubscriptionId: string
  stripeCustomerId: string
  stripePriceId: string
  amount: number
  currency: string
  interval: 'week' | 'month' | 'year'
  donorName: string
  donorEmail: string
  message?: string
  purpose: string
  status: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
}

export interface CreateRecurringPaymentInput {
  stripeInvoiceId: string
  stripeSubscriptionId: string
  stripeChargeId?: string
  amount: number
  currency: string
  status: 'paid' | 'failed'
  paidAt?: Date
  failureMessage?: string
}

export interface CreateDonorInput {
  email: string
  name: string
  phone?: string
  address?: string
  stripeCustomerId?: string
  receiveEmails?: boolean
  preferredPurpose?: string
}
