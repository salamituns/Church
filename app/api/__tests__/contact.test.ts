import { POST } from '../contact/route'
import { NextRequest } from 'next/server'
import { sendContactFormEmail } from '@/lib/email/contact'
import { contactRateLimiter } from '@/lib/ratelimit'

// Mock dependencies
jest.mock('@/lib/email/contact', () => ({
  sendContactFormEmail: jest.fn(),
}))

jest.mock('@/lib/ratelimit', () => ({
  contactRateLimiter: null, // Not configured for tests
  getClientIP: jest.fn(() => '127.0.0.1'),
  checkRateLimit: jest.fn(() => Promise.resolve({
    success: true,
    limit: 10,
    remaining: 9,
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

describe('POST /api/contact', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should send contact form email with valid data', async () => {
    ;(sendContactFormEmail as jest.Mock).mockResolvedValue(undefined)

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        subject: 'General Inquiry',
        message: 'This is a test message with enough characters to pass validation',
        type: 'general',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Your message has been sent successfully!')
    expect(sendContactFormEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'General Inquiry',
      })
    )
  })

  it('should return 400 for invalid email', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters to pass validation',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
    expect(sendContactFormEmail).not.toHaveBeenCalled()
  })

  it('should return 400 for message too short', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Short',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
  })

  it('should return 400 for subject too short', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Te',
        message: 'This is a test message with enough characters to pass validation',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation failed')
  })

  it('should return 429 when rate limit is exceeded', async () => {
    const { checkRateLimit } = require('@/lib/ratelimit')
    checkRateLimit.mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now() + 60000,
    })

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters to pass validation',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.error).toBe('Too many requests. Please try again later.')
    expect(response.headers.get('Retry-After')).toBeTruthy()
  })

  it('should handle email sending errors gracefully', async () => {
    const emailError = new Error('Email service error')
    ;(sendContactFormEmail as jest.Mock).mockRejectedValue(emailError)

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters to pass validation',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to send message. Please try again later.')
  })

  it('should default type to general when not provided', async () => {
    ;(sendContactFormEmail as jest.Mock).mockResolvedValue(undefined)

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters to pass validation',
      }),
    })

    await POST(request)

    expect(sendContactFormEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'general',
      })
    )
  })

  it('should accept optional phone field', async () => {
    ;(sendContactFormEmail as jest.Mock).mockResolvedValue(undefined)

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters to pass validation',
        phone: '+1234567890',
      }),
    })

    await POST(request)

    expect(sendContactFormEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: '+1234567890',
      })
    )
  })

  it('should accept different contact types', async () => {
    ;(sendContactFormEmail as jest.Mock).mockResolvedValue(undefined)

    const types = ['general', 'prayer', 'visitor']

    for (const type of types) {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message with enough characters to pass validation',
          type,
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    }
  })
})
