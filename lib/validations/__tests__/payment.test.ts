import { paymentIntentSchema, subscriptionSchema } from '../payment'

describe('paymentIntentSchema', () => {
  describe('valid inputs', () => {
    it('should validate a complete valid payment intent', () => {
      const input = {
        amount: 50,
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Thank you for your ministry',
        purpose: 'Offering',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.amount).toBe(50)
        expect(result.data.email).toBe('john@example.com')
        expect(result.data.message).toBe('Thank you for your ministry')
        expect(result.data.purpose).toBe('Offering')
      }
    })

    it('should validate payment intent without optional fields', () => {
      const input = {
        amount: 25,
        name: 'Jane Smith',
        email: 'jane@example.com',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.message).toBe('')
        expect(result.data.purpose).toBe('Offering')
      }
    })

    it('should trim and lowercase email', () => {
      const input = {
        amount: 100,
        name: 'Test User',
        email: '  TEST@EXAMPLE.COM  ',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('should trim name', () => {
      const input = {
        amount: 50,
        name: '  John Doe  ',
        email: 'john@example.com',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
      }
    })
  })

  describe('amount validation', () => {
    it('should reject amount less than 1', () => {
      const input = {
        amount: 0.5,
        name: 'John Doe',
        email: 'john@example.com',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject amount greater than 100000', () => {
      const input = {
        amount: 100001,
        name: 'John Doe',
        email: 'john@example.com',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should accept minimum amount of 1', () => {
      const input = {
        amount: 1,
        name: 'John Doe',
        email: 'john@example.com',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should accept maximum amount of 100000', () => {
      const input = {
        amount: 100000,
        name: 'John Doe',
        email: 'john@example.com',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  describe('name validation', () => {
    it('should reject name shorter than 2 characters', () => {
      const input = {
        amount: 50,
        name: 'J',
        email: 'john@example.com',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject name longer than 100 characters', () => {
      const input = {
        amount: 50,
        name: 'A'.repeat(101),
        email: 'john@example.com',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should accept name with exactly 2 characters', () => {
      const input = {
        amount: 50,
        name: 'Jo',
        email: 'john@example.com',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  describe('email validation', () => {
    it('should reject invalid email format', () => {
      const input = {
        amount: 50,
        name: 'John Doe',
        email: 'invalid-email',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject email without domain', () => {
      const input = {
        amount: 50,
        name: 'John Doe',
        email: 'john@',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should accept valid email', () => {
      const input = {
        amount: 50,
        name: 'John Doe',
        email: 'john.doe@example.com',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  describe('message validation', () => {
    it('should reject message longer than 1000 characters', () => {
      const input = {
        amount: 50,
        name: 'John Doe',
        email: 'john@example.com',
        message: 'A'.repeat(1001),
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should accept message with exactly 1000 characters', () => {
      const input = {
        amount: 50,
        name: 'John Doe',
        email: 'john@example.com',
        message: 'A'.repeat(1000),
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should trim message', () => {
      const input = {
        amount: 50,
        name: 'John Doe',
        email: 'john@example.com',
        message: '  Thank you  ',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.message).toBe('Thank you')
      }
    })
  })

  describe('purpose validation', () => {
    it('should reject purpose longer than 100 characters', () => {
      const input = {
        amount: 50,
        name: 'John Doe',
        email: 'john@example.com',
        purpose: 'A'.repeat(101),
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should default purpose to "Offering" when not provided', () => {
      const input = {
        amount: 50,
        name: 'John Doe',
        email: 'john@example.com',
      }
      const result = paymentIntentSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.purpose).toBe('Offering')
      }
    })
  })
})

describe('subscriptionSchema', () => {
  describe('valid inputs', () => {
    it('should validate a complete valid subscription', () => {
      const input = {
        amount: 50,
        frequency: 'monthly',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Monthly giving',
        purpose: 'Tithe',
      }
      const result = subscriptionSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.frequency).toBe('monthly')
      }
    })

    it('should accept weekly frequency', () => {
      const input = {
        amount: 25,
        frequency: 'weekly',
        name: 'Jane Smith',
        email: 'jane@example.com',
      }
      const result = subscriptionSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.frequency).toBe('weekly')
      }
    })
  })

  describe('frequency validation', () => {
    it('should reject invalid frequency', () => {
      const input = {
        amount: 50,
        frequency: 'daily',
        name: 'John Doe',
        email: 'john@example.com',
      }
      const result = subscriptionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject frequency that is not weekly or monthly', () => {
      const input = {
        amount: 50,
        frequency: 'yearly',
        name: 'John Doe',
        email: 'john@example.com',
      }
      const result = subscriptionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })
  })

  describe('amount validation', () => {
    it('should apply same amount rules as payment intent', () => {
      const input = {
        amount: 0.5,
        frequency: 'monthly',
        name: 'John Doe',
        email: 'john@example.com',
      }
      const result = subscriptionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })
  })

  describe('name and email validation', () => {
    it('should apply same validation rules as payment intent', () => {
      const input = {
        amount: 50,
        frequency: 'monthly',
        name: 'J',
        email: 'invalid-email',
      }
      const result = subscriptionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })
  })
})
