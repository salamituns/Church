// Email notification service for the Church donation system
// Uses Resend (https://resend.com) for email delivery

import type { Resend as ResendClient } from 'resend'
import { logger } from '@/lib/logger'

let resend: ResendClient | null = null

// Lazy initialization of Resend client
function getResendClient(): ResendClient | null {
  if (resend) {
    return resend
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    logger.warn('RESEND_API_KEY not configured. Email notifications will be disabled.')
    return null
  }

  try {
    // Dynamic import to avoid errors if resend is not installed
    const { Resend } = require('resend') as { Resend: new (key: string) => ResendClient }
    resend = new Resend(apiKey)
    return resend
  } catch (error) {
    logger.warn('Resend package not installed. Run: npm install resend')
    return null
  }
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'donations@yourchurch.com'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yourchurch.com'
const CHURCH_NAME = process.env.NEXT_PUBLIC_CHURCH_NAME || 'Our Church'

// ============================================================================
// DONOR EMAIL NOTIFICATIONS
// ============================================================================

export async function sendDonationConfirmationEmail(input: {
  to: string
  name: string
  amount: number
  purpose: string
  paymentIntentId: string
}) {
  const client = getResendClient()
  if (!client) {
    logger.warn('Email service not available. Skipping donation confirmation email.')
    return
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: input.to,
      subject: `Thank you for your donation to ${CHURCH_NAME}`,
      html: `
        <h1>Thank You for Your Generous Donation!</h1>
        <p>Dear ${input.name},</p>
        <p>Thank you for your generous donation of $${input.amount.toFixed(2)} to ${CHURCH_NAME}.</p>
        <p><strong>Purpose:</strong> ${input.purpose}</p>
        <p><strong>Transaction ID:</strong> ${input.paymentIntentId}</p>
        <p>Your support helps us continue our mission and serve our community.</p>
        <p>May God bless you abundantly!</p>
        <p>In Christ,<br>${CHURCH_NAME} Team</p>
      `,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to send donation confirmation email')
    // Don't throw - email failures shouldn't break the payment flow
  }
}

export async function sendPaymentFailureEmail(input: {
  to: string
  name: string
  errorMessage: string
}) {
  const client = getResendClient()
  if (!client) {
    logger.warn('Email service not available. Skipping payment failure email.')
    return
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: input.to,
      subject: `Payment Issue - ${CHURCH_NAME}`,
      html: `
        <h1>Payment Could Not Be Processed</h1>
        <p>Dear ${input.name},</p>
        <p>We were unable to process your donation due to the following reason:</p>
        <p><strong>${input.errorMessage}</strong></p>
        <p>Please check your payment details and try again.</p>
        <p>If you continue to experience issues, please contact us at ${ADMIN_EMAIL}</p>
        <p>Thank you for your generosity!</p>
        <p>Blessings,<br>${CHURCH_NAME} Team</p>
      `,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to send payment failure email')
  }
}

export async function sendSubscriptionWelcomeEmail(input: {
  to: string
  name: string
  amount: number
  interval: string
}) {
  const client = getResendClient()
  if (!client) {
    logger.warn('Email service not available. Skipping subscription welcome email.')
    return
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: input.to,
      subject: `Recurring Donation Confirmed - ${CHURCH_NAME}`,
      html: `
        <h1>Thank You for Your Recurring Donation!</h1>
        <p>Dear ${input.name},</p>
        <p>Your recurring donation of $${input.amount.toFixed(2)} ${input.interval}ly has been set up successfully.</p>
        <p>You will be charged automatically every ${input.interval}.</p>
        <p>You can manage your subscription at any time by contacting us at ${ADMIN_EMAIL}</p>
        <p>Your faithful support makes a lasting impact on our ministry.</p>
        <p>God bless you!</p>
        <p>In Christ,<br>${CHURCH_NAME} Team</p>
      `,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to send subscription welcome email')
  }
}

export async function sendRecurringPaymentReceipt(input: {
  to: string
  name: string
  amount: number
  invoiceId: string
  nextPaymentDate?: Date
}) {
  const client = getResendClient()
  if (!client) {
    logger.warn('Email service not available. Skipping recurring payment receipt.')
    return
  }

  const nextPayment = input.nextPaymentDate
    ? `Your next payment of $${input.amount.toFixed(2)} will be processed on ${input.nextPaymentDate.toLocaleDateString()}.`
    : ''

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: input.to,
      subject: `Donation Receipt - ${CHURCH_NAME}`,
      html: `
        <h1>Donation Receipt</h1>
        <p>Dear ${input.name},</p>
        <p>Thank you for your recurring donation of $${input.amount.toFixed(2)}.</p>
        <p><strong>Receipt ID:</strong> ${input.invoiceId}</p>
        <p>${nextPayment}</p>
        <p>Thank you for your continued support!</p>
        <p>Blessings,<br>${CHURCH_NAME} Team</p>
      `,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to send recurring payment receipt')
  }
}

