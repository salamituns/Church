# Testing Guide

This document provides an overview of the testing setup and how to run tests for the RCCG Shiloh Mega Parish website.

## Testing Stack

- **Jest**: Unit and integration testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end (E2E) testing framework

## Running Tests

### Unit and Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI mode (interactive)
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

## Test Structure

### Unit Tests

Unit tests are located alongside their source files in `__tests__` directories:

- `lib/utils/__tests__/serviceTimes.test.ts` - Utility function tests
- `lib/validations/__tests__/payment.test.ts` - Payment validation schema tests
- `lib/validations/__tests__/contact.test.ts` - Contact form validation tests
- `lib/__tests__/ratelimit.test.ts` - Rate limiting utility tests

### Integration Tests

Integration tests for API routes:

- `app/api/__tests__/create-payment-intent.test.ts` - Payment intent API tests
- `app/api/__tests__/contact.test.ts` - Contact form API tests

### Component Tests

Component tests:

- `components/__tests__/ErrorBoundary.test.tsx` - Error boundary component tests

### E2E Tests

End-to-end tests are located in the `e2e/` directory:

- `e2e/contact-form.spec.ts` - Contact form user flow tests
- `e2e/donation-flow.spec.ts` - Donation flow tests
- `e2e/error-boundary.spec.ts` - Error boundary E2E tests

## Test Coverage

The test suite covers:

### ✅ Unit Tests

- **Utility Functions**: Time parsing, service scheduling, time remaining calculations
- **Validation Schemas**: Payment intent validation, subscription validation, contact form validation
- **Rate Limiting**: IP extraction, rate limit checking, graceful fallback

### ✅ Integration Tests

- **API Routes**: Payment intent creation, contact form submission
- **Error Handling**: Validation errors, rate limiting, Stripe errors
- **Response Formatting**: Proper status codes, error messages, headers

### ✅ Component Tests

- **Error Boundary**: Error catching, error display, recovery mechanisms

### ✅ E2E Tests

- **User Flows**: Contact form submission, donation flow
- **Error Scenarios**: Validation errors, rate limiting
- **Cross-browser**: Chrome, Firefox, Safari, Mobile browsers

## Writing New Tests

### Unit Test Example

```typescript
import { parseEventDateTime } from '../serviceTimes'
import type { Event } from '@/lib/cms/types'

describe('parseEventDateTime', () => {
  it('should parse event with standard time format', () => {
    const event: Event = {
      id: '1',
      title: 'Test Event',
      date: '2025-01-27',
      time: '10:00 AM',
      description: 'Test',
      category: 'service',
    }
    const result = parseEventDateTime(event)
    expect(result.getHours()).toBe(10)
    expect(result.getMinutes()).toBe(0)
  })
})
```

### Integration Test Example

```typescript
import { POST } from '../create-payment-intent/route'
import { NextRequest } from 'next/server'

describe('POST /api/create-payment-intent', () => {
  it('should create payment intent with valid data', async () => {
    const request = new NextRequest('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        amount: 50,
        name: 'John Doe',
        email: 'john@example.com',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('should submit contact form successfully', async ({ page }) => {
  await page.goto('/')
  await page.fill('input[name="name"]', 'John Doe')
  await page.fill('input[name="email"]', 'john@example.com')
  await page.click('button[type="submit"]')
  await expect(page.locator('text=Your message has been sent')).toBeVisible()
})
```

## Test Configuration

### Jest Configuration

Jest is configured in `jest.config.js` with:
- Next.js integration via `next/jest`
- TypeScript support via `ts-jest`
- Path aliases (`@/*`) mapped correctly
- Coverage thresholds set to 70%

### Playwright Configuration

Playwright is configured in `playwright.config.ts` with:
- Multiple browser support (Chrome, Firefox, Safari)
- Mobile device emulation
- Automatic dev server startup
- HTML reporter for test results

## Continuous Integration

Tests should be run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run unit tests
  run: npm test

- name: Run E2E tests
  run: npm run test:e2e
```

## Best Practices

1. **Write tests first (TDD)**: Write failing tests before implementing features
2. **Test behavior, not implementation**: Focus on what the code does, not how
3. **Keep tests isolated**: Each test should be independent and not rely on others
4. **Use descriptive test names**: Test names should clearly describe what is being tested
5. **Mock external dependencies**: Mock Stripe, email services, and database calls
6. **Test error cases**: Don't just test happy paths, test error scenarios too
7. **Maintain test coverage**: Aim for at least 70% coverage on critical paths

## Troubleshooting

### Tests failing with module resolution errors

Ensure `tsconfig.json` paths are correctly configured and Jest's `moduleNameMapper` matches.

### E2E tests timing out

Increase timeout in `playwright.config.ts` or check if the dev server is starting correctly.

### Mock not working

Ensure mocks are set up in `jest.setup.js` or at the top of your test file before imports.

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Next.js Testing Guide](https://nextjs.org/docs/app/building-your-application/testing)
