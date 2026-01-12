# Code Review Report
**Date:** 2025-01-27  
**Project:** RCCG Shiloh Mega Parish Website  
**Reviewer:** AI Code Review Agent

---

## Executive Summary

This codebase is a well-structured Next.js 14 application for a church website with Stripe payment integration. The code follows modern React patterns, uses TypeScript effectively, and demonstrates good separation of concerns. However, there are several areas requiring attention, particularly around security, error handling, and incomplete functionality (TODOs).

**Overall Assessment:** ⚠️ **Good foundation, but needs attention before production**

---

## Review Categories

### ✅ Functionality

#### Strengths
- ✅ Core functionality works as expected
- ✅ Stripe payment integration is properly structured
- ✅ CMS abstraction allows easy migration from JSON to headless CMS
- ✅ Responsive design with mobile-first approach
- ✅ Good use of Next.js 14 App Router patterns

#### Issues Found

**1. Incomplete Payment Webhook Handlers** 🔴 **CRITICAL**
- **Location:** `app/api/webhook/route.ts`
- **Issue:** All webhook event handlers contain only TODO comments. No actual database persistence or email notifications are implemented.
- **Impact:** Payments are processed by Stripe but not recorded in your database, and users don't receive confirmation emails.
- **Recommendation:** Implement the database functions in `lib/db/donations.ts` and email functions in `lib/email/notifications.ts`

**2. Contact Form Not Functional** 🟡 **HIGH**
- **Location:** `components/forms/ContactForm.tsx:51-56`
- **Issue:** Form only logs to console and simulates success. No actual email service integration.
- **Impact:** Contact form submissions are lost.
- **Recommendation:** Integrate with email service (Resend, SendGrid, or similar)

**3. Missing Input Validation in API Routes** 🟡 **MEDIUM**
- **Location:** `app/api/create-payment-intent/route.ts:13`
- **Issue:** No validation for email format, name length, or message content before processing.
- **Impact:** Invalid data could be stored in Stripe metadata.
- **Recommendation:** Add Zod schema validation similar to the form validation

**4. Time Parsing Edge Cases** 🟡 **MEDIUM**
- **Location:** `lib/utils/serviceTimes.ts:13-15`
- **Issue:** Time parsing assumes specific format. Could fail with edge cases like "10am" (no colon) or "10:00am" (lowercase).
- **Impact:** Events with non-standard time formats may not parse correctly.
- **Recommendation:** Add more robust time parsing with fallbacks

---

### ✅ Code Quality

#### Strengths
- ✅ Consistent TypeScript usage with strict mode enabled
- ✅ Good component organization and separation of concerns
- ✅ Proper use of React hooks and Next.js patterns
- ✅ Clean, readable code with descriptive variable names
- ✅ Good use of TypeScript types and interfaces

#### Issues Found

**1. Excessive Console Logging in Production** 🟡 **MEDIUM**
- **Location:** Multiple files, especially `app/api/webhook/route.ts`
- **Issue:** 12+ `console.log/error` statements in webhook handler
- **Impact:** Clutters logs, potential security risk if sensitive data is logged
- **Recommendation:** 
  - Use a proper logging library (e.g., `pino`, `winston`)
  - Remove console logs or gate them behind environment checks
  - Never log sensitive payment data

**2. Code Duplication in Error Handling** 🟡 **LOW**
- **Location:** `components/forms/DonationForm.tsx:148-154, 168-175`
- **Issue:** Error message formatting is duplicated
- **Recommendation:** Extract to a helper function:
```typescript
function formatErrorResponse(result: { error: string; details?: string }): string {
  return result.details ? `${result.error}\n\n${result.details}` : result.error
}
```

**3. Magic Numbers and Hardcoded Values** 🟡 **LOW**
- **Location:** `app/page.tsx:31` - hardcoded hour `23`
- **Location:** `lib/utils/serviceTimes.ts:75` - hardcoded `14` days
- **Recommendation:** Extract to named constants:
```typescript
const END_OF_DAY_HOUR = 23
const DAYS_TO_CHECK_FOR_SERVICES = 14
```

**4. Missing Error Boundaries** 🟡 **MEDIUM**
- **Issue:** No React error boundaries to catch component errors
- **Impact:** Unhandled errors could crash the entire page
- **Recommendation:** Add error boundaries around major sections

