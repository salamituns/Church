import { POST } from '../create-payment-intent/route'
import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { paymentRateLimiter } from '@/lib/ratelimit'

// Mock dependencies
jest.mock('@/lib/stripe', () => ({
  stripe: {
    paymentIntents: {
      create: jest.fn(),
    },
  },
  isStripeConfigured: jest.fn(() => true),
  handleStripeError: jest.fn((error) => ({
    error: error.message,
    details: undefined,
    status: 500,
  })),
}))

jest.mock('@/lib/ratelimit', () => ({
  paymentRateLimiter: null, // Not configured for tests
  getClientIP: jest.fn(() => '127.0.0.1'),
  checkRateLimit: jest.fn(() => Promise.resolve({
    success: true,
    limit: 5,
    remaining: 4,
    reset: Date.now() + 60000,
  })),
}))

jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

describe('POST /api/create-payment-intent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create payment intent with valid data', async () => {
    const mockPaymentIntent = {
      id: 'pi_test_123',
      client_secret: 'pi_test_123_secret',
    }

    ;(stripe.paymentIntents.create as jest.Mock).mockResolvedValue(mockPaymentIntent)

    const request = new NextRequest('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        amount: 50,
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Thank you',
        purpose: 'Offering',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.clientSecret).toBe('pi_test_123_secret')
    expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 5000, // $50 in cents
        currency: 'usd',
        description: 'Church Donation - Offering',
        metadata: expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
        }),
      })
    )
  })

  it('should return 400 for invalid amount', async () => {
    const request = new NextRequest('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        amount: 0.5,
        name: 'John Doe',
        email: 'john@example.com',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
    expect(stripe.paymentIntents.create).not.toHaveBeenCalled()
  })

  it('should return 400 for invalid email', async () => {
    const request = new NextRequest('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        amount: 50,
        name: 'John Doe',
        email: 'invalid-email',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
  })

  it('should return 400 for amount less than $1.00 in cents', async () => {
    const request = new NextRequest('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        amount: 0.99,
        name: 'John Doe',
        email: 'john@example.com',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Amount must be at least $1.00')
  })

  it('should return 429 when rate limit is exceeded', async () => {
    const { checkRateLimit } = require('@/lib/ratelimit')
    checkRateLimit.mockResolvedValueOnce({
      success: false,
      limit: 5,
      remaining: 0,
      reset: Date.now() + 60000,
    })

    const request = new NextRequest('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        amount: 50,
        name: 'John Doe',
        email: 'john@example.com',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.error).toBe('Too many requests. Please try again later.')
    expect(response.headers.get('Retry-After')).toBeTruthy()
  })

  it('should handle Stripe errors gracefully', async () => {
    const stripeError = new Error('Stripe API error')
    ;(stripe.paymentIntents.create as jest.Mock).mockRejectedValue(stripeError)

    const request = new NextRequest('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        amount: 50,
        name: 'John Doe',
        email: 'john@example.com',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Stripe API error')
  })

  it('should use default purpose when not provided', async () => {
    const mockPaymentIntent = {
      id: 'pi_test_123',
      client_secret: 'pi_test_123_secret',
    }

    ;(stripe.paymentIntents.create as jest.Mock).mockResolvedValue(mockPaymentIntent)

    const request = new NextRequest('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        amount: 50,
        name: 'John Doe',
        email: 'john@example.com',
      }),
    })

    await POST(request)

    expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Church Donation - Offering',
        metadata: expect.objectContaining({
          purpose: 'Offering',
        }),
      })
    )
  })
})
