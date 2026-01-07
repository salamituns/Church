# Stripe Integration Setup Guide

This guide will help you set up Stripe payment processing for your church donation system.

## Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Your Stripe API keys from the Stripe Dashboard

## Step 1: Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for live mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for live mode)

⚠️ **Important**: Never share your secret key publicly. Keep it secure and only use it in server-side code.

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Base URL for your application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production, update these values with your live keys and production URL:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Step 3: Set Up Webhooks (Production Only)

For production, you'll want to set up webhooks to handle payment confirmations:

1. Go to **Developers** → **Webhooks** in your Stripe Dashboard
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/webhook`
4. Select the following events to listen for:
   - `payment_intent.succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 4: Test the Integration

### Test Mode

Stripe provides test card numbers for testing:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry date (e.g., `12/34`)
- Use any 3-digit CVC
- Use any ZIP code

### Testing Steps

1. Start your development server: `npm run dev`
2. Navigate to `/give` page
3. Fill out the donation form
4. Use a test card number to complete the payment
5. Verify you're redirected to the thank-you page

## Features

### One-Time Donations

- Users can make one-time donations of any amount
- Payment is processed securely through Stripe
- Receipts are automatically emailed to donors

### Recurring Donations

- Users can set up weekly or monthly recurring donations
- Uses Stripe Checkout for subscription setup
- Donors can manage their subscriptions through Stripe

## Security Notes

- ✅ All payment processing happens securely through Stripe
- ✅ Card details are never stored on your server
- ✅ Stripe handles PCI compliance
- ✅ All API routes validate input and handle errors

## Troubleshooting

### "Stripe is not defined" error

Make sure you've added your `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.local` and restarted your development server.

### Payment not processing

1. Check that your API keys are correct
2. Verify you're using test keys in development
3. Check the browser console and server logs for errors
4. Ensure your Stripe account is activated

### Webhook not working

1. Verify the webhook URL is accessible
2. Check that the webhook secret matches in your `.env.local`
3. Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhook`

## Next Steps

Consider adding:

- Email notifications for successful donations
- Database storage for donation records
- Admin dashboard to view donations
- Donation history for users
- Tax receipt generation

## Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