**5. Type Safety Issues** 🟡 **MEDIUM**
- **Location:** `app/api/webhook/route.ts:249, 270`
- **Issue:** Using `(invoice as any).subscription` instead of proper typing
- **Recommendation:** Use proper Stripe types:
```typescript
const subscriptionId = invoice.subscription as string
```

**6. Unused Variables** 🟢 **LOW**
- **Location:** `lib/utils/serviceTimes.ts:12`
- **Issue:** `timeStr` variable is assigned but `event.time` is used directly in split
- **Recommendation:** Remove unused variable or use it consistently

---

### 🔒 Security

#### Strengths
- ✅ Environment variables properly used (no hardcoded secrets)
- ✅ `.gitignore` correctly excludes `.env` files
- ✅ Stripe webhook signature verification implemented
- ✅ Input validation on client-side forms using Zod

#### Issues Found

**1. Missing Server-Side Input Validation** 🔴 **CRITICAL**
- **Location:** `app/api/create-payment-intent/route.ts:13`
- **Issue:** No server-side validation of request body. Client can send any data.
- **Impact:** Potential for invalid amounts, XSS in metadata fields, or injection attacks
- **Recommendation:** Add Zod validation:
```typescript
const paymentIntentSchema = z.object({
  amount: z.number().min(1).max(100000),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().max(1000).optional(),
  purpose: z.string().max(100).optional(),
})

const validated = paymentIntentSchema.parse(await request.json())
```

**2. Missing Rate Limiting** 🟡 **HIGH**
- **Location:** All API routes
- **Issue:** No rate limiting on payment endpoints
- **Impact:** Vulnerable to abuse, DoS attacks, or payment spam
- **Recommendation:** Implement rate limiting using `@upstash/ratelimit` or similar

**3. Webhook Error Information Leakage** 🟡 **MEDIUM**
- **Location:** `app/api/webhook/route.ts:28-32`
- **Issue:** Error details logged to console could expose sensitive information
- **Impact:** If logs are exposed, could reveal webhook secret validation failures
- **Recommendation:** Log generic errors, avoid logging full error objects

**4. Missing CSRF Protection** 🟡 **MEDIUM**
- **Location:** API routes
- **Issue:** No CSRF tokens for state-changing operations
- **Impact:** Vulnerable to CSRF attacks (though Stripe handles payment security)
- **Recommendation:** Consider adding CSRF protection for non-Stripe endpoints

**5. Unsafe URL Construction** 🟡 **MEDIUM**
- **Location:** `app/api/create-subscription/route.ts:41-42`
- **Issue:** Falls back to `request.headers.get('origin')` which can be spoofed
- **Impact:** Potential for open redirect vulnerabilities
- **Recommendation:** Always validate and whitelist allowed origins:
```typescript
const allowedOrigins = [process.env.NEXT_PUBLIC_BASE_URL, 'https://rccgshilohmega.org']
const origin = request.headers.get('origin')
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
  (origin && allowedOrigins.includes(origin) ? origin : 'http://localhost:3000')
```

**6. Missing Content Security Policy** 🟡 **LOW**
- **Issue:** No CSP headers configured
- **Impact:** Vulnerable to XSS attacks
- **Recommendation:** Add CSP headers in `next.config.js` or middleware

**7. Alert() Usage for Errors** 🟡 **LOW**
- **Location:** `components/forms/DonationForm.tsx:151, 172, 183`
- **Issue:** Using `alert()` for error messages is poor UX and can be blocked
- **Recommendation:** Use toast notifications or inline error messages

---

## Detailed Findings

### Critical Issues (Must Fix Before Production)

1. **Incomplete Webhook Implementation**
   - **Files:** `app/api/webhook/route.ts`, `lib/db/donations.ts`, `lib/email/notifications.ts`
   - **Status:** All handlers are stubs
   - **Action Required:** Implement database persistence and email notifications

2. **Missing Server-Side Validation**
   - **Files:** `app/api/create-payment-intent/route.ts`, `app/api/create-subscription/route.ts`
   - **Action Required:** Add Zod schema validation for all API inputs

### High Priority Issues

1. **Contact Form Not Functional**
   - **File:** `components/forms/ContactForm.tsx`
   - **Action Required:** Integrate email service

