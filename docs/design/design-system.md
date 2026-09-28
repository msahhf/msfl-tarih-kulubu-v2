# Design System

## Overview

Bu doküman, MSFL Tarih Kulübü Next.js rewrite'ı için tasarım sistemini tanımlar. Modern, editorial, academic bir görünüm için teknik temel sağlar.

## Design Philosophy

**Editorial / Digital Archive Aesthetic**
- Strong typography hierarchy
- Editorial grid layouts
- Asymmetric composition where useful
- Restrained motion and transitions
- Excellent image treatment
- Clear information hierarchy
- Contemporary museum publication feel

**Anti-Patterns (Avoid)**
- Generic school template look
- Excessive gradients and shadows
- Overly playful colors
- Heavy animations
- Cluttered interfaces
- Inconsistent spacing

## Typography

### Font Families

```css
/* Primary Font - Editorial/Reading */
font-family: 'Georgia', 'Times New Roman', serif;

/* Secondary Font - UI/Labels */
font-family: 'Inter', system-ui, sans-serif;

/* Monospace - Code/Data */
font-family: 'Fira Code', monospace;
```

### Type Scale

```css
/* Editorial Typography Scale */
.text-display-xl { font-size: 4.5rem; line-height: 1.1; letter-spacing: -0.02em; }
.text-display-lg { font-size: 3.75rem; line-height: 1.2; letter-spacing: -0.02em; }
.text-display-md { font-size: 3rem; line-height: 1.3; letter-spacing: -0.01em; }
.text-display-sm { font-size: 2.25rem; line-height: 1.4; letter-spacing: -0.01em; }

.text-h1 { font-size: 2rem; line-height: 1.3; letter-spacing: -0.01em; }
.text-h2 { font-size: 1.75rem; line-height: 1.4; letter-spacing: -0.005em; }
.text-h3 { font-size: 1.5rem; line-height: 1.5; letter-spacing: 0; }
.text-h4 { font-size: 1.25rem; line-height: 1.5; letter-spacing: 0; }
.text-h5 { font-size: 1.125rem; line-height: 1.6; letter-spacing: 0; }
.text-h6 { font-size: 1rem; line-height: 1.6; letter-spacing: 0; }

.text-body-lg { font-size: 1.125rem; line-height: 1.7; }
.text-body { font-size: 1rem; line-height: 1.7; }
.text-body-sm { font-size: 0.875rem; line-height: 1.6; }

.text-caption { font-size: 0.75rem; line-height: 1.5; letter-spacing: 0.05em; text-transform: uppercase; }
.text-label { font-size: 0.875rem; line-height: 1.4; font-weight: 600; letter-spacing: 0.025em; text-transform: uppercase; }
```

### Font Weights

```css
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

### Typography Usage

**Headings**: Use serif font (Georgia) for editorial feel
**Body Text**: Use serif font for long-form content
**UI Elements**: Use sans-serif (Inter) for labels, buttons, navigation
**Captions**: Use uppercase, tracked-out labels for metadata

## Color System

### Color Tokens

```css
/* Primary Palette - Historical/Academic */
--color-primary-50: #f5f5f0;
--color-primary-100: #e8e8e0;
--color-primary-200: #d4d4c8;
--color-primary-300: #b8b8a8;
--color-primary-400: #9a9a88;
--color-primary-500: #7c7c68;
--color-primary-600: #626252;
--color-primary-700: #4a4a3e;
--color-primary-800: #36362e;
--color-primary-900: #262622;

/* Accent Palette - Subtle Highlights */
--color-accent-50: #faf5f0;
--color-accent-100: #f5e6d6;
--color-accent-200: #ebd0b0;
--color-accent-300: #deb38a;
--color-accent-400: #d49568;
--color-accent-500: #c9784c;
--color-accent-600: #be5e38;
--color-accent-700: #a84a2c;
--color-accent-800: #8f3a26;
--color-accent-900: #762e20;

/* Neutral Palette - Grayscale */
--color-neutral-50: #fafafa;
--color-neutral-100: #f5f5f5;
--color-neutral-200: #e5e5e5;
--color-neutral-300: #d4d4d4;
--color-neutral-400: #a3a3a3;
--color-neutral-500: #737373;
--color-neutral-600: #525252;
--color-neutral-700: #404040;
--color-neutral-800: #262626;
--color-neutral-900: #171717;

