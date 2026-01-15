import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the visit page where the contact form is located
    await page.goto('/visit')
    // Wait for the form to be visible
    await page.waitForSelector('form', { timeout: 10000 })
  })

  test('should submit contact form successfully', async ({ page }) => {
    // Fill out the form using label text (more reliable than name attributes with react-hook-form)
    await page.fill('input[placeholder="John Doe"]', 'John Doe')
    await page.fill('input[placeholder="john@example.com"]', 'john@example.com')
    await page.fill('input[placeholder="(555) 123-4567"]', '+1234567890')
    await page.fill('input[placeholder="How can we help?"]', 'Test Inquiry')
    await page.fill('textarea[placeholder="Your message here..."]', 'This is a test message with enough characters to pass validation')

    // Submit the form
    await page.click('button[type="submit"]:has-text("Send Message")')

    // Wait for success message
    await expect(page.locator('text=Message Sent!')).toBeVisible({ timeout: 10000 })
  })

  test('should show validation errors for invalid email', async ({ page }) => {
    const initialUrl = page.url()
    
    await page.fill('input[placeholder="John Doe"]', 'John Doe')
    await page.fill('input[placeholder="john@example.com"]', 'invalid-email')
    await page.fill('input[placeholder="How can we help?"]', 'Test Subject')
    await page.fill('textarea[placeholder="Your message here..."]', 'This is a test message with enough characters')

    // Trigger validation by clicking submit
    await page.click('button[type="submit"]:has-text("Send Message")')

    // Wait for validation to run (react-hook-form validates on submit)
    await page.waitForTimeout(1000)

    // Verify we're still on the same page (form didn't submit)
    expect(page.url()).toBe(initialUrl)
    
    // Should show validation error - use getByText which is most reliable
    await expect(page.getByText('Invalid email address')).toBeVisible({ timeout: 5000 })
  })

  test('should show validation error for message too short', async ({ page }) => {
    await page.fill('input[placeholder="John Doe"]', 'John Doe')
    await page.fill('input[placeholder="john@example.com"]', 'john@example.com')
    await page.fill('input[placeholder="How can we help?"]', 'Test Subject')
    await page.fill('textarea[placeholder="Your message here..."]', 'Short')

    // Trigger validation by clicking submit
    await page.click('button[type="submit"]:has-text("Send Message")')

    // Wait for validation to run (react-hook-form validates on submit)
    await page.waitForTimeout(1000)

    // Verify we're still on the form page (not redirected)
    await expect(page.locator('form')).toBeVisible()
    
    // Should show validation error - use getByText which is most reliable
    await expect(page.getByText('Message must be at least 10 characters')).toBeVisible({ timeout: 5000 })
  })

  test('should show rate limit error after too many requests', async ({ page }) => {
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Too many requests. Please try again later.',
          retryAfter: 60,
        }),
      })
    })

    const dialogPromise = new Promise<string>((resolve) => {
      page.once('dialog', async (dialog) => {
        const message = dialog.message()
        await dialog.dismiss()
        resolve(message)
      })
    })

    await page.fill('input[placeholder="John Doe"]', 'John Doe')
    await page.fill('input[placeholder="john@example.com"]', 'john@example.com')
    await page.fill('input[placeholder="How can we help?"]', 'Test Inquiry')
    await page.fill('textarea[placeholder="Your message here..."]', 'This is a test message with enough characters to pass validation')

    await page.click('button[type="submit"]:has-text("Send Message")')

    const dialogMessage = await dialogPromise
    expect(dialogMessage).toContain('Too many requests')
  })
})
