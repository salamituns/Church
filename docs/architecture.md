# System Architecture

**Visual guide to how the system is structured and how components interact.**

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User's Browser                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Components (Client-Side)                          │  │
│  │  - Interactive UI                                        │  │
│  │  - Form handling                                         │  │
│  │  - Animations                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Server (Vercel)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  App Router (Server-Side Rendering)                       │  │
│  │  - Pages (app/**/page.tsx)                               │  │
│  │  - Layouts (app/layout.tsx)                              │  │
│  │  - API Routes (app/api/**/route.ts)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────┬──────────────────────┬────────────────────────────┘
             │                      │
             ▼                      ▼
    ┌─────────────────┐    ┌─────────────────┐
    │  CMS Client     │    │  Stripe API     │
    │  JSON Files     │    │  (Payments)     │
    └─────────────────┘    └─────────────────┘
```

---

## Component Architecture

### Page Structure

```
RootLayout (app/layout.tsx)
│
├── Header (components/layout/Header.tsx)
│   ├── Logo
│   ├── Navigation (components/layout/Navigation.tsx)
│   │   ├── Home
│   │   ├── About
│   │   ├── Ministries (Dropdown)
│   │   ├── Events
│   │   ├── Sermons
│   │   └── Visit
│   └── Donate Button
│
├── Main Content (varies by route)
│   │
│   ├── Homepage (app/page.tsx)
│   │   ├── HeroSection
│   │   ├── ServiceScheduleSection
│   │   ├── LatestSermon
│   │   ├── FeaturedEventsCarousel
│   │   ├── PastorCard (×2)
│   │   ├── MinistryGrid
│   │   ├── Donation CTA
│   │   └── TestimonialSection
│   │
│   ├── Ministries (app/ministries/page.tsx)
│   │   └── MinistryGrid
│   │
│   ├── Events (app/events/page.tsx)
│   │   ├── EventCalendar
│   │   └── EventCategories
│   │
│   ├── Sermons (app/sermons/page.tsx)
│   │   └── SermonCard (multiple)
│   │
│   ├── Give (app/give/page.tsx)
│   │   └── DonationForm
│   │       ├── Amount Input
│   │       ├── Personal Info
│   │       ├── Stripe Elements
│   │       └── Submit Button
│   │
│   └── Visit (app/visit/page.tsx)
│       ├── Service Times
│       ├── Location Map
│       └── ContactForm
│
└── Footer (components/layout/Footer.tsx)
    ├── Church Info
    ├── Quick Links
    ├── Contact Info
    └── Social Media
```

---

## Data Flow Architecture

### Content Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Content Source (lib/cms/data/*.json)                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  JSON Files:                                          │ │
│  │  - pastors.json                                       │ │
│  │  - ministries.json                                    │ │
│  │  - events.json                                        │ │
│  │  - sermons.json                                       │ │
│  │  - testimonials.json                                  │ │
│  └───────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  CMS Client (lib/cms/client.ts)                            │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Methods:                                             │ │
│  │  - getPastors() → Pastor[]                            │ │
│  │  - getMinistries() → Ministry[]                       │ │
│  │  - getEvents(limit?) → Event[]                        │ │
│  │  - getSermons(limit?) → Sermon[]                      │ │
│  │  - getTestimonials() → Testimonial[]                  │ │
│  └───────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Query Functions (lib/cms/queries.ts)                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Wrapper Functions:                                   │ │
│  │  - getPastors()                                       │ │
│  │  - getMinistries()                                    │ │
│  │  - getEvents(limit?)                                  │ │
│  │  - getSermon(slug)                                    │ │
│  │  - getLatestSermon()                                  │ │
│  └───────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Page Components (app/**/page.tsx)                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Server Components (async):                           │ │
│  │  - Fetch data using query functions                    │ │
│  │  - Pass data to UI components as props                │ │
│  └───────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  UI Components (components/**/*.tsx)                        │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  - Receive data as props                              │ │
│  │  - Render UI                                           │ │
│  │  - Handle user interactions                           │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Payment Flow Architecture

```
User Browser
    │
    │ 1. Fills Donation Form
    ▼
┌─────────────────────────────────────┐
│  DonationForm Component              │
│  - Validates input (Zod)            │
│  - Collects: amount, name, email   │
└──────────────┬──────────────────────┘
               │
               │ 2. POST /api/create-payment-intent
               ▼
┌─────────────────────────────────────┐
│  API Route: create-payment-intent   │
│  - Validates amount                 │
│  - Creates Stripe PaymentIntent     │
│  - Returns clientSecret             │
└──────────────┬──────────────────────┘
               │
               │ 3. Returns clientSecret
               ▼
