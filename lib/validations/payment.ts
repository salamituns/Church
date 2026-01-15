import { z } from 'zod'

/**
 * Validation schema for payment intent submissions
 */
export const paymentIntentSchema = z.object({
  amount: z
    .number()
    .min(1, 'Amount must be at least $1')
    .max(100000, 'Amount cannot exceed $100,000'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  message: z
    .string()
    .max(1000, 'Message cannot exceed 1000 characters')
    .default('')
    .transform((val) => val?.trim() || ''),
  purpose: z
    .enum(['Offering', 'Tithe', 'Thanksgiving', 'Welfare', 'Church projects', 'Seed', 'Mission'])
    .default('Offering'),
})

export type PaymentIntentInput = z.infer<typeof paymentIntentSchema>

/**
 * Validation schema for subscription/submit form
 */
export const subscriptionSchema = z.object({
  amount: z
    .number()
    .min(1, 'Amount must be at least $1')
    .max(100000, 'Amount cannot exceed $100,000'),
  frequency: z.enum(['weekly', 'monthly']),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  message: z
    .string()
    .max(1000, 'Message cannot exceed 1000 characters')
    .default('')
    .transform((val) => val?.trim() || ''),
  purpose: z
    .enum(['Offering', 'Tithe', 'Thanksgiving', 'Welfare', 'Church projects', 'Seed', 'Mission'])
    .default('Offering'),
})