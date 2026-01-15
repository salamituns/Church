// Database service for donation operations
import { prisma } from './client'
import {
  CreateDonationInput,
  CreateSubscriptionInput,
  CreateRecurringPaymentInput,
  CreateDonorInput,
  Donation,
  Subscription,
  Donor,
} from './types'

// ============================================================================
// DONATION OPERATIONS
// ============================================================================

export async function saveOneTimeDonation(input: CreateDonationInput): Promise<Donation | null> {
  try {
    const donation = await prisma.donation.create({
      data: {
        stripePaymentIntentId: input.stripePaymentIntentId,
        stripeCustomerId: input.stripeCustomerId,
        stripeChargeId: input.stripeChargeId,
        amount: input.amount,
        currency: input.currency,
        donorName: input.donorName,
        donorEmail: input.donorEmail,
        message: input.message,
        purpose: input.purpose,
        status: input.status,
        createdAt: input.createdAt || new Date(),
      },
    })

    return {
      id: donation.id,
      createdAt: donation.createdAt,
      updatedAt: donation.updatedAt,
      stripePaymentIntentId: donation.stripePaymentIntentId,
      stripeCustomerId: donation.stripeCustomerId ?? undefined,
      stripeChargeId: donation.stripeChargeId ?? undefined,
      amount: Number(donation.amount),
      currency: donation.currency,
      status: donation.status as Donation['status'],
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      message: donation.message ?? undefined,
      purpose: donation.purpose,
      refunded: donation.refunded,
      refundAmount: donation.refundAmount ? Number(donation.refundAmount) : undefined,
      refundedAt: donation.refundedAt ?? undefined,
      refundReason: donation.refundReason ?? undefined,
      failureMessage: donation.failureMessage ?? undefined,
    }
  } catch (error) {
    console.error('Error saving donation:', error)
    return null
  }
}