┌─────────────────────────────────────┐
│  Stripe Elements (Client-Side)      │
│  - Secure card input                 │
│  - User enters card details          │
└──────────────┬──────────────────────┘
               │
               │ 4. Submit Payment
               ▼
┌─────────────────────────────────────┐
│  Stripe API (External)              │
│  - Validates card                    │
│  - Processes payment                │
│  - Sends webhook                    │
└──────────────┬──────────────────────┘
               │
               │ 5. Webhook Event
               ▼
┌─────────────────────────────────────┐
│  API Route: /api/webhook           │
│  - Verifies webhook signature       │
│  - Updates database (if configured) │
│  - Sends confirmation email         │
└──────────────┬──────────────────────┘
               │
               │ 6. Redirect
               ▼
┌─────────────────────────────────────┐
│  Thank You Page (/give/thank-you)  │
│  - Confirmation message             │
└─────────────────────────────────────┘
```

---

## File Structure Architecture

```
Church/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx              # Root layout (wraps all pages)
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   │
│   ├── about/                  # About section
│   │   ├── page.tsx
│   │   └── pastors/
│   │       └── page.tsx
│   │
│   ├── ministries/             # Ministries section
│   │   ├── page.tsx           # List view
│   │   └── [slug]/
│   │       └── page.tsx       # Detail view
│   │
│   ├── events/                 # Events section
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── sermons/               # Sermons section
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── give/                   # Donations
│   │   ├── page.tsx           # Donation form
│   │   └── thank-you/
│   │       └── page.tsx      # Confirmation
│   │
│   ├── visit/                  # Contact/Visit
│   │   └── page.tsx
│   │
│   └── api/                    # API Routes (Backend)
│       ├── create-payment-intent/
│       │   └── route.ts       # Create Stripe payment
│       ├── create-subscription/
│       │   └── route.ts       # Create recurring donation
│       └── webhook/
│           └── route.ts       # Stripe webhook handler
│
├── components/                  # React Components
│   ├── ui/                     # Base UI (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── NavigationDropdown.tsx
│   │
│   ├── sections/               # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── ServiceScheduleSection.tsx
│   │   ├── LatestSermon.tsx
│   │   ├── FeaturedEventsCarousel.tsx
│   │   ├── PastorCard.tsx
│   │   ├── MinistryGrid.tsx
│   │   └── ...
│   │
│   ├── forms/                  # Form components
│   │   ├── ContactForm.tsx
│   │   └── DonationForm.tsx
│   │
│   ├── sermons/                # Sermon components
│   │   └── SermonActions.tsx
│   │
│   └── animations/             # Animation components
│       ├── FadeInOnScroll.tsx
│       ├── FadeInItem.tsx
│       └── StaggerChildren.tsx
│
├── lib/                        # Utilities & Libraries
│   ├── cms/                    # Content Management
│   │   ├── client.ts          # CMS client (reads JSON files)
│   │   ├── data/              # JSON content files
│   │   ├── queries.ts         # Data fetching functions
│   │   └── types.ts           # TypeScript types
│   │
│   └── utils/                  # Helper functions
│       ├── utils.ts           # General utilities
│       └── serviceTimes.ts   # Service time calculations
│
├── public/                     # Static Assets
│   └── images/                # Images (webp, avif, png)
│
└── scripts/                    # Utility Scripts
    ├── composite-pastor-image.ts
    ├── replace-pastor-image.ts
    └── create-clean-background.ts
```

---

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────┐
│  Presentation Layer                                     │
│  - React Components                                     │
│  - Tailwind CSS                                         │
│  - Framer Motion (Animations)                           │
│  - shadcn/ui Components                                 │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Application Layer                                      │
│  - Next.js App Router                                   │
│  - Server Components                                    │
│  - Client Components                                    │
│  - API Routes                                           │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Data Layer                                             │
│  - CMS Client (JSON Files)                             │
│  - Query Functions                                      │
│  - Type Definitions                                     │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  External Services                                      │
│  - Stripe (Payments)                                    │
│  - Future: CMS (Contentful/Sanity/Strapi)               │
│  - Future: Email Service                                │
└─────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow

### Page Request Flow

```
1. User requests: GET /ministries
   │
   ▼
2. Next.js matches route: app/ministries/page.tsx
   │
   ▼
3. Server Component executes:
   - Calls getMinistries() from lib/cms/queries.ts
   │
   ▼
4. Query function calls:
   - cmsClient.getMinistries() from lib/cms/client.ts
   │
   ▼
5. CMS Client returns:
   - Data from ministries.json file
   │
   ▼
6. Page component receives data:
   - Renders MinistryGrid with ministries data
   │
   ▼
7. Next.js renders HTML:
   - Server-side rendered HTML sent to browser
   │
   ▼
8. Browser receives HTML:
   - Displays page immediately
   - React hydrates for interactivity
```

### API Request Flow

```
1. User submits donation form
   │
   ▼
