# Stripe Implementation Guide

This document outlines the improved Stripe integration for the church donation system.

## What Was Done

### 1. Centralized Stripe Client (`lib/stripe.ts`)

Created a single source of truth for Stripe configuration:
- ✅ Exports configured Stripe instance
- ✅ Handles API key validation
- ✅ Provides webhook secret access
- ✅ Includes helper functions for error handling
- ✅ Type-safe error responses

**Benefits:**
- No code duplication
- Consistent error handling across all routes
- Easier to maintain and update

### 2. Updated API Routes

All three API routes now use the centralized client:
- ✅ `app/api/create-payment-intent/route.ts`
- ✅ `app/api/create-subscription/route.ts`
- ✅ `app/api/webhook/route.ts`

### 3. Comprehensive Webhook Handlers (`app/api/webhook/route.ts`)

Implemented handlers for all critical Stripe events:
- ✅ `payment_intent.succeeded` - One-time donation success
- ✅ `payment_intent.payment_failed` - Payment failure
- ✅ `customer.subscription.created` - New subscription
- ✅ `customer.subscription.updated` - Subscription changes
- ✅ `customer.subscription.deleted` - Subscription cancellation
- ✅ `checkout.session.completed` - Checkout completion
- ✅ `invoice.payment_succeeded` - Recurring payment success
- ✅ `invoice.payment_failed` - Recurring payment failure
- ✅ `charge.refunded` - Refund processed

Each handler includes:
- Logging with clear emoji indicators
- Data extraction from Stripe events
- TODO comments showing where to add business logic
- Error handling that prevents webhook retry loops

### 4. Database Schema (`prisma/schema.prisma`)

Created a complete Prisma schema with tables for:
- **Donations** - One-time donations with refund tracking
- **Subscriptions** - Recurring donations with status tracking
- **RecurringPayment** - Individual subscription payment records
- **Donor** - Donor profiles with preferences
- **WebhookEvent** - Webhook event log for idempotency
- **AdminNotification** - Admin notification queue

**Key Features:**
- Proper indexes for performance
- Relationships between tables
- Metadata storage for flexibility
- Timestamps for auditing

### 5. Database Service Layer (`lib/db/donations.ts`)

Created database operation functions:

**Donation Operations:**
- `saveOneTimeDonation()` - Save donation record
- `updateDonationStatus()` - Update donation status
- `recordRefund()` - Record refund

**Subscription Operations:**
- `saveSubscription()` - Save subscription record
- `updateSubscription()` - Update subscription
- `updateSubscriptionPaymentStatus()` - Track payment status
- `recordRecurringPayment()` - Record recurring payment

**Donor Operations:**
- `findOrCreateDonor()` - Upsert donor record
- `getDonorByEmail()` - Find donor by email
- `getDonorByStripeCustomerId()` - Find donor by Stripe ID

**Webhook Idempotency:**
- `isEventProcessed()` - Check if event was already processed
- `markEventProcessed()` - Mark event as processed

**Reporting:**
- `getDonationStats()` - Get donation statistics
- `getTopDonors()` - Get top donors

### 6. Email Notification Service (`lib/email/notifications.ts`)

Created email notification functions:

**Donor Emails:**
- `sendDonationConfirmationEmail()` - Thank you for one-time donation
- `sendPaymentFailureEmail()` - Payment failed notification
- `sendSubscriptionWelcomeEmail()` - Welcome to recurring giving
- `sendRecurringPaymentReceipt()` - Monthly/weekly receipt
- `sendRecurringPaymentFailureEmail()` - Failed recurring payment
- `sendSubscriptionCanceledEmail()` - Subscription canceled
- `sendRefundConfirmationEmail()` - Refund processed

**Admin Emails:**
- `sendAdminNotification()` - New donations/subscriptions
- `sendAdminAlert()` - System errors and issues

### 7. Customer Management (`lib/stripe/customers.ts`)

