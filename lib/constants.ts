/**
 * Application constants
 * Centralized location for magic numbers and configuration values
 */

// Time-related constants
export const END_OF_DAY_HOUR = 23
export const END_OF_DAY_MINUTE = 59
export const END_OF_DAY_SECOND = 59
export const END_OF_DAY_MILLISECOND = 999

// Service schedule constants
export const DAYS_TO_CHECK_FOR_SERVICES = 14
export const DEFAULT_EVENT_HOUR = 10

// Rate limiting constants
export const PAYMENT_RATE_LIMIT_REQUESTS = 5
export const PAYMENT_RATE_LIMIT_WINDOW = '60 s'
export const CONTACT_RATE_LIMIT_REQUESTS = 10
export const CONTACT_RATE_LIMIT_WINDOW = '60 s'
export const WEBHOOK_RATE_LIMIT_REQUESTS = 100
export const WEBHOOK_RATE_LIMIT_WINDOW = '60 s'

// Payment validation constants
export const MIN_DONATION_AMOUNT_CENTS = 100 // $1.00
export const MAX_DONATION_AMOUNT_CENTS = 10_000_000 // $100,000.00
