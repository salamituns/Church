# Enhancement Implementation Plan

## Overview
This plan outlines the implementation of enhancements inspired by RCCG HGM, Hoop.de, and Lakewood Church websites, excluding multi-campus support.

## Enhancements to Implement

### 1. Ministry Categorization System
**Goal**: Organize ministries into clear categories (Age Groups, Service Ministries, Community Groups)

**Changes Required**:
- Update `lib/cms/types.ts` - Add `category` field to Ministry interface
- Update `lib/cms/data/ministries.json` - Add category to ministries
- Create `components/sections/MinistryCategories.tsx` - Category filter/tabs component
- Update `app/ministries/page.tsx` - Add category filtering
- Update `components/sections/MinistryGrid.tsx` - Support category grouping

**Categories**:
- Age Groups: Children, Youth, Young Adults, Adults, Seniors
- Service Ministries: Worship, Prayer, Evangelism, Media, Hospitality
- Community Groups: Small Groups, Bible Study, Fellowship

---

### 2. Service Countdown Timer Component
**Goal**: Display live countdown to next service on homepage

**Changes Required**:
- Create `components/sections/ServiceCountdown.tsx` - Client component with countdown logic
- Update `components/sections/HeroSection.tsx` - Integrate countdown
- Create `lib/utils/serviceTimes.ts` - Service time configuration and next service calculation
- Add service times configuration with recurring schedules

**Features**:
- Real-time countdown (days, hours, minutes, seconds)
- Auto-updates every second
- Shows next service name and time
- Handles special services (Thanksgiving Sunday, Anointing Service, etc.)

---

### 3. Featured Events Carousel
**Goal**: Rotating featured events with large image-based cards

**Changes Required**:
- Create `components/sections/FeaturedEventsCarousel.tsx` - Carousel component
- Update `lib/cms/types.ts` - Add `featured` boolean to Event interface
- Update `app/page.tsx` - Add featured events section after hero
- Install carousel library or build custom with framer-motion
- Add navigation dots and arrows

**Features**:
- Auto-rotating carousel (optional)
- Large, image-based cards
- Click to view event details
- Responsive design
- Smooth transitions

---

### 4. Latest Sermon Section
**Goal**: Prominent homepage section with quick access to latest sermon

**Changes Required**:
- Create `components/sections/LatestSermon.tsx` - Featured sermon component
- Update `app/page.tsx` - Add latest sermon section (after hero, before pastors)
- Update `lib/cms/queries.ts` - Add `getLatestSermon()` function
- Add prominent CTA buttons (Watch/Listen)

**Features**:
- Large sermon thumbnail/image
- Title, speaker, date
- Quick play buttons (Watch Video / Listen to Audio)
- Link to full sermon page
- Series indicator if part of a series

---

### 5. Enhanced Navigation with Dropdowns
**Goal**: Dropdown menus for ministries with clear hierarchy

**Changes Required**:
- Create `components/layout/NavigationDropdown.tsx` - Dropdown menu component
- Update `components/layout/Navigation.tsx` - Add dropdown for Ministries
- Update `components/layout/Header.tsx` - Support dropdown in mobile menu
- Add Radix UI Dropdown Menu component
- Organize ministries by category in dropdown

**Structure**:
```
Ministries (dropdown)
  ├─ Age Groups
  │   ├─ Children's Ministry
  │   ├─ Youth Ministry
  │   └─ Young Adults
  ├─ Service Ministries
  │   ├─ Worship
  │   ├─ Prayer
  │   └─ Evangelism
  └─ View All Ministries
```

---

## Implementation Order

1. **Service Countdown Timer** (Foundation)
   - Simple, isolated component
   - No dependencies on other changes
   - High visual impact

2. **Latest Sermon Section** (Content Focus)
   - Quick win for homepage
   - Enhances content discoverability
   - Minimal dependencies