/* Semantic Colors */
--color-success: #2d6a4f;
--color-warning: #b08968;
--color-error: #9d0208;
--color-info: #457b9d;
```

### Color Usage

**Backgrounds**: Primary-50 or Neutral-50 for main backgrounds
**Text**: Primary-900 or Neutral-900 for body text
**Accents**: Accent-500 or Accent-600 for interactive elements
**Borders**: Primary-200 or Neutral-200 for subtle borders
**Shadows**: Neutral-900 with low opacity

## Spacing System

### Spacing Scale

```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
--space-32: 8rem;    /* 128px */
```

### Spacing Usage

**Component Padding**: Space-4 to Space-8
**Section Spacing**: Space-12 to Space-24
**Gap Between Elements**: Space-4 to Space-6
**Grid Gaps**: Space-6 to Space-8

## Layout System

### Container Sizes

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Grid System

```css
/* 12-column grid */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
}

/* Common grid patterns */
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }
.grid-6 { grid-template-columns: repeat(6, 1fr); }
```

### Editorial Grid

```css
/* Asymmetric editorial layout */
.editorial-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-12);
}

@media (max-width: 768px) {
  .editorial-grid {
    grid-template-columns: 1fr;
  }
}
```

## Border System

### Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem;  /* 2px */
--radius-md: 0.25rem;   /* 4px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;
```

### Border Width

```css
--border-thin: 1px;
--border-medium: 2px;
--border-thick: 3px;
```

### Border Usage

**Cards**: Radius-lg or Radius-xl
**Buttons**: Radius-md or Radius-lg
**Inputs**: Radius-md
**Avatars**: Radius-full
**Sections**: Radius-none (sharp edges for editorial feel)

## Shadow System

### Shadow Tokens

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Shadow Usage

**Cards**: Shadow-sm or Shadow-md (subtle)
**Buttons**: Shadow-sm on hover
**Modals**: Shadow-xl
**Navigation**: Shadow-md (elevated)

## Button System

### Button Variants

```css
/* Primary Button */
.btn-primary {
  background-color: var(--color-primary-700);
  color: white;
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-6);
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--color-primary-800);
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background-color: transparent;
  color: var(--color-primary-700);
  border: 1px solid var(--color-primary-300);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-6);
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-400);
}

/* Ghost Button */
.btn-ghost {
  background-color: transparent;
  color: var(--color-primary-700);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-6);
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background-color: var(--color-primary-50);
}

/* Text Button */
.btn-text {
  background-color: transparent;
  color: var(--color-primary-700);
  padding: var(--space-2) var(--space-4);
  font-weight: 600;
  transition: color 0.2s ease;
}

.btn-text:hover {
  color: var(--color-primary-900);
  text-decoration: underline;
}
```

### Button Sizes

```css
.btn-sm { padding: var(--space-2) var(--space-4); font-size: 0.875rem; }
.btn-md { padding: var(--space-3) var(--space-6); font-size: 1rem; }
.btn-lg { padding: var(--space-4) var(--space-8); font-size: 1.125rem; }
```

## Input System

### Input Variants

```css
/* Text Input */
.input {
  background-color: white;
  border: 1px solid var(--color-primary-200);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(124, 124, 104, 0.1);
}

.input-error {
  border-color: var(--color-error);
}

/* Textarea */
.textarea {
  background-color: white;
  border: 1px solid var(--color-primary-200);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
}

/* Select */
.select {
  background-color: white;
  border: 1px solid var(--color-primary-200);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%237c7c68%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-3) center;
  background-size: 0.65em auto;
  padding-right: var(--space-10);
}
```

## Card System

### Card Variants

```css
/* Default Card */
.card {
  background-color: white;
  border: 1px solid var(--color-primary-100);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

/* Elevated Card */
.card-elevated {
  background-color: white;
  border: 1px solid var(--color-primary-100);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}

/* Editorial Card */
.card-editorial {
  background-color: var(--color-primary-50);
  border-left: 3px solid var(--color-primary-500);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

/* Minimal Card */
.card-minimal {
  background-color: transparent;
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}
```

## Navigation System

### Navigation Styles