export async function sendRecurringPaymentFailureEmail(input: {
  to: string
  name: string
  errorMessage: string
  invoiceId: string
}) {
  const client = getResendClient()
  if (!client) {
    logger.warn('Email service not available. Skipping recurring payment failure email.')
    return
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: input.to,
      subject: `Payment Failed - ${CHURCH_NAME}`,
      html: `
        <h1>Recurring Payment Failed</h1>
        <p>Dear ${input.name},</p>
        <p>We were unable to process your recurring donation payment.</p>
        <p><strong>Reason:</strong> ${input.errorMessage}</p>
        <p>Please update your payment method to continue your recurring donation.</p>
        <p>If you need assistance, please contact us at ${ADMIN_EMAIL}</p>
        <p>Thank you,<br>${CHURCH_NAME} Team</p>
      `,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to send recurring payment failure email')
  }
}

export async function sendSubscriptionCanceledEmail(input: {
  to: string
  name: string
}) {
  const client = getResendClient()
  if (!client) {
    logger.warn('Email service not available. Skipping subscription canceled email.')
    return
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: input.to,
      subject: `Recurring Donation Canceled - ${CHURCH_NAME}`,
      html: `
        <h1>Recurring Donation Canceled</h1>
        <p>Dear ${input.name},</p>
        <p>Your recurring donation has been canceled as requested.</p>
        <p>Thank you for your past support. You are always welcome to make one-time donations or restart your recurring giving.</p>
        <p>If this was canceled in error, please contact us at ${ADMIN_EMAIL}</p>
        <p>God bless you,<br>${CHURCH_NAME} Team</p>
      `,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to send subscription canceled email')
  }
}

export async function sendRefundConfirmationEmail(input: {
  to: string
  name: string
  amount: number
  chargeId: string
}) {
  const client = getResendClient()
  if (!client) {
    logger.warn('Email service not available. Skipping refund confirmation email.')
    return
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: input.to,
      subject: `Refund Processed - ${CHURCH_NAME}`,
      html: `
        <h1>Refund Confirmation</h1>
        <p>Dear ${input.name},</p>
        <p>A refund of $${input.amount.toFixed(2)} has been processed to your original payment method.</p>
        <p><strong>Transaction ID:</strong> ${input.chargeId}</p>
        <p>Please allow 5-10 business days for the refund to appear in your account.</p>
        <p>If you have any questions, please contact us at ${ADMIN_EMAIL}</p>
        <p>Blessings,<br>${CHURCH_NAME} Team</p>
      `,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to send refund confirmation email')
  }
}

// ============================================================================
// ADMIN NOTIFICATIONS
// ============================================================================

export async function sendAdminNotification(input: {
  type: 'one-time-donation' | 'subscription' | 'payment-failed' | 'subscription-canceled' | 'refund'
  donorName?: string
  amount?: number
  purpose?: string
  details?: string
}) {
  const client = getResendClient()
  if (!client) {
    logger.warn('Email service not available. Skipping admin notification.')
    return
  }

  let subject = ''
  let body = ''

  switch (input.type) {
    case 'one-time-donation':
      subject = `New Donation: $${input.amount?.toFixed(2)} from ${input.donorName}`
      body = `
        <h2>New Donation Received</h2>
        <p><strong>Donor:</strong> ${input.donorName}</p>
        <p><strong>Amount:</strong> $${input.amount?.toFixed(2)}</p>
        <p><strong>Purpose:</strong> ${input.purpose}</p>
      `
      break
    case 'subscription':
      subject = `New Recurring Donor: ${input.donorName}`
      body = `
        <h2>New Recurring Donation</h2>
        <p><strong>Donor:</strong> ${input.donorName}</p>
        <p><strong>Amount:</strong> $${input.amount?.toFixed(2)}</p>
        <p><strong>Purpose:</strong> ${input.purpose}</p>
      `
      break
    case 'payment-failed':
      subject = `Payment Failed: ${input.donorName}`
      body = `
        <h2>Payment Failed</h2>
        <p><strong>Donor:</strong> ${input.donorName}</p>
        <p><strong>Details:</strong> ${input.details}</p>
      `
      break
    case 'subscription-canceled':
      subject = `Subscription Canceled: ${input.donorName}`
      body = `
        <h2>Recurring Donation Canceled</h2>
        <p><strong>Donor:</strong> ${input.donorName}</p>
      `
      break
    case 'refund':
      subject = `Refund Processed: $${input.amount?.toFixed(2)}`
      body = `
        <h2>Refund Processed</h2>
        <p><strong>Donor:</strong> ${input.donorName}</p>
        <p><strong>Amount:</strong> $${input.amount?.toFixed(2)}</p>
      `
      break
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html: body,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to send admin notification')
  }
}

export async function sendAdminAlert(input: {
  type: 'payment-failed' | 'system-error' | 'webhook-error'
  message: string
  details?: unknown
}) {
  const client = getResendClient()
  if (!client) {
    logger.warn('Email service not available. Skipping admin alert.')
    return
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `ALERT: ${input.type}`,
      html: `
        <h2>System Alert</h2>
        <p><strong>Type:</strong> ${input.type}</p>
        <p><strong>Message:</strong> ${input.message}</p>
        ${input.details ? `<pre>${JSON.stringify(input.details, null, 2)}</pre>` : ''}
      `,
    })
  } catch (error) {
    logger.error({ error }, 'Failed to send admin alert')
  }
}
