import { z } from 'zod'

/**
 * Validation schema for contact form submissions
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  phone: z
    .string()
    .max(20, 'Phone number cannot exceed 20 characters')
    .optional()
    .transform((val) => val?.trim() || undefined),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject cannot exceed 200 characters')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters')
    .trim(),
  type: z.enum(['general', 'prayer', 'visitor']).default('general'),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