3. **Featured Events Carousel** (Engagement)
   - Builds on event system
   - High visual impact
   - Requires carousel component

4. **Ministry Categorization** (Organization)
   - Requires data structure changes
   - Affects multiple pages
   - Foundation for navigation

5. **Enhanced Navigation** (User Experience)
   - Depends on ministry categorization
   - Final polish
   - Improves navigation UX

---

## File Structure Changes

### New Files
```
components/
  ├─ sections/
  │   ├─ ServiceCountdown.tsx          # NEW
  │   ├─ LatestSermon.tsx               # NEW
  │   ├─ FeaturedEventsCarousel.tsx     # NEW
  │   └─ MinistryCategories.tsx         # NEW
  └─ layout/
      └─ NavigationDropdown.tsx        # NEW

lib/
  └─ utils/
      └─ serviceTimes.ts                # NEW
```

### Modified Files
```
lib/cms/types.ts                       # Add category, featured fields
lib/cms/data/ministries.json           # Update ministry data
lib/cms/queries.ts                     # Add getLatestSermon()
components/sections/HeroSection.tsx    # Add countdown
components/sections/MinistryGrid.tsx   # Add category support
components/layout/Navigation.tsx        # Add dropdown
components/layout/Header.tsx           # Support dropdown
app/page.tsx                           # Add new sections
app/ministries/page.tsx                # Add category filtering
```

---

## Technical Details

### Service Countdown Implementation
- Use `useState` and `useEffect` for countdown
- Calculate next service from service times config
- Handle timezone considerations
- Format: "X days, X hours, X mins, X secs"

### Featured Events Carousel
- Use `framer-motion` for animations (already in dependencies)
- Auto-advance every 5 seconds (optional)
- Touch/swipe support for mobile
- Keyboard navigation (arrow keys)

### Ministry Categories
- Filter by category on ministries page
- Category tabs or sidebar filter
- "All" option to show everything
- URL query params for deep linking: `/ministries?category=age-groups`

### Navigation Dropdown
- Use Radix UI Dropdown Menu (already have @radix-ui/react-dropdown-menu)
- Hover to open (desktop)
- Click to open (mobile)
- Smooth animations
- Accessible keyboard navigation

---

## Design Considerations

### Service Countdown
- Large, bold numbers
- Primary color accent
- Prominent placement in hero section
- Mobile-responsive font sizes

### Latest Sermon
- Large featured card (full width or 2/3 width)
- Prominent play buttons
- Series badge if applicable
- Clean, modern design

### Featured Events Carousel
- Full-width or container-width
- Large images (16:9 aspect ratio)
- Overlay text for readability
- Navigation controls visible

### Ministry Categories
- Tab interface or sidebar
- Clear visual distinction between categories
- Smooth transitions when filtering
- Show count per category

### Navigation Dropdown
- Clean, modern dropdown design
- Clear hierarchy with icons or indentation
- Hover states
- Mobile-friendly touch targets

---

## Testing Checklist

- [ ] Service countdown updates correctly
- [ ] Countdown handles timezone changes
- [ ] Latest sermon displays most recent
- [ ] Featured events carousel rotates smoothly
- [ ] Carousel works on mobile (touch/swipe)
- [ ] Ministry categories filter correctly
- [ ] Navigation dropdown opens/closes properly
- [ ] Dropdown works on mobile
- [ ] All links navigate correctly
- [ ] Responsive design on all screen sizes
- [ ] Accessibility (keyboard navigation, screen readers)

---

## Success Metrics

- Improved homepage engagement
- Better ministry discoverability
- Increased sermon views
- Better event visibility
- Enhanced navigation UX

---

## Timeline Estimate

- Service Countdown: 1-2 hours
- Latest Sermon: 1-2 hours
- Featured Events Carousel: 2-3 hours
- Ministry Categorization: 2-3 hours
- Enhanced Navigation: 2-3 hours

**Total: 8-13 hours**

