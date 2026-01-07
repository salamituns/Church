# Responsive Design Testing Guide

## Overview
This document outlines comprehensive testing procedures for the church website across mobile, tablet, and laptop/desktop viewports.

## Test Viewports

### Mobile Devices
- **Small Mobile**: 320px - 375px (iPhone SE, small Android)
- **Standard Mobile**: 375px - 414px (iPhone 12/13/14, most Android phones)
- **Large Mobile**: 414px - 480px (iPhone Pro Max, large Android)

### Tablets
- **Small Tablet**: 768px - 834px (iPad Mini, small tablets)
- **Standard Tablet**: 834px - 1024px (iPad, standard tablets)
- **Large Tablet**: 1024px - 1280px (iPad Pro, large tablets)

### Laptops/Desktops
- **Small Laptop**: 1280px - 1440px (13" laptops)
- **Standard Desktop**: 1440px - 1920px (15" laptops, standard monitors)
- **Large Desktop**: 1920px+ (large monitors, 4K displays)

---

## Component Testing Checklist

### 1. Header & Navigation ✅

#### Mobile (< 768px)
- [ ] Logo displays correctly and is readable
- [ ] Hamburger menu button is visible and tappable (min 44x44px)
- [ ] Mobile menu opens/closes smoothly
- [ ] Navigation links are stacked vertically in mobile menu
- [ ] Donate button is full-width in mobile menu
- [ ] Menu closes when clicking outside or selecting a link
- [ ] Header is sticky and doesn't cover content
- [ ] Text doesn't overflow or get cut off

#### Tablet (768px - 1024px)
- [ ] Full navigation menu is visible
- [ ] Dropdown menus work on hover/click
- [ ] All navigation items are accessible
- [ ] Spacing is appropriate

#### Desktop (> 1024px)
- [ ] Full navigation with dropdowns works
- [ ] Hover states work correctly
- [ ] All items are properly spaced
- [ ] Logo and navigation align correctly

**Test Cases:**
```
✓ Header height: 56px (mobile), 64px (desktop)
✓ Menu button: 44x44px minimum touch target
✓ Navigation links: Proper spacing, no text overflow
✓ Dropdown: Opens/closes smoothly, accessible
```

---

### 2. Hero Section ✅

#### Mobile
- [ ] Background image loads and displays correctly
- [ ] Text is readable (not too small, good contrast)
- [ ] Heading "Welcome Home" fits on screen
- [ ] Subheading fits without wrapping awkwardly
- [ ] Countdown timer is visible and readable
- [ ] "Plan Your Visit" button is tappable (min 44x44px)
- [ ] Button text doesn't wrap
- [ ] Content doesn't overflow viewport
- [ ] Hero section is full viewport height

#### Tablet
- [ ] Text sizes scale appropriately
- [ ] Countdown timer positioned correctly
- [ ] Button sizes are appropriate
- [ ] Layout maintains visual hierarchy

#### Desktop
- [ ] Full-width background image displays
- [ ] Text is properly sized and centered
- [ ] Countdown in top-right corner
- [ ] All animations work smoothly

**Test Cases:**
```
✓ Heading: 24px (mobile) → 48px (desktop)
✓ Subheading: 16px (mobile) → 24px (desktop)
✓ Button: Minimum 44px height, full-width on mobile
✓ Countdown: Responsive width, readable text
```

---

### 3. Service Schedule Section ✅

#### Mobile
- [ ] Section title is readable
- [ ] Service cards stack vertically
- [ ] Cards have proper padding (not cramped)
- [ ] Text in cards doesn't wrap awkwardly
- [ ] Day and time stay on one line
- [ ] Icons are visible and properly sized
- [ ] Cards are tappable (entire card is clickable)
- [ ] Background image displays correctly

#### Tablet
- [ ] Cards display in 2 columns (if applicable)
- [ ] Text sizes are appropriate
- [ ] Spacing between cards is good

#### Desktop
- [ ] Cards display in 3 columns
- [ ] Hover effects work
- [ ] All content is readable

**Test Cases:**
```
✓ Card padding: 16px (mobile) → 24px (desktop)
✓ Text: 14px minimum, no awkward wrapping
✓ Day/Time: Stays on one line with whitespace-nowrap
✓ Touch target: Entire card is tappable
```

---

### 4. Service Countdown Timer ✅

#### Mobile
- [ ] Timer is visible and readable
- [ ] Numbers update smoothly
- [ ] Text doesn't overflow
- [ ] Card width adapts to screen
- [ ] Positioned correctly (top center on mobile)

#### Tablet/Desktop
- [ ] Positioned in top-right (desktop)
- [ ] All numbers are visible
- [ ] Updates every second correctly

**Test Cases:**
```
✓ Width: Full width on mobile (max 280px), fixed 256px on desktop
✓ Text: 10px minimum, readable
✓ Numbers: 14px (mobile) → 18px (desktop)
✓ Updates: Every 1 second, smooth transitions
```

---

### 5. Latest Sermon Section ✅

#### Mobile
- [ ] Sermon image displays (full width)
- [ ] Image height is appropriate (not too tall)
- [ ] Title is readable and doesn't overflow
- [ ] Description text is readable
- [ ] Buttons stack vertically
- [ ] Buttons are tappable (min 44px height)
- [ ] Play button icon is visible
- [ ] Date and speaker info is readable

#### Tablet
- [ ] Image and content side-by-side
- [ ] Text sizes are appropriate
- [ ] Buttons can be side-by-side

#### Desktop
- [ ] Full layout with image and content
- [ ] Hover effects work
- [ ] All information is visible

**Test Cases:**
```
✓ Image height: 192px (mobile) → 256px (desktop)
✓ Padding: 20px (mobile) → 32px (desktop)
✓ Button height: 44px minimum
✓ Text: 14px minimum, proper line-height
```

---

### 6. Featured Events Carousel ✅

#### Mobile
- [ ] Carousel height is appropriate (not too tall)
- [ ] Navigation buttons are tappable (min 44x44px)
- [ ] Buttons are positioned correctly (not too close to edges)
- [ ] Event title is readable
- [ ] Event description is readable (may truncate)
- [ ] Date, time, location info is visible
- [ ] "Learn More" button is tappable
- [ ] Dot indicators are visible and tappable
- [ ] Swipe gestures work (if implemented)
- [ ] Auto-rotation works

#### Tablet
- [ ] Carousel height scales appropriately
- [ ] All text is readable
- [ ] Navigation works smoothly

#### Desktop
- [ ] Full-height carousel
- [ ] Hover effects on buttons
- [ ] Smooth transitions between slides

**Test Cases:**
```
✓ Carousel height: 400px (mobile) → 600px (desktop)
✓ Button size: 44x44px minimum touch target
✓ Text: 12px minimum, proper contrast
✓ Auto-rotate: Every 5 seconds
✓ Transitions: 0.5s smooth animation
```

---

### 7. Ministry Grid ✅

#### Mobile
- [ ] Cards stack vertically (1 column)
- [ ] Images display correctly
- [ ] Card titles are readable
- [ ] Descriptions are readable
- [ ] Cards have proper spacing
- [ ] Entire card is tappable
- [ ] "View All Ministries" link is visible

#### Tablet
- [ ] Cards display in 2 columns
- [ ] Images maintain aspect ratio
- [ ] Spacing is appropriate

#### Desktop
- [ ] Cards display in 3 columns
- [ ] Hover effects work
- [ ] Images zoom on hover

**Test Cases:**
```
✓ Card image height: 160px (mobile) → 192px (desktop)
✓ Grid gap: 16px (mobile) → 24px (desktop)
✓ Touch target: Entire card is tappable
✓ Text: 14px minimum, proper line-height
```

---

### 8. Pastor Cards ✅

#### Mobile
- [ ] Cards stack vertically
- [ ] Images display correctly
- [ ] Names and titles are readable
- [ ] Bio text is readable (if present)
- [ ] Cards have proper spacing

#### Tablet/Desktop
- [ ] Cards display in 2 columns
- [ ] Hover effects work
- [ ] Images maintain aspect ratio

**Test Cases:**
```
✓ Image height: 256px consistent
✓ Padding: 24px (mobile) → 32px (desktop)
✓ Text: 14px minimum
```

---

### 9. Testimonials Section ✅

#### Mobile
- [ ] Cards stack vertically
- [ ] Quote text is readable
- [ ] Author names are visible
- [ ] Cards have proper spacing

#### Tablet/Desktop
- [ ] Cards display in 2-3 columns
- [ ] Text is readable
- [ ] Spacing is appropriate

**Test Cases:**
```
✓ Card padding: 24px minimum
✓ Text: 14px minimum
✓ Grid: 1 col (mobile) → 3 cols (desktop)
```

---

### 10. Footer ✅

#### Mobile
- [ ] Footer stacks vertically
- [ ] All links are tappable
- [ ] Social media icons are tappable (min 44x44px)
- [ ] Copyright text is visible
- [ ] Footer doesn't overflow

#### Tablet/Desktop
- [ ] Footer displays in 4 columns
- [ ] All sections are visible
- [ ] Links are properly spaced

**Test Cases:**
```
✓ Link spacing: 8px minimum between links
✓ Icon size: 20px (44x44px touch target)
✓ Padding: 32px (mobile) → 48px (desktop)
```

---

## Cross-Device Testing

### Touch Targets
- [ ] All interactive elements are at least 44x44px
- [ ] Buttons have adequate spacing (8px minimum)
- [ ] Links are easily tappable
- [ ] No overlapping touch targets

### Text Readability
- [ ] Minimum font size: 14px (12px for labels only)
- [ ] Line height: 1.5 minimum
- [ ] Contrast ratio: 4.5:1 for normal text, 3:1 for large text
- [ ] No text overflow or awkward wrapping
- [ ] Text doesn't get cut off

### Images
- [ ] All images load correctly
- [ ] Images maintain aspect ratio
- [ ] Images are optimized (not too large)
- [ ] Alt text is provided for all images

### Spacing
- [ ] Consistent padding/margins across breakpoints
- [ ] No cramped content
- [ ] Adequate whitespace
- [ ] Content doesn't touch screen edges (4px minimum padding)

### Performance
- [ ] Page loads in < 3 seconds on 3G
- [ ] Images lazy load correctly
- [ ] Animations are smooth (60fps)
- [ ] No layout shift (CLS < 0.1)

---

## Browser Testing

### Mobile Browsers
- [ ] Safari (iOS)
- [ ] Chrome (Android)
- [ ] Firefox (Android)
- [ ] Samsung Internet

### Tablet Browsers
- [ ] Safari (iPad)
- [ ] Chrome (Android tablets)

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Accessibility Testing

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Skip links work (if implemented)

### Screen Readers
- [ ] All images have alt text
- [ ] Headings are properly structured (h1 → h2 → h3)
- [ ] ARIA labels are used where needed
- [ ] Form labels are associated correctly

### Color Contrast
- [ ] Text meets WCAG AA standards (4.5:1)
- [ ] Large text meets WCAG AA standards (3:1)
- [ ] Interactive elements have sufficient contrast

---

## Common Issues to Check

### Mobile-Specific
- [ ] Viewport meta tag is correct
- [ ] No horizontal scrolling
- [ ] Text doesn't require zooming to read
- [ ] Forms are mobile-friendly
- [ ] Phone numbers are tappable (tel: links)

### Tablet-Specific
- [ ] Layout adapts to tablet sizes
- [ ] Touch targets are appropriate
- [ ] Landscape and portrait orientations work

### Desktop-Specific
- [ ] Hover states work correctly
- [ ] Mouse interactions are smooth
- [ ] Large screens don't have excessive whitespace

---

## Testing Tools

### Browser DevTools
- Chrome DevTools (Device Toolbar)
- Firefox Responsive Design Mode
- Safari Web Inspector

### Online Tools
- [BrowserStack](https://www.browserstack.com/)
- [Responsive Design Checker](https://responsivedesignchecker.com/)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Manual Testing
- Test on actual devices when possible
- Test in different lighting conditions
- Test with different network speeds

---

## Test Results Template

```
Date: [Date]
Tester: [Name]
Device: [Device/Viewport]
Browser: [Browser/Version]

Component: [Component Name]
Viewport: [Size]
Status: ✅ Pass / ❌ Fail / ⚠️ Needs Improvement

Issues Found:
- [Issue description]

Screenshots:
[Attach screenshots if issues found]
```

---

## Quick Test Checklist

### Critical (Must Pass)
- [ ] No horizontal scrolling on any device
- [ ] All text is readable (14px minimum)
- [ ] All buttons/links are tappable (44x44px minimum)
- [ ] Navigation works on all devices
- [ ] Images load and display correctly
- [ ] Forms are usable on mobile
- [ ] No content overflow

### Important (Should Pass)
- [ ] Smooth animations
- [ ] Proper spacing
- [ ] Consistent design
- [ ] Fast load times
- [ ] Good contrast ratios

### Nice to Have
- [ ] Advanced animations
- [ ] Perfect alignment
- [ ] Pixel-perfect design

---

## Reporting Issues

When reporting responsive design issues, include:
1. **Device/Viewport**: Exact dimensions
2. **Browser**: Name and version
3. **Component**: Which section has the issue
4. **Description**: What's wrong
5. **Expected**: What should happen
6. **Screenshot**: Visual evidence
7. **Steps to Reproduce**: How to see the issue

---

## Maintenance

- Test after every major update
- Test new components before merging
- Keep this document updated
- Document any new breakpoints
- Update test cases as needed