Created Stripe customer management functions:
- `findOrCreateCustomer()` - Find or create Stripe customer
- `getCustomer()` - Get customer by ID
- `updateCustomer()` - Update customer information
- `attachPaymentMethod()` - Attach payment method
- `listCustomerPaymentMethods()` - List all payment methods
- `detachPaymentMethod()` - Remove payment method
- `getCustomerSubscriptions()` - Get customer's subscriptions
- `cancelSubscription()` - Cancel a subscription
- `createCustomerPortalSession()` - Create self-service portal
- `getCustomerTotalDonations()` - Get lifetime donation total

### 8. Type Definitions (`lib/db/types.ts`)

Created TypeScript types for:
- Donation
- Subscription
- RecurringPayment
- Donor
- WebhookEvent
- AdminNotification
- Create input types for all entities

## What Still Needs To Be Done

### High Priority

#### 1. Add Webhook Secret to Environment

Update `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

To get your webhook secret:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter URL: `https://yourdomain.com/api/webhook`
4. Select events (listed in docs/guides/stripe-setup.md)
5. Copy the signing secret

#### 2. Set Up Database

**Option A: Use Prisma (Recommended)**

```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# The schema is already in prisma/schema.prisma

# Add DATABASE_URL to .env.local
echo "DATABASE_URL=postgresql://user:password@localhost:5432/church" >> .env.local

# Run migration
npx prisma migrate dev --name init

# Generate client
npx prisma generate
```

**Option B: Use another ORM**

Implement the functions in `lib/db/donations.ts` using your preferred database library.

#### 3. Implement Database Operations

Uncomment and complete the TODO sections in:
- `lib/db/donations.ts` - Implement all database operations
- `app/api/webhook/route.ts` - Uncomment database save calls

#### 4. Set Up Email Service

**Option A: Use Resend (Recommended)**

```bash
# Install Resend
npm install resend

# Add to .env.local
echo "RESEND_API_KEY=re_your_api_key" >> .env.local
echo "EMAIL_FROM=donations@yourchurch.com" >> .env.local
echo "ADMIN_EMAIL=admin@yourchurch.com" >> .env.local
```

Then uncomment the Resend implementation in `lib/email/notifications.ts`.

**Option B: Use another service**

Implement the email functions using SendGrid, Mailgun, or your preferred service.

#### 5. Implement Email Notifications

Uncomment the email notification calls in `app/api/webhook/route.ts`:
- Line 108-115: Donation confirmation
- Line 117-123: Admin notification
- Line 140-145: Payment failure email
- Line 147-152: Admin alert
- Line 176-182: Subscription welcome
- And all other email TODO sections

#### 6. Fix Subscription Price Creation

Current implementation creates a new Price for every subscription (inefficient).

**Better approach:**

1. Create Products and Prices in Stripe Dashboard:
   - Weekly Donation - Price ID: `price_weekly_donation`
   - Monthly Donation - Price ID: `price_monthly_donation`

2. Update `app/api/create-subscription/route.ts`:

```typescript
// Instead of creating prices dynamically:
const priceId = frequency === 'weekly'
  ? process.env.STRIPE_PRICE_WEEKLY
  : process.env.STRIPE_PRICE_MONTHLY

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price: priceId,
    quantity: 1,
  }],
  mode: 'subscription',
  // ... rest of config
})
```

3. Add to `.env.local`:
```env
STRIPE_PRICE_WEEKLY=price_your_weekly_price_id
STRIPE_PRICE_MONTHLY=price_your_monthly_price_id
```

### Medium Priority

#### 7. Add Customer Management to Payment Flow

Update `app/api/create-payment-intent/route.ts`:

```typescript
import { findOrCreateCustomer } from '@/lib/stripe/customers'

// After validating input, before creating payment intent:
const customer = await findOrCreateCustomer({
  email,
  name,
  metadata: {
    purpose,
  },
})

const paymentIntent = await stripe.paymentIntents.create({
  // ... existing config
  customer: customer?.id,
})
```

