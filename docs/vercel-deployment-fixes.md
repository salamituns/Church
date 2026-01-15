# Vercel Deployment Fixes

## Date: January 15, 2026

## Problem Summary

The Vercel deployment was failing during the build process with the following error:

```
Type error: Cannot assign to 'NODE_ENV' because it is a read-only property.

./jest.setup.ts:26:13
```

## Root Cause Analysis

### Primary Issue
The `tsconfig.json` configuration was including **all** TypeScript files (`**/*.ts` and `**/*.tsx`) in the compilation, which included test-related files that should never be part of the production build:

1. `jest.setup.ts` and `jest.setup.js`
2. All `**/__tests__/**` directories
3. All `*.test.ts` and `*.test.tsx` files
4. All `*.spec.ts` and `*.spec.tsx` files (E2E tests)
5. Mock files in `__mocks__/` directory

### Secondary Issue
Both `jest.setup.ts` and `jest.setup.js` were attempting to directly assign to `process.env.NODE_ENV`, which is a read-only property in TypeScript's type definitions.

## Fixes Applied

### 1. Updated `tsconfig.json`

**Location**: `/tsconfig.json`

**Changes Made**:
```json
{
  "exclude": [
    "node_modules",
    "scripts",
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "**/__tests__/**",
    "__mocks__/**",
    "e2e/**",
    "jest.setup.ts",
    "jest.config.js",
    "playwright.config.ts"
  ]
}
```

**Why This Fixes The Issue**:
- Explicitly excludes all test files from TypeScript compilation during the Next.js build
- Prevents Jest setup files from being type-checked by Next.js
- Excludes E2E test files (Playwright)
- Excludes mock files that are only used in testing

### 2. Fixed `jest.setup.ts`

**Location**: `/jest.setup.ts`

**Changes Made**:
```typescript
// Before (INCORRECT):
process.env.NODE_ENV = 'test'

// After (CORRECT):
Object.assign(process.env, {
  STRIPE_SECRET_KEY: 'sk_test_mock_key',
  STRIPE_WEBHOOK_SECRET: 'whsec_mock_secret',
  RESEND_API_KEY: 're_mock_key',
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
})
```

**Why This Fixes The Issue**:
- `NODE_ENV` is automatically set to `'test'` by Jest, so manual assignment is unnecessary
- Using `Object.assign()` instead of direct assignment avoids the read-only property error
- This is a defensive fix; since the file is now excluded, it won't cause build issues

### 3. Fixed `jest.setup.js`

**Location**: `/jest.setup.js`

**Changes Made**: Same as `jest.setup.ts` above

**Why Both Files Exist**:
There are two Jest setup files in the project. The `jest.config.js` references `jest.setup.ts`, but both were fixed to prevent any future issues.

## Verification

### TypeScript Compilation Check
```bash
npx tsc --noEmit
```
**Result**: ✅ Passes without errors

### Expected Build Process
After these fixes, the Next.js build process will:
1. ✅ Only compile production code (app, components, lib)
2. ✅ Skip all test files and test setup files
3. ✅ Complete type checking successfully
4. ✅ Generate optimized production bundles

## Additional Considerations for Vercel Deployment

### Environment Variables
Ensure the following environment variables are set in Vercel:

**Required**:
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe secret key for payment processing
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `RESEND_API_KEY` - Resend API key for email notifications

**Optional** (Rate Limiting):
- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token

### Build Configuration
The project uses:
- **Framework**: Next.js 14.2.35
- **Node Version**: Should use Node 18.x or 20.x (Vercel default)
- **Build Command**: `npm run build` (or `next build`)
- **Output Directory**: `.next`

### Prisma Considerations
If using Prisma (which this project does):
1. Ensure `prisma generate` runs before build (Next.js handles this automatically)
2. Verify `DATABASE_URL` is set in Vercel environment variables
3. Consider running migrations via Vercel build hook or manually

## Potential Future Issues & Prevention

### 1. New Test Files
**Prevention**: Any new test files following these naming conventions will be automatically excluded:
- `*.test.ts` or `*.test.tsx`
- `*.spec.ts` or `*.spec.tsx`
- Files in `__tests__/` directories

### 2. New Test Configuration Files
**Action Needed**: If adding new test runners or configuration files, add them to the `tsconfig.json` exclude list.

### 3. Import Statements
**Warning**: Never import test utilities or Jest setup files in production code. This would create a dependency that could cause build issues.

### 4. Environment Variables
**Best Practice**: 
- Keep `.env.local` for local development only
- Never commit `.env` files to git
- Document all required environment variables in README
- Verify all required env vars are set in Vercel before deployment

## Build Success Indicators

When deploying to Vercel, look for these success indicators:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

## Rollback Plan

If issues persist after these fixes:

1. **Check Vercel Logs**: Look for specific error messages
2. **Verify Environment Variables**: Ensure all required vars are set
3. **Check Dependencies**: Verify all production dependencies are installed
4. **Test Locally**: Run `npm run build` locally to reproduce issues
5. **Incremental Debugging**: Comment out sections to isolate the problem

## Testing Checklist

Before pushing to Vercel:
- [x] TypeScript compilation passes (`npx tsc --noEmit`)
- [x] Test files are excluded from build
- [x] Jest setup files use correct environment variable assignment
- [ ] All required environment variables documented
- [ ] Local build completes successfully (`npm run build`)
- [ ] Unit tests pass (`npm test`)
- [ ] E2E tests pass (`npm run test:e2e`)

## Summary

The deployment failure was caused by test files being included in the production build. By properly configuring `tsconfig.json` to exclude all test-related files and fixing the environment variable assignment in Jest setup files, the build should now complete successfully on Vercel.

**Key Takeaway**: Test files should NEVER be part of the production TypeScript compilation. Always explicitly exclude them in `tsconfig.json`.
