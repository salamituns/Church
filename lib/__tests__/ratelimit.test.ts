import { getClientIP, checkRateLimit } from '../ratelimit'
import { Ratelimit } from '@upstash/ratelimit'

// Mock Upstash Redis
jest.mock('@upstash/redis', () => ({
  Redis: jest.fn(),
}))

// Mock Ratelimit
jest.mock('@upstash/ratelimit', () => ({
  Ratelimit: {
    slidingWindow: jest.fn(),
  },
}))

describe('getClientIP', () => {
  it('should extract IP from x-forwarded-for header', () => {
    const request = new Request('http://example.com', {
      headers: {
        'x-forwarded-for': '192.168.1.1, 10.0.0.1',
      },
    })
    const ip = getClientIP(request)
    expect(ip).toBe('192.168.1.1')
  })

  it('should extract IP from x-real-ip header when x-forwarded-for is not present', () => {
    const request = new Request('http://example.com', {
      headers: {
        'x-real-ip': '192.168.1.2',
      },
    })
    const ip = getClientIP(request)
    expect(ip).toBe('192.168.1.2')
  })

  it('should return 127.0.0.1 as fallback when no headers are present', () => {
    const request = new Request('http://example.com')
    const ip = getClientIP(request)
    expect(ip).toBe('127.0.0.1')
  })

  it('should handle x-forwarded-for with single IP', () => {
    const request = new Request('http://example.com', {
      headers: {
        'x-forwarded-for': '192.168.1.1',
      },
    })
    const ip = getClientIP(request)
    expect(ip).toBe('192.168.1.1')
  })

  it('should trim whitespace from IP addresses', () => {
    const request = new Request('http://example.com', {
      headers: {
        'x-forwarded-for': '  192.168.1.1  , 10.0.0.1',
      },
    })
    const ip = getClientIP(request)
    expect(ip).toBe('192.168.1.1')
  })
})

describe('checkRateLimit', () => {
  it('should return success when limiter is null (not configured)', async () => {
    const result = await checkRateLimit(null, 'test-identifier')
    expect(result.success).toBe(true)
    expect(result.limit).toBe(Infinity)
    expect(result.remaining).toBe(Infinity)
    expect(result.reset).toBeGreaterThan(0)
  })

  it('should call limiter.limit when limiter is configured', async () => {
    const mockLimit = jest.fn().mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: Date.now() + 60000,
    })

    const mockLimiter = {
      limit: mockLimit,
    } as unknown as Ratelimit

    const result = await checkRateLimit(mockLimiter, 'test-identifier')

    expect(mockLimit).toHaveBeenCalledWith('test-identifier')
    expect(result.success).toBe(true)
    expect(result.limit).toBe(5)
    expect(result.remaining).toBe(4)
  })

  it('should return failure when rate limit is exceeded', async () => {
    const mockLimit = jest.fn().mockResolvedValue({
      success: false,
      limit: 5,
      remaining: 0,
      reset: Date.now() + 60000,
    })

    const mockLimiter = {
      limit: mockLimit,
    } as unknown as Ratelimit

    const result = await checkRateLimit(mockLimiter, 'test-identifier')

    expect(result.success).toBe(false)
    expect(result.limit).toBe(5)
    expect(result.remaining).toBe(0)
  })

  it('should handle errors from limiter gracefully', async () => {
    const mockLimit = jest.fn().mockRejectedValue(new Error('Redis error'))

    const mockLimiter = {
      limit: mockLimit,
    } as unknown as Ratelimit

    await expect(checkRateLimit(mockLimiter, 'test-identifier')).rejects.toThrow('Redis error')
  })
})
