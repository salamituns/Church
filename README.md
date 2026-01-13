# RCCG Shiloh Mega Parish Website

A modern, welcoming church website built with Next.js 14+, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Clean, welcoming interface with warm color palette..
- **Responsive**: Fully responsive design that works on all devices
- **Performance Optimized**: Fast loading times with Next.js optimizations
- **Accessible**: WCAG 2.1 AA compliant with proper ARIA labels
- **JSON-Based Content**: Easy content updates via JSON files (no CMS required)
- **Online Giving**: Secure donation processing
- **Event Management**: Calendar and event registration
- **Sermon Archive**: Audio/video sermon library
- **Ministries Showcase**: Dynamic ministry pages

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form + Zod validation
- **Content Management**: JSON file-based (can upgrade to CMS later)

## Getting Started..

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your API keys:
- `STRIPE_PUBLIC_KEY` - Stripe public key (for donations)
- `STRIPE_SECRET_KEY` - Stripe secret key (for server-side)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret (for payment confirmations)
- `EMAIL_SERVICE_API_KEY` - Email service API key (optional, for contact form)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ChurchSite/
├── app/                    # Next.js App Router pages
│   ├── (home)/            # Home route group
│   ├── about/             # About pages
│   ├── ministries/        # Ministry pages
│   ├── events/            # Event pages
│   ├── sermons/           # Sermon pages
│   ├── give/              # Donation pages
│   └── visit/              # Visit/contact page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── sections/          # Page sections
│   ├── layout/            # Layout components
│   └── forms/             # Form components
├── lib/
│   ├── cms/               # CMS integration
│   └── utils/              # Utility functions
└── public/                 # Static assets
```

## Content Management

Content is managed through JSON files in `lib/cms/data/`. This approach is:
- ✅ **Free** - No monthly CMS costs
- ✅ **Simple** - Edit JSON files directly
- ✅ **Version Controlled** - All changes tracked in Git
- ✅ **Easy to Update** - Edit files on GitHub or locally

### Updating Content

1. **Edit JSON files** in `lib/cms/data/`:
   - `pastors.json` - Pastor profiles
   - `ministries.json` - Ministry information
   - `events.json` - Upcoming events
   - `sermons.json` - Sermon archive
   - `testimonials.json` - Member testimonials

2. **See `lib/cms/data/README.md`** for detailed instructions and examples

3. **Deploy** - Changes auto-deploy on Git push (if using Vercel)

### Future: CMS Integration

The architecture supports upgrading to a headless CMS (Contentful/Sanity/Strapi) later if needed. Just replace the JSON file imports in `lib/cms/client.ts` with CMS API calls.

## Payment Integration

The donation form is ready for payment gateway integration:

- **Stripe**: Use `stripe` and `@stripe/stripe-js`
- **PayPal**: Use `@paypal/react-paypal-js`

Update `components/forms/DonationForm.tsx` with your payment processing logic.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Self-hosted

## Performance

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- SEO optimization with metadata
- Accessibility features (ARIA labels, keyboard navigation)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Copyright © 2025 RCCG Shiloh Mega Parish

## Documentation

📚 **All documentation is located in the [`docs/`](./docs/) folder.**

**Start here**: [`docs/README.md`](./docs/README.md) - Documentation index and navigation guide

### Quick Links

- 📖 **[Complete Documentation](./docs/documentation.md)** - Comprehensive guide covering everything
- 🔍 **[Quick Reference](./docs/quick-reference.md)** - Fast lookups and common tasks
- 👁️ **[Visual Guide](./docs/visual-guide.md)** - Simple explanations for non-engineers
- 🏗️ **[Architecture](./docs/architecture.md)** - System architecture and design

### Setup & Configuration

- 📝 **[CMS Explanation](./docs/guides/cms-explanation.md)** - Understanding and setting up a CMS
- 💳 **[Stripe Setup](./docs/guides/stripe-setup.md)** - Payment processing setup
- ✅ **[Testing](./docs/development/testing.md)** - Testing guidelines

### Project Management

- 📋 **[Changelog](./docs/project/changelog.md)** - Version history
- 🚀 **[Enhancement Plan](./docs/project/enhancement-plan.md)** - Future improvements

## Support

For questions or support, please contact the church office.