#### 8. Add Customer Portal

Create a new route `app/api/customer-portal/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createCustomerPortalSession } from '@/lib/stripe/customers'

export async function POST(request: NextRequest) {
  const { customerId } = await request.json()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const portalUrl = await createCustomerPortalSession(
    customerId,
    `${baseUrl}/account`
  )

  if (!portalUrl) {
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }

  return NextResponse.json({ url: portalUrl })
}
```

#### 9. Add Idempotency to Webhooks

Update webhook handlers to check for duplicate events:

```typescript
// At the start of each handler function:
const alreadyProcessed = await isEventProcessed(event.id)
if (alreadyProcessed) {
  console.log('Event already processed:', event.id)
  return NextResponse.json({ received: true })
}

// After successful processing:
await markEventProcessed(event.id, event.type, event.data.object)
```

#### 10. Add Input Validation

Create validation schemas for API routes using Zod:

```typescript
import { z } from 'zod'

const paymentIntentSchema = z.object({
  amount: z.number().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().optional(),
  purpose: z.enum(['Offering', 'Tithe', 'Thanksgiving', 'Welfare', 'Church projects', 'Seed', 'Mission']),
})

// In route handler:
const validated = paymentIntentSchema.safeParse(await request.json())
if (!validated.success) {
  return NextResponse.json(
    { error: 'Invalid input', details: validated.error },
    { status: 400 }
  )
}
```

#### 11. Add Logging and Monitoring

Consider adding structured logging:

```bash
npm install pino pino-pretty
```

Create `lib/logger.ts`:

```typescript
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})
```

Use throughout the codebase:
```typescript
logger.info({ paymentIntentId: pi.id }, 'Payment succeeded')
logger.error({ error }, 'Failed to process webhook')
```

### Low Priority

#### 12. Add Admin Dashboard

Create pages for:
- Donation history and statistics
- Subscriber management
- Failed payment tracking
- Donor profiles

#### 13. Add Testing

Create tests for:
- Webhook handlers (use Stripe's test events)
- Database operations
- Email sending
- Customer management

#### 14. Add Rate Limiting

Protect your API routes from abuse:

```bash
npm install @upstash/ratelimit @upstash/redis
```

#### 15. Add Refund Endpoint

Create `app/api/refund/route.ts` for processing refunds.

## Environment Variables Checklist

Make sure these are set in `.env.local`:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Subscription Prices (after creating in Stripe Dashboard)
STRIPE_PRICE_WEEKLY=price_...
STRIPE_PRICE_MONTHLY=price_...

# Database
DATABASE_URL=postgresql://...

# Email Service
RESEND_API_KEY=re_...
EMAIL_FROM=donations@yourchurch.com
ADMIN_EMAIL=admin@yourchurch.com

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_CHURCH_NAME=Your Church Name
```

## Testing Checklist

Before going to production:

- [ ] Add webhook secret to environment
- [ ] Set up and test database connection
- [ ] Set up and test email service
- [ ] Create subscription prices in Stripe Dashboard
- [ ] Test one-time donations with test cards
- [ ] Test recurring donations
- [ ] Test webhook handlers with Stripe CLI
- [ ] Test payment failures
- [ ] Test subscription cancellations
- [ ] Test refunds
- [ ] Verify all emails are being sent
- [ ] Check database records are being created
- [ ] Test with live keys in staging environment

## Support

If you need help:
- Stripe Documentation: https://stripe.com/docs
- Prisma Documentation: https://www.prisma.io/docs
- Resend Documentation: https://resend.com/docs

## Next Steps

1. Start with webhook secret and database setup (highest priority)
2. Implement database operations
3. Set up email service
4. Test thoroughly with test mode
5. Fix subscription price creation
6. Add customer management
7. Add remaining features as needed
