# RCCG Shiloh Mega Parish - Complete Project Documentation

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Project Type:** Church Website with Online Giving

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [What We Built](#what-we-built)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [How It Works](#how-it-works)
6. [Key Decisions & Architecture](#key-decisions--architecture)
7. [Data Flow & User Journey](#data-flow--user-journey)
8. [Where to Make Changes](#where-to-make-changes)
9. [Development Guide](#development-guide)
10. [Deployment](#deployment)
11. [Version History](#version-history)

---

## Project Overview

### What Is This Project?

This is a modern, responsive website for **RCCG Shiloh Mega Parish** in Sugar Land, Texas. The website serves as the digital presence for the church, providing information about services, events, ministries, sermons, and enabling online donations.

### Who Is This For?

- **Church Members**: To find service times, events, sermons, and ministry information
- **Visitors**: To learn about the church, plan a visit, and get directions
- **Donors**: To make secure online donations (one-time or recurring)
- **Church Staff**: To manage and update content (with proper setup)

### Key Capabilities

✅ **Public-Facing Website**: Beautiful, modern design showcasing church information  
✅ **Online Donations**: Secure payment processing via Stripe  
✅ **Event Management**: Display upcoming events with details  
✅ **Sermon Archive**: Showcase latest sermons with video/audio links  
✅ **Ministry Pages**: Detailed information about each ministry  
✅ **Responsive Design**: Works perfectly on phones, tablets, and desktops  
✅ **Fast Performance**: Optimized for quick loading times  
✅ **Accessible**: Meets accessibility standards (WCAG 2.1 AA)

---

## What We Built

### 1. **Homepage** (`/`)
The main landing page featuring:
- **Hero Section**: Eye-catching banner with call-to-action
- **Service Schedule**: Times for Sunday services and midweek activities
- **Latest Sermon**: Most recent sermon with video/audio player
- **Featured Events**: Carousel of upcoming events
- **Pastor Profiles**: Information about church leadership
- **Ministry Grid**: Overview of all ministries
- **Donation CTA**: Call-to-action to support the church
- **Testimonials**: Member testimonials

### 2. **About Pages** (`/about`, `/about/pastors`)
- Church information and history
- Detailed pastor profiles with bios and photos

### 3. **Ministries** (`/ministries`, `/ministries/[slug]`)
- Grid view of all ministries
- Individual ministry pages with detailed information
- Categories: Age Groups, Service, Community

### 4. **Events** (`/events`, `/events/[slug]`)
- Calendar view of all events
- Individual event pages with full details
- Featured events highlighted on homepage

### 5. **Sermons** (`/sermons`, `/sermons/[slug]`)
- Archive of all sermons
- Individual sermon pages with video/audio players
- Latest sermon featured on homepage

### 6. **Online Giving** (`/give`, `/give/thank-you`)
- Secure donation form
- One-time donations
- Recurring donations (weekly/monthly)
- Stripe payment processing
- Thank you confirmation page

### 7. **Visit/Contact** (`/visit`)
- Service times and location
- Contact information
- Contact form

---

## Technology Stack

### Core Framework
- **Next.js 14+** (App Router): React framework for building the website
  - Why: Server-side rendering, automatic code splitting, excellent performance
  - Version: 14.2.0

### Programming Language
- **TypeScript**: Type-safe JavaScript
  - Why: Catches errors early, better code documentation, easier maintenance

### Styling
- **Tailwind CSS**: Utility-first CSS framework
  - Why: Fast development, consistent design, responsive by default
- **shadcn/ui**: Pre-built accessible components
  - Why: Beautiful, accessible components built on Radix UI

### Forms & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation
  - Why: Type-safe validation, excellent error handling

### Animations
- **Framer Motion**: Animation library
  - Why: Smooth, performant animations

### Payment Processing
- **Stripe**: Payment gateway
  - Why: Industry standard, secure, handles PCI compliance

### Content Management
- **Current**: Mock data in code (can be upgraded to headless CMS)
- **Future Options**: Contentful, Sanity, or Strapi

### Development Tools
- **TypeScript**: Type checking
- **ESLint**: Code quality
- **Sharp**: Image optimization

---

## Project Structure

```
Church/
├── app/                          # Next.js App Router (pages & routes)
│   ├── layout.tsx               # Root layout (header, footer, global styles)
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── not-found.tsx            # 404 page
│   │
│   ├── about/                   # About section
│   │   ├── page.tsx            # About page
│   │   └── pastors/
│   │       └── page.tsx        # Pastors listing
│   │
│   ├── ministries/              # Ministries section
│   │   ├── page.tsx            # Ministries listing
│   │   └── [slug]/
│   │       └── page.tsx        # Individual ministry page
│   │
│   ├── events/                  # Events section
│   │   ├── page.tsx            # Events calendar
│   │   └── [slug]/
│   │       └── page.tsx        # Individual event page
│   │
│   ├── sermons/                 # Sermons section
│   │   ├── page.tsx            # Sermons archive
│   │   └── [slug]/
│   │       └── page.tsx        # Individual sermon page
│   │
│   ├── give/                    # Donation section
│   │   ├── page.tsx            # Donation form
│   │   └── thank-you/
│   │       └── page.tsx        # Thank you page
│   │
│   ├── visit/                   # Visit/Contact page
│   │   └── page.tsx
│   │
│   └── api/                     # API routes (backend)
│       ├── create-payment-intent/
│       │   └── route.ts        # Create Stripe payment
│       ├── create-subscription/
│       │   └── route.ts        # Create recurring donation
│       └── webhook/
│           └── route.ts        # Stripe webhook handler
│
├── components/                   # Reusable React components
│   ├── ui/                      # Base UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   └── ScrollToTop.tsx
│   │
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx          # Site header/navigation
│   │   ├── Footer.tsx          # Site footer
│   │   ├── Navigation.tsx      # Main navigation menu
│   │   └── NavigationDropdown.tsx
│   │
│   ├── sections/               # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── ServiceScheduleSection.tsx
│   │   ├── LatestSermon.tsx
│   │   ├── FeaturedEventsCarousel.tsx
│   │   ├── PastorCard.tsx
│   │   ├── MinistryGrid.tsx
│   │   ├── TestimonialSection.tsx
│   │   └── ... (more sections)
│   │
│   ├── forms/                  # Form components
│   │   ├── ContactForm.tsx
│   │   └── DonationForm.tsx
│   │
│   ├── sermons/                # Sermon-specific components
│   │   └── SermonActions.tsx
│   │
│   └── animations/              # Animation components
│       ├── FadeInOnScroll.tsx
│       ├── FadeInItem.tsx
│       └── StaggerChildren.tsx
│
├── lib/                         # Utility libraries
│   ├── cms/                    # Content Management System
│   │   ├── client.ts          # CMS client (currently mock data)
│   │   ├── queries.ts         # Data fetching functions
│   │   └── types.ts           # TypeScript type definitions
│   │
│   └── utils/                  # Helper functions
│       ├── utils.ts           # General utilities
│       └── serviceTimes.ts    # Service time calculations
│
├── public/                      # Static assets
│   └── images/                 # Images (webp, avif, png formats)
│
├── scripts/                     # Utility scripts
│   ├── composite-pastor-image.ts
│   ├── replace-pastor-image.ts
│   └── create-clean-background.ts
│
├── Configuration Files
│   ├── package.json           # Dependencies & scripts
│   ├── tsconfig.json          # TypeScript configuration
│   ├── next.config.js         # Next.js configuration
│   ├── tailwind.config.ts     # Tailwind CSS configuration
│   └── postcss.config.js      # PostCSS configuration
│
└── docs/                      # Documentation folder
    ├── README.md              # Documentation index
    ├── documentation.md       # This file (complete documentation)
    ├── guides/
    │   ├── cms-explanation.md # CMS setup guide
    │   └── stripe-setup.md    # Payment setup guide
    ├── development/
    │   └── testing.md         # Testing guidelines
    └── project/
        └── enhancement-plan.md # Future improvements
```

---

## How It Works

### Request Flow (How a Page Loads)

1. **User visits a URL** (e.g., `https://rccgshilohmega.org/ministries`)
2. **Next.js receives the request** and matches it to a route in `app/ministries/page.tsx`
3. **Server-side data fetching**: The page component calls `getMinistries()` from `lib/cms/queries.ts`
4. **Data retrieval**: `queries.ts` calls `cmsClient.getMinistries()` which returns data (currently from mock data in `client.ts`)
5. **Page rendering**: Next.js renders the React component with the data
6. **HTML sent to browser**: The fully rendered page is sent to the user
7. **Client-side hydration**: React takes over for interactivity

### Component Hierarchy

```
RootLayout (app/layout.tsx)
├── Header (components/layout/Header.tsx)
│   └── Navigation (components/layout/Navigation.tsx)
│
├── Main Content (varies by page)
│   ├── Homepage (app/page.tsx)
│   │   ├── HeroSection
│   │   ├── ServiceScheduleSection
│   │   ├── LatestSermon
│   │   ├── FeaturedEventsCarousel
│   │   ├── PastorCard (multiple)
│   │   ├── MinistryGrid
│   │   └── TestimonialSection
│   │
│   ├── Ministries Page (app/ministries/page.tsx)
│   │   └── MinistryGrid
│   │
│   └── ... (other pages)
│
└── Footer (components/layout/Footer.tsx)
```

### Data Flow (How Data Moves Through the App)

```
┌─────────────────────────────────────────────────────────┐
│ 1. Content Source (Currently: Mock Data)              │
│    Location: lib/cms/client.ts                         │
│    Contains: Pastors, Ministries, Events, Sermons, etc. │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 2. CMS Client (lib/cms/client.ts)                      │
│    - getPastors()                                       │
│    - getMinistries()                                    │
│    - getEvents()                                        │
│    - getSermons()                                       │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Query Functions (lib/cms/queries.ts)                  │
│    - Wrapper functions that call CMS client            │
│    - Provides consistent API                            │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Page Components (app/**/page.tsx)                    │
│    - Call query functions                               │
│    - Receive data                                       │
│    - Pass to UI components                              │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 5. UI Components (components/**/*.tsx)                  │
│    - Receive data as props                              │
│    - Render UI                                           │
│    - Handle user interactions                           │
└─────────────────────────────────────────────────────────┘
```

### Payment Flow (How Donations Work)

```
User fills donation form
        │
        ▼
┌──────────────────────────────────────┐
│ Frontend: DonationForm.tsx            │
│ - Validates form input                │
│ - Collects: amount, name, email, etc. │
└──────────────┬────────────────────────┘
               │
               ▼ POST /api/create-payment-intent
┌──────────────────────────────────────┐
│ Backend: route.ts                    │
│ - Validates amount                    │
│ - Creates Stripe PaymentIntent        │
│ - Returns clientSecret                │
└──────────────┬────────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Frontend: Stripe Elements             │
│ - User enters card details            │
│ - Stripe handles secure input        │
└──────────────┬────────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Stripe: Processes Payment            │
│ - Validates card                      │
│ - Charges card                        │
│ - Sends webhook to server             │
└──────────────┬────────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Backend: /api/webhook/route.ts       │
│ - Verifies webhook signature          │
│ - Updates database (if configured)    │
│ - Sends confirmation email             │
└──────────────┬────────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ User: Redirected to /give/thank-you  │
│ - Confirmation message                │
│ - Receipt sent to email               │
└──────────────────────────────────────┘
```

---

## Key Decisions & Architecture

### 1. **Next.js App Router (Not Pages Router)**

**Decision**: Use Next.js 14+ App Router instead of the older Pages Router.

**Why**:
- ✅ Better performance with React Server Components
- ✅ Simpler data fetching (async components)
- ✅ Better code organization
- ✅ Future-proof (App Router is the recommended approach)

**Impact**: All pages are in `app/` directory, not `pages/`.

### 2. **TypeScript (Not JavaScript)**

**Decision**: Use TypeScript for all code.

**Why**:
- ✅ Catches errors before runtime
- ✅ Better IDE support and autocomplete
- ✅ Self-documenting code (types explain what data looks like)
- ✅ Easier refactoring

**Impact**: All files use `.ts` or `.tsx` extensions, strict type checking enabled.

### 3. **Mock Data (Not Real CMS Initially)**

**Decision**: Start with hardcoded mock data in `lib/cms/client.ts`.

**Why**:
- ✅ No additional cost
- ✅ Faster initial development
- ✅ Can upgrade to real CMS later without changing page components
- ✅ Simple for small churches with infrequent updates

**Impact**: Content updates require editing code files. Can be upgraded to Contentful/Sanity/Strapi later.

**See**: [`guides/cms-explanation.md`](./guides/cms-explanation.md) for details on upgrading to a real CMS.

### 4. **Stripe for Payments**

**Decision**: Use Stripe instead of PayPal or other payment processors.

**Why**:
- ✅ Industry standard, trusted by millions
- ✅ Handles PCI compliance (we never touch card numbers)
- ✅ Supports both one-time and recurring donations
- ✅ Excellent documentation and support
- ✅ Automatic receipt emails

**Impact**: Requires Stripe account and API keys. See [`guides/stripe-setup.md`](./guides/stripe-setup.md) for setup.

### 5. **shadcn/ui Components**

**Decision**: Use shadcn/ui instead of Material UI or other component libraries.

**Why**:
- ✅ Copy-paste components (not a dependency)
- ✅ Built on Radix UI (accessible by default)
- ✅ Fully customizable with Tailwind
- ✅ No bundle size bloat (only use what you need)

**Impact**: Components are in `components/ui/` and can be modified directly.

### 6. **Tailwind CSS (Not CSS Modules or Styled Components)**

**Decision**: Use Tailwind CSS for all styling.

**Why**:
- ✅ Fast development (utility classes)
- ✅ Consistent design system
- ✅ Responsive by default
- ✅ Small bundle size (unused styles removed)

**Impact**: All styling uses Tailwind utility classes.

### 7. **Server-Side Rendering (SSR)**

**Decision**: Render pages on the server, not just in the browser.

**Why**:
- ✅ Faster initial page load
- ✅ Better SEO (search engines see full content)
- ✅ Works even if JavaScript is disabled
- ✅ Better performance on slow devices

**Impact**: Page components are async and fetch data on the server.

### 8. **Component-Based Architecture**

**Decision**: Break UI into small, reusable components.

**Why**:
- ✅ Reusable code (write once, use many times)
- ✅ Easier to maintain (fix bug in one place)
- ✅ Easier to test
- ✅ Better code organization

**Impact**: Components are organized by purpose in `components/` directory.

---

## Data Flow & User Journey

### Homepage Journey

```
1. User visits homepage (/)
   │
   ├─► Server fetches data:
   │   ├─► getPastors()
   │   ├─► getMinistries()
   │   ├─► getEvents(10)
   │   ├─► getTestimonials()
   │   └─► getLatestSermon()
   │
   ├─► Page renders with data:
   │   ├─► HeroSection (with events)
   │   ├─► ServiceScheduleSection
   │   ├─► LatestSermon
   │   ├─► FeaturedEventsCarousel
   │   ├─► PastorCard (for each pastor)
   │   ├─► MinistryGrid
   │   ├─► Donation CTA
   │   └─► TestimonialSection
   │
   └─► User interacts:
       ├─► Clicks "View Events" → Goes to /events
       ├─► Clicks ministry → Goes to /ministries/[slug]
       ├─► Clicks "Donate" → Goes to /give
       └─► Scrolls to see more content
```

### Donation Journey

```
1. User clicks "Donate" button
   │
   ├─► Navigates to /give
   │
   ├─► Sees DonationForm component
   │   ├─► Fills in: amount, name, email, purpose
   │   ├─► Selects: one-time or recurring
   │   └─► Clicks "Donate Now"
   │
   ├─► Frontend validation (Zod schema)
   │   ├─► Amount must be ≥ $1
   │   ├─► Email must be valid
   │   └─► Name required
   │
   ├─► POST /api/create-payment-intent
   │   ├─► Server validates amount
   │   ├─► Creates Stripe PaymentIntent
   │   └─► Returns clientSecret
   │
   ├─► Stripe Elements loads
   │   ├─► User enters card details (secure, never touches our server)
   │   └─► Clicks "Pay"
   │
   ├─► Stripe processes payment
   │   ├─► Validates card
   │   ├─► Charges card
   │   └─► Sends webhook to /api/webhook
   │
   ├─► Server receives webhook
   │   ├─► Verifies signature
   │   ├─► Updates database (if configured)
   │   └─► Sends confirmation email
   │
   └─► User redirected to /give/thank-you
       └─► Sees confirmation message
```

### Event Browsing Journey

```
1. User clicks "View Events" or navigates to /events
   │
   ├─► Server fetches: getEvents()
   │
   ├─► Events page renders:
   │   ├─► EventCalendar (all events)
   │   └─► EventCategories (filter by category)
   │
   ├─► User clicks an event
   │
   └─► Navigates to /events/[slug]
       ├─► Server fetches: getEvent(slug)
       ├─► Event detail page renders:
       │   ├─► Event image
       │   ├─► Event title & description
       │   ├─► Date, time, location
       │   ├─► Full content (HTML)
       │   └─► Registration button (if applicable)
       │
       └─► User can:
           ├─► Share event
           ├─► Register (if registration required)
           └─► Go back to events list
```

---

## Where to Make Changes

### For Non-Engineers (Content Updates)

#### Update Pastor Information
**File**: `lib/cms/client.ts`  
**Look for**: `mockPastors` array (around line 23)  
**What to change**: Name, title, bio, image URL

```typescript
{
  id: "1",
  name: "Pastor Moses Olise",  // ← Change name here
  title: "Provincial Pastor",  // ← Change title here
  bio: "Leading with vision...", // ← Change bio here
  image: {
    url: "/images/pastorOlise.webp", // ← Change image path here
    alt: "Pastor Moses Olise",
  },
}
```

#### Update Ministries
**File**: `lib/cms/client.ts`  
**Look for**: `mockMinistries` array (around line 46)  
**What to change**: Title, description, content, image

#### Update Events
**File**: `lib/cms/client.ts`  
**Look for**: `getEvents()` method (around line 520)  
**What to change**: Event details in the `mockEvents` array

#### Update Sermons
**File**: `lib/cms/client.ts`  
**Look for**: `getSermons()` method (around line 846)  
**What to change**: Sermon details in the `mockSermons` array

#### Update Service Times
**File**: `lib/utils/serviceTimes.ts`  
**What to change**: Service schedule times

#### Update Contact Information
**File**: `app/visit/page.tsx`  
**What to change**: Address, phone, email

---

### For Engineers (Code Changes)

#### Add a New Page
1. Create new directory in `app/` (e.g., `app/news/`)
2. Create `page.tsx` file
3. Add navigation link in `components/layout/Navigation.tsx`

**Example**:
```typescript
// app/news/page.tsx
export default function NewsPage() {
  return <div>News content here</div>
}
```

#### Add a New Component
1. Create file in appropriate `components/` subdirectory
2. Export component
3. Import and use in pages

**Example**:
```typescript
// components/sections/NewsSection.tsx
export function NewsSection() {
  return <section>News section</section>
}
```

#### Modify Styling
- **Global styles**: `app/globals.css`
- **Component styles**: Use Tailwind classes in component files
- **Theme colors**: `tailwind.config.ts`

#### Add New API Route
1. Create directory in `app/api/` (e.g., `app/api/send-email/`)
2. Create `route.ts` file
3. Export HTTP methods (GET, POST, etc.)

**Example**:
```typescript
// app/api/send-email/route.ts
export async function POST(request: Request) {
  const data = await request.json()
  // Process email
  return Response.json({ success: true })
}
```

#### Change Payment Processing
- **Donation form**: `components/forms/DonationForm.tsx`
- **Payment intent creation**: `app/api/create-payment-intent/route.ts`
- **Webhook handling**: `app/api/webhook/route.ts`

#### Update Navigation
**File**: `components/layout/Navigation.tsx`  
**What to change**: Menu items, links, dropdown menus

#### Modify Layout (Header/Footer)
- **Header**: `components/layout/Header.tsx`
- **Footer**: `components/layout/Footer.tsx`
- **Root layout**: `app/layout.tsx`

#### Add Animation
**Files**: `components/animations/`  
**Usage**: Wrap components with animation components

**Example**:
```typescript
<FadeInOnScroll>
  <div>This fades in when scrolled into view</div>
</FadeInOnScroll>
```

#### Integrate Real CMS
1. Install CMS SDK (e.g., `npm install contentful`)
2. Update `lib/cms/client.ts` to use real API calls
3. Add environment variables for API keys
4. Update `.env.local` with credentials

**See**: [`guides/cms-explanation.md`](./guides/cms-explanation.md) for detailed guide.

---

### Common Change Scenarios

#### Scenario 1: Add a New Ministry
1. Open `lib/cms/client.ts`
2. Find `mockMinistries` array
3. Add new ministry object with: id, slug, title, description, image, category, content
4. Save and redeploy

#### Scenario 2: Change Homepage Layout
1. Open `app/page.tsx`
2. Reorder, add, or remove sections
3. Each section is a component from `components/sections/`

#### Scenario 3: Update Church Logo
1. Replace image in `public/images/`
2. Update reference in `components/layout/Header.tsx` (line ~34)

#### Scenario 4: Change Color Scheme
1. Open `tailwind.config.ts`
2. Modify `colors` in theme
3. Colors cascade to all components

#### Scenario 5: Add New Donation Amount Preset
1. Open `components/forms/DonationForm.tsx`
2. Find donation amount buttons
3. Add new button with amount value

#### Scenario 6: Update Footer Links
1. Open `components/layout/Footer.tsx`
2. Modify links in footer sections

---

## Development Guide

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **Code Editor**: VS Code recommended (with extensions: ESLint, Prettier, Tailwind CSS IntelliSense)

### Initial Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd Church
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add:
   ```env
   # Stripe (for donations)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   
   # CMS (if using real CMS)
   NEXT_PUBLIC_CMS_API_KEY=...
   NEXT_PUBLIC_CMS_SPACE_ID=...
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open browser**: Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev`: Start development server (with hot reload)
- `npm run build`: Build production version
- `npm run start`: Start production server (after build)
- `npm run lint`: Check code for errors
- `npm run composite-pastor`: Run pastor image compositing script
- `npm run replace-pastor`: Replace pastor image
- `npm run create-clean-background`: Create clean background for images

### Development Workflow

1. **Make changes** to code files
2. **Save file** → Next.js automatically reloads
3. **Check browser** → See changes immediately
4. **Test functionality** → Ensure everything works
5. **Commit changes** → Use git to save progress

### Code Style Guidelines

- **TypeScript**: Use strict types, avoid `any`
- **Components**: Use PascalCase for component names
- **Files**: Use kebab-case for file names (except components: PascalCase)
- **Imports**: Use `@/` alias for imports from root
- **Formatting**: Use Prettier (auto-format on save recommended)

### Testing Checklist

Before deploying, test:
- [ ] All pages load correctly
- [ ] Navigation works (desktop and mobile)
- [ ] Forms submit successfully
- [ ] Donation flow works (use test card: 4242 4242 4242 4242)
- [ ] Images load properly
- [ ] Responsive design works on phone/tablet/desktop
- [ ] No console errors
- [ ] Links work correctly

### Debugging Tips

1. **Check browser console**: Open DevTools (F12) → Console tab
2. **Check server logs**: Look at terminal where `npm run dev` is running
3. **Check network tab**: DevTools → Network tab to see API calls
4. **TypeScript errors**: VS Code will show red underlines
5. **Build errors**: Run `npm run build` to see production build errors

---

## Deployment

### Recommended: Vercel (Easiest)

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js

3. **Add environment variables**:
   - In Vercel dashboard → Settings → Environment Variables
   - Add all variables from `.env.local`
   - Use production Stripe keys (not test keys)

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Get your live URL (e.g., `https://rccgshilohmega.vercel.app`)

5. **Set up custom domain** (optional):
   - In Vercel dashboard → Settings → Domains
   - Add your domain (e.g., `rccgshilohmega.org`)
   - Follow DNS configuration instructions

### Alternative: Other Platforms

The site can be deployed to any platform that supports Next.js:
- **Netlify**: Similar to Vercel, good alternative
- **AWS Amplify**: For AWS users
- **Railway**: Simple deployment platform
- **Self-hosted**: Requires Node.js server setup

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Stripe keys are production keys (not test)
- [ ] Custom domain configured (if applicable)
- [ ] All content updated (pastors, ministries, events)
- [ ] Images optimized and uploaded
- [ ] Test donation flow with real card (small amount)
- [ ] Test all pages and links
- [ ] Set up webhook URL in Stripe dashboard
- [ ] Configure email notifications (if applicable)

### Post-Deployment

1. **Test live site**: Visit your domain and test everything
2. **Set up monitoring**: Consider adding error tracking (Sentry, etc.)
3. **Set up analytics**: Add Google Analytics or similar
4. **Backup**: Ensure code is in version control (GitHub)
5. **Documentation**: Update any hardcoded URLs in code/docs

---

## Version History

### Version 1.0.0 (January 2025)

**Initial Release**

**Features**:
- ✅ Complete website with all pages
- ✅ Online donation system (Stripe integration)
- ✅ Event management and display
- ✅ Sermon archive
- ✅ Ministry pages
- ✅ Pastor profiles
- ✅ Responsive design
- ✅ Accessibility features
- ✅ Animations and smooth interactions

**Technology Stack**:
- Next.js 14.2.0
- TypeScript 5.5.0
- Tailwind CSS 3.4.0
- Stripe payment processing
- Framer Motion animations
- shadcn/ui components

**Known Limitations**:
- Content is hardcoded (mock data)
- No admin dashboard
- No user authentication
- No database (can be added later)

**Future Enhancements** (See [`project/enhancement-plan.md`](./project/enhancement-plan.md)):
- Real CMS integration
- Admin dashboard
- Email notifications
- Donation history
- Event registration
- Member portal

---

## Additional Resources

### Documentation Files

- **[Documentation Index](./README.md)**: Navigation guide for all documentation
- **[CMS Explanation](./guides/cms-explanation.md)**: Understanding and setting up CMS
- **[Stripe Setup](./guides/stripe-setup.md)**: Payment processing setup
- **[Testing](./development/testing.md)**: Testing guidelines
- **[Enhancement Plan](./project/enhancement-plan.md)**: Future improvements

### External Resources

- **Next.js Docs**: https://nextjs.org/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **shadcn/ui Docs**: https://ui.shadcn.com

### Getting Help

1. **Check documentation**: Read relevant docs first
2. **Check error messages**: Often point to the solution
3. **Search online**: Error messages usually have solutions on Stack Overflow
4. **Check GitHub issues**: If using open-source libraries
5. **Contact developer**: For project-specific questions

---

## Glossary

**API Route**: Server-side code that handles HTTP requests (like `/api/create-payment-intent`)

**App Router**: Next.js 14+ routing system (uses `app/` directory)

**CMS**: Content Management System - tool for managing website content without code

**Component**: Reusable piece of UI (like a button or card)

**Environment Variables**: Secret configuration values (API keys, etc.) stored in `.env.local`

**Mock Data**: Fake/hardcoded data used for development (instead of real database)

**Server-Side Rendering (SSR)**: Rendering pages on the server before sending to browser

**Stripe**: Payment processing service

**TypeScript**: Typed version of JavaScript that catches errors early

**Webhook**: HTTP callback from Stripe to our server when payment completes

---

**End of Documentation**

For questions or updates, refer to the relevant sections above or contact the development team.