2. **Missing Rate Limiting**
   - **Action Required:** Add rate limiting to payment endpoints

3. **Excessive Console Logging**
   - **Action Required:** Replace with proper logging library

### Medium Priority Issues

1. **Error Handling Improvements**
   - Add error boundaries
   - Improve error messages
   - Replace `alert()` with better UX

2. **Code Quality Improvements**
   - Extract duplicated code
   - Replace magic numbers with constants
   - Fix type safety issues

3. **Security Hardening**
   - Add CSP headers
   - Validate URL origins
   - Improve webhook error handling

---

## Recommendations by Priority

### 🔴 Critical (Before Production)

1. **Implement Webhook Handlers**
   ```typescript
   // Complete the TODOs in app/api/webhook/route.ts
   // Implement functions in lib/db/donations.ts
   // Implement functions in lib/email/notifications.ts
   ```

2. **Add Server-Side Validation**
   ```typescript
   // Add to app/api/create-payment-intent/route.ts
   import { z } from 'zod'
   const schema = z.object({ /* ... */ })
   const data = schema.parse(await request.json())
   ```

3. **Implement Contact Form Email Service**
   ```typescript
   // Integrate Resend or SendGrid in components/forms/ContactForm.tsx
   ```

### 🟡 High Priority (Soon)

1. **Add Rate Limiting**
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```

2. **Replace Console Logging**
   ```bash
   npm install pino pino-pretty
   ```

3. **Add Error Boundaries**
   ```typescript
   // Create components/ErrorBoundary.tsx
   ```

### 🟢 Medium Priority (Nice to Have)

1. Extract duplicated error handling code
2. Replace magic numbers with constants
3. Add CSP headers
4. Improve time parsing robustness
5. Fix type safety issues

---

## Code Quality Metrics

- **TypeScript Coverage:** ✅ Excellent (strict mode enabled)
- **Component Organization:** ✅ Good (clear separation)
- **Error Handling:** ⚠️ Needs improvement (missing boundaries, alert usage)
- **Security:** ⚠️ Good foundation, needs hardening
- **Documentation:** ✅ Good (inline comments, README)
- **Test Coverage:** ❌ No tests found (consider adding)

---

## Testing Recommendations

The codebase currently has no tests. Consider adding:

1. **Unit Tests**
   - Utility functions (`lib/utils/serviceTimes.ts`)
   - CMS client functions
   - Form validation schemas

2. **Integration Tests**
   - API routes (payment intent creation, webhooks)
   - Form submissions

3. **E2E Tests**
   - Complete donation flow
   - Contact form submission
   - Navigation flows

**Recommended Tools:**
- Jest + React Testing Library for unit tests
- Playwright for E2E tests

---

## Positive Highlights

1. ✅ **Excellent TypeScript Usage** - Strict mode, proper types throughout
2. ✅ **Clean Architecture** - Good separation between CMS, API, and UI layers
3. ✅ **Modern Next.js Patterns** - Proper use of App Router, server components
4. ✅ **Accessibility** - Skip links, ARIA labels, semantic HTML
5. ✅ **Responsive Design** - Mobile-first approach with proper breakpoints
6. ✅ **Security Foundation** - Environment variables, webhook verification

---

## Summary Checklist

### Functionality
- [x] Code does what it's supposed to do (mostly)
- [ ] Edge cases are handled (needs improvement)
- [ ] Error handling is appropriate (needs improvement)
- [x] No obvious bugs or logic errors (minor issues found)

### Code Quality
- [x] Code is readable and well-structured
- [x] Functions are small and focused
- [x] Variable names are descriptive
- [x] No significant code duplication (minor duplication found)
- [x] Follows project conventions

### Security
- [ ] No obvious security vulnerabilities (several found)
- [ ] Input validation is present (client-side only, needs server-side)
- [x] Sensitive data is handled properly
- [x] No hardcoded secrets

---

## Next Steps

1. **Immediate Actions:**
   - Implement webhook handlers
   - Add server-side validation
   - Integrate contact form email service

2. **Short Term:**
   - Add rate limiting
   - Replace console logging
   - Add error boundaries

3. **Long Term:**
   - Add comprehensive test suite
   - Implement monitoring and alerting
   - Add performance monitoring

---

**Review Completed:** 2025-01-27  
**Status:** ⚠️ **Ready for development, not production-ready**