2. Frontend sends: POST /api/create-payment-intent
   Body: { amount: 50, name: "...", email: "..." }
   │
   ▼
3. API Route handler executes:
   - Validates request body
   - Creates Stripe PaymentIntent
   │
   ▼
4. Stripe API processes:
   - Returns PaymentIntent with clientSecret
   │
   ▼
5. API Route returns:
   Response: { clientSecret: "pi_..." }
   │
   ▼
6. Frontend receives response:
   - Loads Stripe Elements
   - User enters card details
   │
   ▼
7. Stripe processes payment:
   - Validates and charges card
   - Sends webhook to /api/webhook
   │
   ▼
8. Webhook handler:
   - Verifies webhook signature
   - Processes payment confirmation
   - Sends email receipt
```

---

## Component Dependency Graph

```
RootLayout
    │
    ├── Header
    │   ├── Navigation
    │   │   └── NavigationDropdown
    │   └── Button (from ui/)
    │
    ├── Main Content (varies)
    │   │
    │   ├── Homepage
    │   │   ├── HeroSection
    │   │   ├── ServiceScheduleSection
    │   │   │   └── ServiceSchedule
    │   │   ├── LatestSermon
    │   │   ├── FeaturedEventsCarousel
    │   │   ├── PastorCard (×2)
    │   │   ├── MinistryGrid
    │   │   │   └── Card (from ui/)
    │   │   └── TestimonialSection
    │   │
    │   ├── Ministries Page
    │   │   └── MinistryGrid
    │   │
    │   ├── Events Page
    │   │   ├── EventCalendar
    │   │   └── EventCategories
    │   │
    │   ├── Give Page
    │   │   └── DonationForm
    │   │       ├── Input (from ui/)
    │   │       ├── Select (from ui/)
    │   │       └── Stripe Elements
    │   │
    │   └── Visit Page
    │       └── ContactForm
    │
    └── Footer
        └── Link components
```

---

## Data Models

### Type Definitions (lib/cms/types.ts)

```
Pastor
├── id: string
├── name: string
├── title: string
├── bio?: string
└── image: ImageAsset

Ministry
├── id: string
├── slug: string
├── title: string
├── description: string
├── content?: string
├── image: ImageAsset
├── leader?: string
└── category: "age-groups" | "service" | "community"

Event
├── id: string
├── slug: string
├── title: string
├── description: string
├── content?: string
├── date: Date
├── time?: string
├── location?: string
├── image?: ImageAsset
├── registrationRequired?: boolean
└── featured?: boolean

Sermon
├── id: string
├── slug: string
├── title: string
├── description: string
├── date: Date
├── speaker?: string
├── series?: string
├── image?: ImageAsset
├── videoUrl?: string
└── audioUrl?: string
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Client-Side (Browser)                                   │
│  - Public Stripe key only                               │
│  - No sensitive data stored                              │
│  - Form validation (Zod)                                 │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼ HTTPS
┌─────────────────────────────────────────────────────────┐
│  Server-Side (Next.js API Routes)                       │
│  - Secret Stripe key (env variable)                    │
│  - Input validation                                     │
│  - Error handling                                       │
│  - Webhook signature verification                       │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼ API
┌─────────────────────────────────────────────────────────┐
│  Stripe API                                              │
│  - PCI compliant                                         │
│  - Card data never touches our server                   │
│  - Secure payment processing                             │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
Developer
    │
    │ git push
    ▼
GitHub Repository
    │
    │ Webhook
    ▼
Vercel Platform
    │
    ├── Build Process
    │   ├── Install dependencies
    │   ├── TypeScript compilation
    │   ├── Next.js build
    │   └── Optimize assets
    │
    ├── Environment Variables
    │   ├── Stripe keys
    │   ├── CMS keys (if configured)
    │   └── Base URL
    │
    └── Deployment
        ├── Edge Network (CDN)
        ├── Serverless Functions (API routes)
        └── Static Assets (images, etc.)
            │
            ▼
        Global CDN
            │
            ▼
        User's Browser
```

---

## Future Architecture (With Real CMS)

```
Current (JSON Files)
┌─────────────────┐
│  lib/cms/        │
│  data/           │
│  *.json          │
│  (JSON Files)   │
└─────────────────┘

Future (Headless CMS)
┌─────────────────┐
│  Contentful/     │
│  Sanity/Strapi  │
│  (Cloud Service)│
└────────┬────────┘
         │
         │ API
         ▼
┌─────────────────┐
│  lib/cms/        │
│  client.ts       │
│  (API Calls)     │
└─────────────────┘
```

**Note**: The page components and UI remain unchanged. Only `lib/cms/client.ts` needs to be updated to swap JSON imports for CMS API calls.

---

**Last Updated**: January 2025
