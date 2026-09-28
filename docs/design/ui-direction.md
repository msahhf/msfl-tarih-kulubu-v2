# UI Direction

## Overview

Bu doküman, MSFL Tarih Kulübü Next.js rewrite'ının görsel yönünü tanımlar. Modern digital archive / editorial history platform estetiği için rehberlik eder.

## Design Concept

**"Modern Digital Archive / Editorial History Platform"**

Hedef, geleneksel bir okul web sitesinden ziyade, çağdaş bir dijital beşeri bilimler / müze yayın platformu hissiyatı yaratmaktır.

## Visual Language

### Core Principles

1. **Editorial Typography First**
   - Strong serif typography for content
   - Clear hierarchy between headings and body
   - Generous line height for readability
   - Editorial-inspired layouts

2. **Asymmetric Composition**
   - Avoid perfectly centered layouts
   - Use grid-based asymmetric layouts
   - Create visual interest through placement
   - Break grids intentionally for emphasis

3. **Restrained Color Palette**
   - Historical/academic color tones
   - Avoid bright, saturated colors
   - Use color for emphasis, not decoration
   - Neutral backgrounds with subtle accents

4. **Excellent Image Treatment**
   - High-quality image presentation
   - Consistent aspect ratios
   - Subtle shadows and borders
   - Editorial image captions

5. **Clear Information Hierarchy**
   - Obvious visual priorities
   - Consistent spacing relationships
   - Logical content flow
   - Scannable layouts

## What to Avoid (Anti-Patterns)

### ❌ Legacy Site Elements to Avoid

1. **Full-Screen Background Sections**
   - Avoid: Hero sections with full-screen background images
   - Instead: Use clean, focused hero with typography

2. **Red/Gray Card Language**
   - Avoid: Red and gray card system from legacy
   - Instead: Subtle borders, editorial card treatments

3. **Current Navbar/Footer Composition**
   - Avoid: Reproduce current navbar/footer layout
   - Instead: Modern, clean navigation with better spacing

4. **Existing CSS Files**
   - Avoid: Port existing CSS files or class names
   - Instead: Start fresh with Tailwind CSS

5. **Alternating Timeline Pattern**
   - Avoid: Recreate current timeline as central pattern
   - Instead: Use editorial grid layouts

6. **Inline Styles**
   - Avoid: Inline style attributes
   - Instead: Use Tailwind utility classes

7. **Generic School Template**
   - Avoid: Standard school website patterns
   - Instead: Editorial/museum publication aesthetic

## Visual Identity

### Typography Hierarchy

**Primary Display**: Georgia serif, large sizes, editorial feel
**Secondary Display**: Inter sans-serif, UI elements
**Body Content**: Georgia serif, excellent readability
**Metadata/Labels**: Inter sans-serif, uppercase, tracked-out

### Color Direction

**Primary**: Historical tones (warm grays, muted earth tones)
**Accent**: Subtle highlights (muted gold/bronze tones)
**Neutral**: Clean grays for backgrounds and borders
**Avoid**: Bright reds, neons, overly saturated colors

### Layout Direction

**Editorial Grid**: Asymmetric 12-column grid
**Generous Spacing**: More whitespace than typical sites
**Content-First**: Typography drives layout, not decorative elements
**Responsive**: Mobile-first, intentional tablet/desktop experiences

## Page-Level Direction

### Home Page

**Concept**: Editorial magazine cover feel

**Layout**:
- Large serif headline with powerful quote
- Asymmetric placement of historical imagery
- Editorial grid for featured content
- Subtle motion on scroll (optional)
- Clean navigation, minimal distractions

**Avoid**:
- Full-screen background hero
- Overwhelming carousel
- Busy, cluttered layout
- Excessive animations

### Blog List Page

**Concept**: Digital archive/catalog view

**Layout**:
- Clean grid of blog cards
- Editorial card treatments (borders, shadows)
- Consistent image aspect ratios
- Clear typography hierarchy
- Pagination with editorial styling

**Avoid**:
- Masonry layouts (too casual)
- Overly decorative cards
- Inconsistent card sizes
- Busy hover effects

