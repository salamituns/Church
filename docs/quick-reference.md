# Quick Reference Guide

**For**: Fast lookups and common tasks  
**Full Documentation**: See [`documentation.md`](./documentation.md)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📁 File Locations (Where to Find Things)

| What You Need | File Location |
|---------------|---------------|
| Update pastor info | `lib/cms/client.ts` → `mockPastors` |
| Update ministries | `lib/cms/client.ts` → `mockMinistries` |
| Update events | `lib/cms/client.ts` → `getEvents()` method |
| Update sermons | `lib/cms/client.ts` → `getSermons()` method |
| Change homepage | `app/page.tsx` |
| Change navigation | `components/layout/Navigation.tsx` |
| Change header | `components/layout/Header.tsx` |
| Change footer | `components/layout/Footer.tsx` |
| Update service times | `lib/utils/serviceTimes.ts` |
| Change donation form | `components/forms/DonationForm.tsx` |
| Update contact info | `app/visit/page.tsx` |
| Change colors/theme | `tailwind.config.ts` |
| Add new page | Create `app/[page-name]/page.tsx` |
| Add new component | Create in `components/` directory |

---

## 🔧 Common Tasks

### Update Content (Non-Engineers)

1. **Change Pastor Bio**:
   - Open: `lib/cms/client.ts`
   - Find: `mockPastors` (around line 23)
   - Edit: Name, title, bio, image URL

2. **Add New Event**:
   - Open: `lib/cms/client.ts`
   - Find: `getEvents()` method (around line 520)
   - Add new object to `mockEvents` array

3. **Update Service Times**:
   - Open: `lib/utils/serviceTimes.ts`
   - Edit: Service schedule times

### Code Changes (Engineers)

1. **Add New Page**:
   ```typescript
   // Create: app/news/page.tsx
   export default function NewsPage() {
     return <div>News content</div>
   }
   ```

2. **Add New Component**:
   ```typescript
   // Create: components/sections/NewsSection.tsx
   export function NewsSection() {
     return <section>News section</section>
   }
   ```

3. **Add API Route**:
   ```typescript
   // Create: app/api/send-email/route.ts
   export async function POST(request: Request) {
     const data = await request.json()
     return Response.json({ success: true })
   }
   ```

---

## 🎨 Styling Quick Reference

### Tailwind Classes

```tsx
// Spacing
className="p-4"        // padding
className="m-4"        // margin
className="gap-4"      // gap between items

// Layout
className="flex"       // flexbox
className="grid"       // grid
className="container"  // max-width container

// Colors
className="bg-primary"     // background color
className="text-primary"  // text color
className="border"         // border

// Responsive
className="sm:text-lg"    // small screens and up
className="md:flex"       // medium screens and up
className="lg:grid-cols-3" // large screens and up
```

### Component Styling

- **Global styles**: `app/globals.css`
- **Theme colors**: `tailwind.config.ts`
- **Component styles**: Tailwind classes in component files

---

## 🔐 Environment Variables

Create `.env.local` file:

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# CMS (if using)
NEXT_PUBLIC_CMS_API_KEY=...
NEXT_PUBLIC_CMS_SPACE_ID=...
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` | Framework |
| `react` | UI library |
| `typescript` | Type safety |
| `tailwindcss` | Styling |
| `stripe` | Payments |
| `framer-motion` | Animations |
| `react-hook-form` | Forms |
| `zod` | Validation |

---

## 🧪 Testing

### Test Donation Flow

1. Use test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any 3-digit CVC
4. Any ZIP code

### Test Pages

- Homepage: `http://localhost:3000/`
- Events: `http://localhost:3000/events`
- Ministries: `http://localhost:3000/ministries`
- Sermons: `http://localhost:3000/sermons`
- Donate: `http://localhost:3000/give`
- Visit: `http://localhost:3000/visit`

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Checklist

- [ ] Environment variables set
- [ ] Production Stripe keys (not test)
- [ ] All content updated
- [ ] Test donation flow
- [ ] Custom domain configured

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Module not found" | Run `npm install` |
| "Stripe not defined" | Check `.env.local` has `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| Build fails | Check TypeScript errors: `npm run build` |
| Styles not working | Restart dev server: `npm run dev` |
| Payment not working | Check Stripe keys are correct |

---

## 📚 More Help

- **Full Documentation**: [`documentation.md`](./documentation.md)
- **CMS Setup**: [`guides/cms-explanation.md`](./guides/cms-explanation.md)
- **Stripe Setup**: [`guides/stripe-setup.md`](./guides/stripe-setup.md)
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Last Updated**: January 2025
