# Visual Guide for Non-Engineers

**Simple explanations with diagrams to help anyone understand how the website works.**

---

## What Is This Website?

Think of the website like a **digital church building**:

```
┌─────────────────────────────────────┐
│     Church Website                  │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │ Homepage │  │ Events   │       │
│  └──────────┘  └──────────┘       │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │ Ministries│  │ Sermons  │       │
│  └──────────┘  └──────────┘       │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │  Donate  │  │  Visit   │       │
│  └──────────┘  └──────────┘       │
└─────────────────────────────────────┘
```

Just like a physical church has different rooms (sanctuary, office, fellowship hall), the website has different **pages** for different purposes.

---

## How Does It Work? (Simple Version)

### Step 1: Someone Visits the Website

```
Person types: rccgshilohmega.org
                    │
                    ▼
        ┌───────────────────┐
        │  Their Computer   │
        │  (Browser)        │
        └─────────┬─────────┘
                  │
                  │ "Show me the homepage"
                  ▼
        ┌───────────────────┐
        │  Our Website      │
        │  (Server)         │
        └─────────┬─────────┘
                  │
                  │ "Here's the homepage"
                  ▼
        ┌───────────────────┐
        │  Person Sees:     │
        │  - Church logo    │
        │  - Service times  │
        │  - Events         │
        │  - Ministries     │
        └───────────────────┘
```

### Step 2: Where Does the Information Come From?

Right now, all the information (pastors, events, ministries) is stored in a **code file** on our server:

```
┌─────────────────────────────────────┐
│  File: lib/cms/client.ts            │
│                                     │
│  This file contains:                │
│  • Pastor names and bios           │
│  • Event details                   │
│  • Ministry descriptions           │
│  • Sermon information              │
└─────────────────────────────────────┘
```

**Think of it like a filing cabinet** - all the church information is stored in one place.

---

## How to Update Content

### Example: Adding a New Event

**Current Process** (Simple but requires a developer):

```
1. Developer opens: lib/cms/client.ts
   │
   ▼
2. Finds the events section
   │
   ▼
3. Adds new event information:
   {
     title: "Easter Service",
     date: "April 20, 2025",
     time: "10:00 AM",
     location: "Main Sanctuary"
   }
   │
   ▼
4. Saves file and redeploys website
   │
   ▼
5. New event appears on website
```

**Future Process** (With CMS - easier for non-technical staff):

```
1. Staff member logs into CMS website
   │
   ▼
2. Clicks "Add New Event"
   │
   ▼
3. Fills out form:
   - Title: Easter Service
   - Date: April 20, 2025
   - Time: 10:00 AM
   - Location: Main Sanctuary
   │
   ▼
4. Clicks "Save"
   │
   ▼
5. Event automatically appears on website
   (No developer needed!)
```

---

## How Donations Work

### The Donation Process (Step by Step)

```
┌─────────────────────────────────────────┐
│  Step 1: Person Wants to Donate        │
│  - Clicks "Donate" button               │
│  - Goes to donation page                │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 2: Fills Out Form                 │
│  - Amount: $50                         │
│  - Name: John Smith                    │
│  - Email: john@example.com              │
│  - Purpose: General Offering           │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 3: Enters Card Information       │
│  - Card number: 4242 4242 4242 4242    │
│  - Expiry: 12/25                       │
│  - CVC: 123                            │
│                                         │
│  ⚠️ IMPORTANT:                          │
│  Card info goes DIRECTLY to Stripe     │
│  (We never see or store card numbers)  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 4: Stripe Processes Payment      │
│  - Validates card                       │
│  - Charges $50                         │
│  - Sends confirmation to our server     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 5: Confirmation                   │
│  - Person sees "Thank You" page         │
│  - Receives email receipt               │
│  - Donation is complete!                │
└─────────────────────────────────────────┘
```

### Why Stripe? (Security)

```
┌─────────────────────────────────────┐
│  WITHOUT Stripe (Dangerous!)         │
│                                     │
│  Person → Our Server → Card Info    │
│  ❌ We store card numbers           │
│  ❌ Security risk                   │
│  ❌ PCI compliance required         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  WITH Stripe (Safe!)                │
│                                     │
│  Person → Stripe → Card Info       │
│  ✅ Stripe stores card numbers     │
│  ✅ We never see card details      │
│  ✅ Stripe handles security        │
└─────────────────────────────────────┘
```

**Think of Stripe like a secure bank** - they handle all the sensitive payment information, and we just get a confirmation that the payment went through.

---

## Website Structure (Like a Building)

### The Homepage (Front Door)

```
┌─────────────────────────────────────┐
│         HOMEPAGE                    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Hero Section               │   │
│  │  (Big welcome banner)       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Service Times             │   │
│  │  Sunday: 10:00 AM         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Latest Sermon              │   │
│  │  [Video Player]             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Upcoming Events            │   │
│  │  [Event 1] [Event 2] ...   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Meet the Pastors            │   │
│  │  [Pastor 1] [Pastor 2]      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Our Ministries             │   │
│  │  [Ministry Grid]            │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Navigation (Like Hallways)

```
┌─────────────────────────────────────┐
│  Navigation Menu (Top of page)     │
│                                     │
│  [Home] [About] [Ministries]        │
│  [Events] [Sermons] [Visit] [Donate]│
│                                     │
│  Each link takes you to a          │
│  different "room" in the website     │
└─────────────────────────────────────┘
```

---

## How Pages Are Organized

Think of the website like a **book with chapters**:

```
Book: Church Website
│
├── Chapter 1: Homepage
│   └── Shows overview of everything
│
├── Chapter 2: About
│   ├── About the church
│   └── About the pastors
│
├── Chapter 3: Ministries
│   ├── List of all ministries
│   └── Details about each ministry
│
├── Chapter 4: Events
│   ├── Calendar of events
│   └── Details about each event
│
├── Chapter 5: Sermons
│   ├── List of all sermons
│   └── Watch/listen to sermons
│
├── Chapter 6: Give
│   └── Donation form
│
└── Chapter 7: Visit
    └── Service times and contact info