### Blog Detail Page

**Concept**: Journal article reading experience

**Layout**:
- Single-column reading focus
- Maximum readability (line height, font size)
- Editorial image treatments with captions
- Subtle author byline
- Clean comment section

**Avoid**:
- Multi-column reading layouts
- Distracting sidebars
- Overly decorative elements
- Poor image treatments

### About Page

**Concept**: Museum exhibition panel

**Layout**:
- Editorial storytelling layout
- Historical imagery with captions
- Timeline visualization (not alternating)
- Team section with editorial cards
- Clean typography hierarchy

**Avoid**:
- Alternating timeline pattern
- Generic team grid
- Boring text blocks
- Overly decorative elements

### Events Page

**Concept**: Calendar/museum schedule

**Layout**:
- Calendar-inspired layout
- Editorial event cards
- Date-focused typography
- Clear visual hierarchy
- Subtle hover states

**Avoid**:
- Generic calendar widgets
- Boring list layouts
- Overly decorative event cards
- Confusing date displays

### Admin Panel

**Concept**: Clean dashboard, functional focus

**Layout**:
- Sidebar navigation (or top nav)
- Clean data tables
- Editorial card treatments
- Clear action buttons
- Consistent spacing

**Avoid**:
- Overly decorative admin interface
- Confusing navigation
- Poor data visualization
- Inconsistent styling

## Component Direction

### Navigation

**Primary Nav**:
- Clean, minimal design
- Editorial typography
- Subtle hover states
- Mobile: Hamburger with smooth animation

**Secondary Nav**:
- Breadcrumb-style
- Subtle color treatment
- Clear hierarchy

### Cards

**Blog Cards**:
- Editorial border treatment
- Subtle shadows
- Consistent image aspect ratio
- Strong typography
- Minimal hover effects

**Profile Cards**:
- Circular avatars
- Clean typography
- Subtle social links
- Editorial spacing

### Buttons

**Primary Buttons**:
- Solid color, subtle shadows
- Editorial typography
- Smooth hover transitions
- Clear focus states

**Secondary Buttons**:
- Border treatment
- Subtle background on hover
- Editorial typography

### Forms

**Input Fields**:
- Clean borders
- Generous padding
- Clear focus states
- Editorial typography

**Form Layouts**:
- Single-column focus
- Clear labels
- Generous spacing
- Subtle error states

## Interactive Elements

### Hover States

**Principles**:
- Subtle color changes
- Slight elevation (shadow)
- Smooth transitions (150-300ms)
- No jarring movements

**Examples**:
- Card hover: Slight shadow increase
- Button hover: Color shift + slight lift
- Link hover: Underline animation
- Image hover: Subtle zoom (optional)

### Loading States

**Approach**:
- Skeleton screens for content
- Subtle loading animations
- Clear feedback
- Editorial treatment

### Empty States

**Design**:
- Editorial typography
- Subtle illustrations (optional)
- Clear call-to-action
- Consistent spacing

## Image Direction

### Image Treatment

**Principles**:
- High-quality presentation
- Consistent aspect ratios
- Subtle borders/shadows
- Editorial captions
- Alt text for accessibility

**Aspect Ratios**:
- Blog images: 16:9 or 4:3
- Profile avatars: 1:1 (circular)
- Hero images: 21:9 or 16:9
- Gallery images: Consistent ratio

### Image Loading

**Approach**:
- Blur-up loading
- Progressive enhancement
- Lazy loading for below-fold
- Fallback colors

## Motion Direction

### Animation Principles

**Guidelines**:
- Subtle, not distracting
- Editorial feel (smooth, refined)
- Respect reduced-motion preferences
- Support accessibility

**Transitions**:
- Page transitions: 300-500ms
- Hover states: 150-300ms
- Modal open/close: 300ms
- Loading animations: Subtle pulse

### Scroll Effects

**Approach**:
- Subtle parallax (optional)
- Fade-in on scroll
- Smooth scroll behavior
- Performance-conscious

## Accessibility Direction

### Visual Accessibility

**Requirements**:
- WCAG AA color contrast (4.5:1)
- Visible focus states
- Large tap targets (44px minimum)
- Clear visual hierarchy

