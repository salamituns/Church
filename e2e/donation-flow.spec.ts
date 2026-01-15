import { test, expect } from '@playwright/test'

test.describe('Donation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the give page where the donation form is located
    await page.goto('/give')
    // Wait for the form to be visible
    await page.waitForSelector('form', { timeout: 10000 })
  })

  test('should display donation form', async ({ page }) => {
    // Check that form elements are visible
    await expect(page.locator('text=Support Our Church')).toBeVisible()
    await expect(page.locator('input[placeholder="Custom amount"]')).toBeVisible()
    await expect(page.locator('input[placeholder="John Doe"]')).toBeVisible()
    await expect(page.locator('input[placeholder="john@example.com"]')).toBeVisible()
  })

  test('should show validation error for amount less than $1', async ({ page }) => {
    const initialUrl = page.url()
    
    // Fill custom amount
    await page.fill('input[placeholder="Custom amount"]', '0.5')
    await page.fill('input[placeholder="John Doe"]', 'John Doe')
    await page.fill('input[placeholder="john@example.com"]', 'john@example.com')

    // Trigger validation by clicking submit
    await page.click('button[type="submit"]:has-text("Continue to Payment")')

    // Wait for validation to run (react-hook-form validates on submit)
    await page.waitForTimeout(1000)

    // Verify we're still on the same page (form didn't submit)
    expect(page.url()).toBe(initialUrl)
    
    // Should show validation error - use getByText which is most reliable
    await expect(page.getByText('Amount must be at least $1')).toBeVisible({ timeout: 5000 })
  })

  test('should show validation error for invalid email', async ({ page }) => {
    const initialUrl = page.url()
    
    // Click a preset amount button
    await page.click('button:has-text("$25")')
    await page.fill('input[placeholder="John Doe"]', 'John Doe')
    await page.fill('input[placeholder="john@example.com"]', 'invalid-email')

    // Trigger validation by clicking submit
    await page.click('button[type="submit"]:has-text("Continue to Payment")')

    // Wait for validation to run (react-hook-form validates on submit)
    await page.waitForTimeout(1000)

    // Verify we're still on the same page (form didn't submit)
    expect(page.url()).toBe(initialUrl)
    
    // Should show validation error - use getByText which is most reliable
    await expect(page.getByText('Invalid email address')).toBeVisible({ timeout: 5000 })
  })

  test('should create payment intent with valid data', async ({ page }) => {
    await page.evaluate(() => {
      // Minimal Stripe mock to keep PaymentElement from crashing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).Stripe = () => ({
        elements: () => ({
          create: () => ({
            mount: () => {},
            on: () => {},
            update: () => {},
            destroy: () => {},
          }),
        }),
        confirmPayment: async () => ({ error: null }),
      })
    })

    await page.evaluate(() => {
      const originalFetch = window.fetch
      window.fetch = async (input, init) => {
        const url = typeof input === 'string' ? input : input.url
        if (url.includes('/api/create-payment-intent')) {
          return new Response(
            JSON.stringify({ clientSecret: 'pi_test_123_secret_456' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        }
        return originalFetch(input, init)
      }
    })

    await page.click('button:has-text("$50")')
    await page.click('button:has-text("one time")')
    await page.selectOption('select', 'Offering')
    await page.fill('input[placeholder="John Doe"]', 'John Doe')
    await page.fill('input[placeholder="john@example.com"]', 'john@example.com')
    await page.fill('textarea[placeholder="Add a note with your donation..."]', 'Thank you for your ministry')

    await page.click('button[type="submit"]:has-text("Continue to Payment")')

    await expect(page.getByText('Complete Your Donation')).toBeVisible({ timeout: 10000 })
  })

  test('should show rate limit error after too many payment requests', async ({ page }) => {
    await page.route('**/api/create-payment-intent', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Too many requests. Please try again later.',
          retryAfter: 60,
        }),
      })
    })

    await page.fill('input[placeholder="Custom amount"]', '50')
    await page.fill('input[placeholder="John Doe"]', 'John Doe')
    await page.fill('input[placeholder="john@example.com"]', 'john@example.com')

    await page.click('button[type="submit"]:has-text("Continue to Payment")')

    await expect(page.getByText('Too many requests. Please try again later.')).toBeVisible({ timeout: 5000 })
  })
})