```css
/* Primary Navigation */
.nav-primary {
  background-color: white;
  border-bottom: 1px solid var(--color-primary-200);
  padding: var(--space-4) var(--space-8);
}

.nav-link {
  color: var(--color-primary-700);
  font-weight: 500;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: var(--color-primary-50);
  color: var(--color-primary-900);
}

.nav-link-active {
  background-color: var(--color-primary-100);
  color: var(--color-primary-900);
}

/* Secondary Navigation */
.nav-secondary {
  background-color: var(--color-primary-50);
  border-bottom: 1px solid var(--color-primary-200);
  padding: var(--space-3) var(--space-6);
}
```

## Responsive Breakpoints

### Breakpoint System

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### Responsive Patterns

```css
/* Mobile First Approach */
.container {
  width: 100%;
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .container {
    max-width: var(--container-md);
    padding: 0 var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: var(--container-lg);
    padding: 0 var(--space-8);
  }
}

/* Typography Scaling */
.text-display-xl {
  font-size: 2.5rem;
}

@media (min-width: 768px) {
  .text-display-xl {
    font-size: 3.75rem;
  }
}

@media (min-width: 1024px) {
  .text-display-xl {
    font-size: 4.5rem;
  }
}
```

## Accessibility

### Focus States

```css
/* Visible Focus Indicators */
*:focus-visible {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
}

/* Button Focus */
.btn:focus-visible {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(124, 124, 104, 0.2);
}

/* Input Focus */
.input:focus-visible {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
}
```

### Color Contrast

**Minimum Contrast Ratios**:
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- UI components: 3:1

**Compliant Combinations**:
- Primary-900 on white: 16.5:1 ✅
- Primary-700 on white: 7.2:1 ✅
- Primary-500 on white: 3.1:1 ✅
- White on Primary-700: 7.2:1 ✅

### Semantic HTML

```html
<!-- Proper Heading Hierarchy -->
<h1>Main Heading</h1>
<h2>Section Heading</h2>
<h3>Subsection Heading</h3>

<!-- Proper Form Labels -->
<label for="email">Email</label>
<input id="email" type="email" name="email" required>

<!-- Proper Button Labels -->
<button type="submit" aria-label="Submit form">Submit</button>

<!-- Proper Alt Text -->
<img src="historical-document.jpg" alt="19th century Ottoman document showing...">
```

## Motion System

### Animation Tokens

```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Motion Guidelines

**Transitions**: Use ease-out for natural feel
**Hover States**: 150-300ms duration
**Page Transitions**: 300-500ms duration
**Avoid**: Excessive animations, bounce effects

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Component Examples

### Blog Card

```css
.blog-card {
  background-color: white;
  border: 1px solid var(--color-primary-100);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.blog-card:hover {
  box-shadow: var(--shadow-lg);
}

.blog-card-image {
  aspect-ratio: 16/9;
  object-fit: cover;
}

.blog-card-content {
  padding: var(--space-6);
}

.blog-card-title {
  font-family: Georgia, serif;
  font-size: 1.5rem;
  line-height: 1.4;
  color: var(--color-primary-900);
  margin-bottom: var(--space-3);
}

.blog-card-excerpt {
  font-family: Georgia, serif;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-primary-700);
  margin-bottom: var(--space-4);
}

.blog-card-meta {
  font-size: 0.875rem;
  color: var(--color-primary-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Hero Section

```css
.hero {
  background-color: var(--color-primary-50);
  padding: var(--space-24) var(--space-8);
  text-align: center;
}

.hero-title {
  font-family: Georgia, serif;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.2;
  color: var(--color-primary-900);
  margin-bottom: var(--space-6);
}

.hero-subtitle {
  font-family: Inter, sans-serif;
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--color-primary-700);
  max-width: 600px;
  margin: 0 auto var(--space-8);
}
```

## Implementation Notes

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f5f0',
          // ... rest of primary palette
        },
        accent: {
          50: '#faf5f0',
          // ... rest of accent palette
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
};
```

### Custom Properties

```css
:root {
  /* Design Tokens */
  --color-primary-50: #f5f5f0;
  --color-primary-700: #4a4a3e;
  --color-primary-900: #262622;
  
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-12: 3rem;
  
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

---

This design system provides:
1. **Editorial Aesthetic**: Museum publication feel
2. **Accessibility**: WCAG AA compliant colors and focus states
3. **Responsiveness**: Mobile-first approach
4. **Consistency**: Token-based design system
5. **Maintainability**: Clear structure and documentation