```

Each "chapter" is a **page**, and each page is a **file** in the `app/` folder.

---

## What Happens When You Click Something?

### Example: Clicking "Ministries"

```
You click "Ministries"
        │
        ▼
┌───────────────────────────────┐
│  Browser sends request:       │
│  "Show me the ministries page"│
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│  Server finds:                │
│  app/ministries/page.tsx       │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│  Server gets ministry data:    │
│  - Children's Ministry         │
│  - Youth Ministry              │
│  - Worship Ministry            │
│  - etc.                        │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│  Server creates the page:     │
│  - Layout with header/footer  │
│  - Ministry cards              │
│  - Images and descriptions    │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│  You see the ministries page!  │
└───────────────────────────────┘
```

This all happens in **less than a second**!

---

## Understanding Files and Folders

### The Main Folders

```
Church Website
│
├── 📁 app/
│   └── All the pages (like chapters in a book)
│
├── 📁 components/
│   └── Reusable pieces (like building blocks)
│
├── 📁 lib/
│   └── Data and utilities (like a library)
│
└── 📁 public/
    └── Images and files (like a photo album)
```

### Example: Where Is the Homepage?

```
app/
└── page.tsx  ← This is the homepage!
```

**Think of it like this**:
- `app/` = The main folder for pages
- `page.tsx` = The homepage file
- When someone visits `/`, they see `app/page.tsx`

### Example: Where Are the Ministries?

```
app/
└── ministries/
    ├── page.tsx        ← List of all ministries
    └── [slug]/
        └── page.tsx    ← Individual ministry page
```

**Think of it like this**:
- `ministries/` = Folder for ministry pages
- `page.tsx` = The list page
- `[slug]/page.tsx` = Individual ministry pages (like `/ministries/youth-ministry`)

---

## Making Changes: Simple Guide

### If You Want to Change Text

**Example**: Change pastor's bio

```
1. Find the file: lib/cms/client.ts
   │
   ▼
2. Look for: mockPastors
   │
   ▼
3. Find the pastor you want to change
   │
   ▼
4. Change the "bio" text:
   
   bio: "Old text here"
        ↓
   bio: "New text here"
   │
   ▼
5. Save the file
   │
   ▼
6. Website updates (after redeployment)
```

### If You Want to Add an Event

```
1. Find the file: lib/cms/client.ts
   │
   ▼
2. Look for: getEvents() method
   │
   ▼
3. Find the mockEvents array
   │
   ▼
4. Add a new event object:
   {
     id: "12",
     slug: "easter-service",
     title: "Easter Service",
     date: new Date("2025-04-20"),
     time: "10:00 AM",
     location: "Main Sanctuary",
     description: "Join us for Easter celebration",
     image: { url: "/images/easter.webp", alt: "Easter" }
   }
   │
   ▼
5. Save the file
   │
   ▼
6. Event appears on website
```

---

## Common Questions

### Q: Where does the data come from?

**A**: Right now, it's stored in code files (mock data). In the future, it can come from a CMS (Content Management System) where staff can update it through a web interface.

### Q: How do I update the service times?

**A**: Edit the file `lib/utils/serviceTimes.ts` and change the times listed there.

### Q: How do I change the church logo?

**A**: 
1. Replace the image file in `public/images/`
2. Update the reference in `components/layout/Header.tsx`

### Q: How do donations get to the church?

**A**: Stripe processes the payment and transfers the money to the church's bank account (set up in Stripe dashboard).

### Q: Can I update content without a developer?

**A**: Currently, no - you need to edit code files. But we can set up a CMS so you can update content through a simple web interface (like editing a Word document).

### Q: How fast does the website load?

**A**: Very fast! Next.js optimizes everything. Most pages load in under 2 seconds.

### Q: Will the website work on phones?

**A**: Yes! The website is **responsive**, meaning it automatically adjusts to work perfectly on phones, tablets, and computers.

---

## Visual Summary

```
┌─────────────────────────────────────────────┐
│           THE BIG PICTURE                   │
│                                             │
│  People visit website                       │
│           │                                 │
│           ▼                                 │
│  Website shows information                  │
│  (from code files or CMS)                   │
│           │                                 │
│           ▼                                 │
│  People can:                                │
│  • Read about church                        │
│  • See events                               │
│  • Watch sermons                            │
│  • Make donations                           │
│  • Contact church                           │
│                                             │
│  All secure, fast, and easy to use!         │
└─────────────────────────────────────────────┘
```

---

**Remember**: 
- The website is like a **digital church building**
- Pages are like **rooms** in that building
- Content is stored in **files** (currently) or a **CMS** (future)
- Everything is designed to be **fast, secure, and easy to use**

---

**For more technical details**, see:
- [`documentation.md`](./documentation.md) - Complete technical documentation
- [`quick-reference.md`](./quick-reference.md) - Quick lookup guide
- [`architecture.md`](./architecture.md) - System architecture details

---

**Last Updated**: January 2025
