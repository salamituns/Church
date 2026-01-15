import { contactFormSchema } from '../contact'

describe('contactFormSchema', () => {
  describe('valid inputs', () => {
    it('should validate a complete valid contact form', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        subject: 'General Inquiry',
        message: 'This is a test message with enough characters',
        type: 'general',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
        expect(result.data.email).toBe('john@example.com')
        expect(result.data.phone).toBe('+1234567890')
        expect(result.data.subject).toBe('General Inquiry')
        expect(result.data.type).toBe('general')
      }
    })

    it('should validate contact form without optional phone', () => {
      const input = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Prayer Request',
        message: 'This is a test message with enough characters',
        type: 'prayer',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.phone).toBeUndefined()
      }
    })

    it('should default type to general when not provided', () => {
      const input = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.type).toBe('general')
      }
    })

    it('should trim and lowercase email', () => {
      const input = {
        name: 'Test User',
        email: '  TEST@EXAMPLE.COM  ',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('should trim name', () => {
      const input = {
        name: '  John Doe  ',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
      }
    })
  })

  describe('name validation', () => {
    it('should reject name shorter than 2 characters', () => {
      const input = {
        name: 'J',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject name longer than 100 characters', () => {
      const input = {
        name: 'A'.repeat(101),
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should accept name with exactly 2 characters', () => {
      const input = {
        name: 'Jo',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  describe('email validation', () => {
    it('should reject invalid email format', () => {
      const input = {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should accept valid email', () => {
      const input = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  describe('phone validation', () => {
    it('should reject phone longer than 20 characters', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1'.repeat(21),
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should accept phone with exactly 20 characters', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1'.repeat(20),
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should trim phone', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '  +1234567890  ',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.phone).toBe('+1234567890')
      }
    })
  })

  describe('subject validation', () => {
    it('should reject subject shorter than 3 characters', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Te',
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject subject longer than 200 characters', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'A'.repeat(201),
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should accept subject with exactly 3 characters', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Tes',
        message: 'This is a test message with enough characters',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  describe('message validation', () => {
    it('should reject message shorter than 10 characters', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Short',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject message longer than 2000 characters', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'A'.repeat(2001),
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should accept message with exactly 10 characters', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: '1234567890',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should trim message', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: '  This is a test message  ',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.message).toBe('This is a test message')
      }
    })
  })

  describe('type validation', () => {
    it('should accept general type', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
        type: 'general',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should accept prayer type', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
        type: 'prayer',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should accept visitor type', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
        type: 'visitor',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should reject invalid type', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
        type: 'invalid',
      }
      const result = contactFormSchema.safeParse(input)
      expect(result.success).toBe(false)
    })
  })
})
