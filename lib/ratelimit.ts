import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * Rate limiter using Upstash Redis
 * Configured with different limits for different endpoint types
 */

// Initialize Redis client if credentials are available
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

import {
  PAYMENT_RATE_LIMIT_REQUESTS,
  PAYMENT_RATE_LIMIT_WINDOW,
  CONTACT_RATE_LIMIT_REQUESTS,
  CONTACT_RATE_LIMIT_WINDOW,
  WEBHOOK_RATE_LIMIT_REQUESTS,
  WEBHOOK_RATE_LIMIT_WINDOW,
} from './constants'

/**
 * Rate limiter for payment endpoints
 * Limits: 5 requests per 60 seconds per IP
 */
export const paymentRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(PAYMENT_RATE_LIMIT_REQUESTS, PAYMENT_RATE_LIMIT_WINDOW),
      analytics: true,
      prefix: '@upstash/ratelimit/payment',
    })
  : null

/**
 * Rate limiter for contact form
 * Limits: 10 requests per 60 seconds per IP
 */
export const contactRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(CONTACT_RATE_LIMIT_REQUESTS, CONTACT_RATE_LIMIT_WINDOW),
      analytics: true,
      prefix: '@upstash/ratelimit/contact',
    })
  : null

/**
 * Rate limiter for webhook endpoints (more lenient)
 * Limits: 100 requests per 60 seconds per IP
 */
export const webhookRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(WEBHOOK_RATE_LIMIT_REQUESTS, WEBHOOK_RATE_LIMIT_WINDOW),
      analytics: true,
      prefix: '@upstash/ratelimit/webhook',
    })
  : null

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback for development
  return '127.0.0.1'
}

/**
 * Check rate limit and return result
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  if (!limiter) {
    // If rate limiting is not configured, allow the request
    // This is useful for development or if Upstash is not set up
    return { success: true, limit: Infinity, remaining: Infinity, reset: Date.now() }
  }

  const result = await limiter.limit(identifier)
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}