**Implementation**:
- Focus rings on all interactive elements
- High contrast ratios
- Scalable typography
- Semantic HTML

### Motion Accessibility

**Requirements**:
- Respect `prefers-reduced-motion`
- Provide alternative for animations
- No auto-playing videos
- Control over motion

## Responsive Direction

### Mobile First

**Approach**:
- Design for mobile first
- Progressive enhancement
- Touch-friendly interactions
- Simplified layouts on small screens

### Tablet Experience

**Considerations**:
- Take advantage of additional space
- More content visible
- Balanced layouts
- Touch interactions still primary

### Desktop Experience

**Enhancements**:
- Full editorial layouts
- Hover interactions
- More content density
- Keyboard navigation support

## Content Direction

### Editorial Content

**Approach**:
- Content-first design
- Typography-driven layouts
- Subtle imagery support
- Clear information hierarchy

### Metadata Display

**Treatment**:
- Uppercase, tracked-out labels
- Subtle color treatment
- Consistent placement
- Clear separation from content

### Dates and Time

**Format**:
- Editorial date formats
- Consistent throughout
- Turkish locale support
- Clear, readable display

## Brand Elements

### Logo Usage

**Guidelines**:
- Clear, prominent placement
- Consistent sizing
- Subtle animations (optional)
- Alt text for accessibility

### Color Branding

**Approach**:
- Subtle brand colors
- Used for emphasis only
- Not overwhelming
- Consistent application

## Performance Direction

### Visual Performance

**Priorities**:
- Fast image loading
- Minimal animation overhead
- Efficient CSS
- Optimal font loading

### Implementation**:
- next/image for images
- CSS-in-JS (Tailwind)
- Font optimization
- Critical CSS inline

## Anti-Patterns Summary

### ❌ Definitely Avoid

1. **Full-screen background sections** with text overlays
2. **Red/gray card system** from legacy site
3. **Current navbar/footer** composition
4. **Existing CSS files** and class names
5. **Alternating timeline** as central pattern
6. **Inline styles** for layout
7. **Generic school template** aesthetics
8. **Bright, saturated colors**
9. **Overly decorative elements**
10. **Excessive animations**

### ✅ Definitely Do

1. **Editorial typography** with serif fonts
2. **Asymmetric layouts** for visual interest
3. **Generous whitespace** and spacing
4. **High-quality image treatments**
5. **Subtle, refined animations**
6. **Clean, minimal navigation**
7. **Content-first design**
8. **Accessibility-first approach**
9. **Mobile-first responsive design**
10. **Performance-conscious implementation**

## Inspiration References

### Editorial Design
- New York Times website
- The Guardian
- Medium editorial layouts
- Museum websites (MoMA, Tate)

### Digital Archives
- Digital Public Library of America
- Europeana
- Library of Congress digital collections

### Academic Platforms
- JSTOR
- Project MUSE
- Academic journal websites

## Implementation Guidelines

### Component Library

**Approach**:
- Build reusable component library
- Document component variations
- Provide usage examples
- Maintain consistency

### Design Tokens

**Implementation**:
- Centralized design tokens
- Tailwind CSS configuration
- Custom properties for theming
- Consistent naming conventions

### Quality Assurance

**Checklist**:
- [ ] Typography hierarchy consistent
- [ ] Color palette applied correctly
- [ ] Spacing system followed
- [ ] Accessibility standards met
- [ ] Responsive design tested
- [ ] Performance optimized
- [ ] Cross-browser tested
- [ ] Motion preferences respected

## Conclusion

The UI direction prioritizes:

1. **Editorial Aesthetic**: Museum publication feel over school template
2. **Content-First**: Typography and content drive design
3. **Subtle Sophistication**: Refined, not flashy
4. **Accessibility**: WCAG AA compliance
5. **Performance**: Fast, efficient implementation
6. **Consistency**: Cohesive visual language
7. **Modern Appeal**: Contemporary digital archive feel

The goal is to create a platform that feels like a curated digital history experience, not a typical school website. Every design decision should support this editorial, academic, yet modern aesthetic.
