// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom')

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock_secret'
process.env.RESEND_API_KEY = 're_mock_key'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