export async function updateDonationStatus(
  stripePaymentIntentId: string,
  status: 'succeeded' | 'failed' | 'refunded',
  errorMessage?: string
): Promise<void> {
  try {
    await prisma.donation.update({
      where: { stripePaymentIntentId },
      data: {
        status,
        failureMessage: errorMessage,
        updatedAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Error updating donation status:', error)
    throw error
  }
}

export async function recordRefund(input: {
  stripeChargeId: string
  stripePaymentIntentId: string
  refundAmount: number
  refundedAt: Date
}): Promise<void> {
  try {
    await prisma.donation.update({
      where: { stripePaymentIntentId: input.stripePaymentIntentId },
      data: {
        refunded: true,
        refundAmount: input.refundAmount,
        refundedAt: input.refundedAt,
        status: 'refunded',
        updatedAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Error recording refund:', error)
    throw error
  }
}

// ============================================================================
// SUBSCRIPTION OPERATIONS
// ============================================================================

export async function saveSubscription(input: CreateSubscriptionInput): Promise<Subscription | null> {
  try {
    const subscription = await prisma.subscription.create({
      data: {
        stripeSubscriptionId: input.stripeSubscriptionId,
        stripeCustomerId: input.stripeCustomerId,
        stripePriceId: input.stripePriceId,
        amount: input.amount,
        currency: input.currency,
        interval: input.interval,
        donorName: input.donorName,
        donorEmail: input.donorEmail,
        message: input.message,
        purpose: input.purpose,
        status: input.status,
        currentPeriodStart: input.currentPeriodStart,
        currentPeriodEnd: input.currentPeriodEnd,
      },
    })

    return {
      id: subscription.id,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      stripeCustomerId: subscription.stripeCustomerId,
      stripePriceId: subscription.stripePriceId,
      amount: Number(subscription.amount),
      currency: subscription.currency,
      interval: subscription.interval as Subscription['interval'],
      status: subscription.status as Subscription['status'],
      donorName: subscription.donorName,
      donorEmail: subscription.donorEmail,
      message: subscription.message ?? undefined,
      purpose: subscription.purpose,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      canceledAt: subscription.canceledAt ?? undefined,
      cancellationNote: subscription.cancellationNote ?? undefined,
      lastPaymentFailed: subscription.lastPaymentFailed,
      failureReason: subscription.failureReason ?? undefined,
    }
  } catch (error) {
    console.error('Error saving subscription:', error)
    return null
  }
}

export async function updateSubscription(input: {
  stripeSubscriptionId: string
  status?: string
  currentPeriodStart?: Date
  currentPeriodEnd?: Date
  canceledAt?: Date
}): Promise<void> {
  try {
    await prisma.subscription.update({
      where: { stripeSubscriptionId: input.stripeSubscriptionId },
      data: {
        status: input.status,
        currentPeriodStart: input.currentPeriodStart,
        currentPeriodEnd: input.currentPeriodEnd,
        canceledAt: input.canceledAt,
        updatedAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}

export async function updateSubscriptionPaymentStatus(input: {
  stripeSubscriptionId: string
  lastPaymentFailed: boolean
  failureReason?: string
}): Promise<void> {
  try {
    await prisma.subscription.update({
      where: { stripeSubscriptionId: input.stripeSubscriptionId },
      data: {
        lastPaymentFailed: input.lastPaymentFailed,
        failureReason: input.failureReason,
        updatedAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Error updating subscription payment status:', error)
    throw error
  }
}

export async function recordRecurringPayment(input: CreateRecurringPaymentInput): Promise<void> {
  try {
    await prisma.recurringPayment.create({
      data: {
        stripeInvoiceId: input.stripeInvoiceId,
        stripeSubscriptionId: input.stripeSubscriptionId,
        stripeChargeId: input.stripeChargeId,
        amount: input.amount,
        currency: input.currency,
        status: input.status,
        paidAt: input.paidAt,
        failureMessage: input.failureMessage,
      },
    })
  } catch (error) {
    console.error('Error recording recurring payment:', error)
    throw error
  }
}

// ============================================================================
// DONOR OPERATIONS
// ============================================================================

export async function findOrCreateDonor(input: CreateDonorInput): Promise<Donor | null> {
  try {
    const donor = await prisma.donor.upsert({
      where: { email: input.email },
      update: {
        name: input.name,
        phone: input.phone,
        address: input.address,
        stripeCustomerId: input.stripeCustomerId,
        updatedAt: new Date(),
      },
      create: {
        email: input.email,
        name: input.name,
        phone: input.phone,
        address: input.address,
        stripeCustomerId: input.stripeCustomerId,
        receiveEmails: input.receiveEmails ?? true,
        preferredPurpose: input.preferredPurpose,
      },
    })

    return {
      id: donor.id,
      createdAt: donor.createdAt,
      updatedAt: donor.updatedAt,
      email: donor.email,
      name: donor.name,
      phone: donor.phone ?? undefined,
      address: donor.address ?? undefined,
      stripeCustomerId: donor.stripeCustomerId ?? undefined,
      receiveEmails: donor.receiveEmails,
      preferredPurpose: donor.preferredPurpose ?? undefined,
      notes: donor.notes ?? undefined,
    }
  } catch (error) {
    console.error('Error finding or creating donor:', error)
    return null
  }
}

export async function getDonorByEmail(email: string): Promise<Donor | null> {
  try {
    const donor = await prisma.donor.findUnique({
      where: { email },
    })

    if (!donor) {
      return null
    }

    return {
      id: donor.id,
      createdAt: donor.createdAt,
      updatedAt: donor.updatedAt,
      email: donor.email,
      name: donor.name,
      phone: donor.phone ?? undefined,
      address: donor.address ?? undefined,
      stripeCustomerId: donor.stripeCustomerId ?? undefined,
      receiveEmails: donor.receiveEmails,
      preferredPurpose: donor.preferredPurpose ?? undefined,
      notes: donor.notes ?? undefined,
    }
  } catch (error) {
    console.error('Error getting donor by email:', error)
    return null
  }
}

export async function getDonorByStripeCustomerId(stripeCustomerId: string): Promise<Donor | null> {
  try {
    const donor = await prisma.donor.findUnique({
      where: { stripeCustomerId },
    })

    if (!donor) {
      return null
    }

    return {
      id: donor.id,
      createdAt: donor.createdAt,
      updatedAt: donor.updatedAt,
      email: donor.email,
      name: donor.name,
      phone: donor.phone ?? undefined,
      address: donor.address ?? undefined,
      stripeCustomerId: donor.stripeCustomerId ?? undefined,
      receiveEmails: donor.receiveEmails,
      preferredPurpose: donor.preferredPurpose ?? undefined,
      notes: donor.notes ?? undefined,
    }
  } catch (error) {
    console.error('Error getting donor by Stripe customer ID:', error)
    return null
  }
}

// ============================================================================
// WEBHOOK EVENT TRACKING (for idempotency)
// ============================================================================

export async function isEventProcessed(stripeEventId: string): Promise<boolean> {
  try {
    const event = await prisma.webhookEvent.findUnique({
      where: { stripeEventId },
    })
    return event?.processed || false
  } catch (error) {
    console.error('Error checking if event is processed:', error)
    return false
  }
}

export async function markEventProcessed(
  stripeEventId: string,
  eventType: string,
  eventData: any,
  error?: string
): Promise<void> {
  try {
    await prisma.webhookEvent.upsert({
      where: { stripeEventId },
      update: {
        processed: !error,
        processingError: error,
      },
      create: {
        stripeEventId,
        eventType,
        eventData,
        processed: !error,
        processingError: error,
      },
    })
  } catch (error) {
    console.error('Error marking event as processed:', error)
    throw error
  }
}

// ============================================================================
// ADMIN NOTIFICATIONS
// ============================================================================

export async function createAdminNotification(input: {
  type: 'donation' | 'subscription' | 'failure' | 'refund' | 'cancellation'
  message: string
  metadata?: any
}): Promise<void> {
  try {
    await prisma.adminNotification.create({
      data: {
        type: input.type,
        message: input.message,
        metadata: input.metadata,
      },
    })
  } catch (error) {
    console.error('Error creating admin notification:', error)
    throw error
  }
}

// ============================================================================
// REPORTING & ANALYTICS
// ============================================================================

export async function getDonationStats(startDate: Date, endDate: Date) {
  try {
    const stats = await prisma.donation.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: 'succeeded',
      },
      _sum: { amount: true },
      _count: true,
    })
    return stats
  } catch (error) {
    console.error('Error getting donation stats:', error)
    return {
      _sum: { amount: 0 },
      _count: 0,
    }
  }
}

export async function getTopDonors(limit: number = 10) {
  try {
    const topDonors = await prisma.donation.groupBy({
      by: ['donorEmail'],
      where: { status: 'succeeded' },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: limit,
    })
    return topDonors
  } catch (error) {
    console.error('Error getting top donors:', error)
    return []
  }
}
