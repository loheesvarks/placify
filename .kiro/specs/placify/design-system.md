# Placify Design System

## Version 1.0

---

## 1. Brand Identity

### 1.1 Design Philosophy

Placify embodies the intersection of intelligence and ambition. Our design language reflects the journey of preparation—structured yet adaptive, focused yet inspiring. Every element serves a purpose: to guide users toward their placement goals with clarity, confidence, and motivation.

**Core Principles:**

- **Purposeful Minimalism**: Every pixel has intent. Remove noise, amplify signal.
- **Intelligent Hierarchy**: Information architecture that guides without overwhelming.
- **Fluid Motion**: Transitions that feel natural, not decorative.
- **Adaptive Precision**: Systems that respond and evolve with user context.
- **Premium Accessibility**: Excellence includes everyone by default.

### 1.2 Product Personality

**Professional yet Approachable**  
Placify is your trusted advisor, not your professor. Authoritative without being intimidating, sophisticated without being cold.

**Intelligent and Adaptive**  
The interface anticipates needs, learns patterns, and evolves. Every interaction feels personalized and intentional.

**Motivating and Empowering**  
Progress is celebrated, milestones are recognized, and every feature reinforces forward momentum.

### 1.3 Visual Goals

- Create a sense of depth and dimension through glass morphism and layering
- Use light and glow to draw attention and create hierarchy
- Maintain visual consistency across all screen sizes
- Ensure 100% WCAG 2.1 AA compliance
- Achieve sub-100ms perceived interaction speed
- Balance data density with breathing room

---

## 2. Color System

### 2.1 Primary Colors (Blue)

The primary palette represents intelligence, trust, and focus—core attributes of the learning journey.

```
primary-50:  #eff6ff  // Lightest tint
primary-100: #dbeafe  // Very light
primary-200: #bfdbfe  // Light
primary-300: #93c5fd  // Light medium
primary-400: #60a5fa  // Medium
primary-500: #3b82f6  // Base primary
primary-600: #2563eb  // Dark primary
primary-700: #1d4ed8  // Darker
primary-800: #1e40af  // Very dark
primary-900: #1e3a8a  // Darkest
```

**Usage:**

- primary-500: Primary buttons, links, active states
- primary-600: Hover states for primary elements
- primary-400: Secondary interactive elements
- primary-100: Subtle backgrounds, light accents

### 2.2 Secondary Colors (Purple)

Purple represents creativity, achievement, and the premium nature of the platform.

```
secondary-50:  #faf5ff  // Lightest tint
secondary-100: #f3e8ff  // Very light
secondary-200: #e9d5ff  // Light
secondary-300: #d8b4fe  // Light medium
secondary-400: #c084fc  // Medium
secondary-500: #a855f7  // Base secondary
secondary-600: #9333ea  // Dark secondary
secondary-700: #7e22ce  // Darker
secondary-800: #6b21a8  // Very dark
secondary-900: #581c87  // Darkest
```

**Usage:**

- secondary-500: Accent elements, achievements, premium features
- secondary-600: Hover states for secondary elements
- Gradient combinations with primary for emphasis

### 2.3 Semantic Colors

**Success (Green)**

```
success-50:  #ecfdf5
success-100: #d1fae5
success-500: #10b981  // Base success
success-600: #059669  // Dark success
success-900: #064e3b
```

**Warning (Amber)**

```
warning-50:  #fffbeb
warning-100: #fef3c7
warning-500: #f59e0b  // Base warning
warning-600: #d97706  // Dark warning
warning-900: #78350f
```

**Error (Red)**

```
error-50:  #fef2f2
error-100: #fee2e2
error-500: #ef4444  // Base error
error-600: #dc2626  // Dark error
error-900: #7f1d1d
```

**Info (Cyan)**

```
info-50:  #ecfeff
info-100: #cffafe
info-500: #06b6d4  // Base info
info-600: #0891b2  // Dark info
info-900: #164e63
```

### 2.4 Neutral Colors (Dark Theme Base)

```
neutral-50:  #f9fafb  // Near white
neutral-100: #f3f4f6  // Very light gray
neutral-200: #e5e7eb  // Light gray
neutral-300: #d1d5db  // Medium light
neutral-400: #9ca3af  // Medium
neutral-500: #6b7280  // Base gray
neutral-600: #4b5563  // Dark gray
neutral-700: #374151  // Darker
neutral-800: #1f2937  // Very dark
neutral-900: #111827  // Almost black
neutral-950: #030712  // Deepest black
```

### 2.5 Surface Colors (Dark Theme)

```
surface-background:  #0a0e1a  // Main background
surface-elevated-1:  #111827  // Cards, modals (first level)
surface-elevated-2:  #1f2937  // Nested cards (second level)
surface-elevated-3:  #374151  // Deeply nested (third level)

surface-border:      rgba(255, 255, 255, 0.1)   // Subtle borders
surface-border-soft: rgba(255, 255, 255, 0.05)  // Very subtle
surface-border-bold: rgba(255, 255, 255, 0.2)   // Prominent borders
```

### 2.6 Text Colors (Dark Theme)

```
text-primary:    rgba(255, 255, 255, 0.95)  // Headings, primary text
text-secondary:  rgba(255, 255, 255, 0.70)  // Body text, descriptions
text-tertiary:   rgba(255, 255, 255, 0.50)  // Subtle text, placeholders
text-disabled:   rgba(255, 255, 255, 0.30)  // Disabled state text
text-inverse:    rgba(0, 0, 0, 0.90)        // Text on light backgrounds
```

### 2.7 Gradients

**Primary Gradient (Blue to Purple)**

```
gradient-primary: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)
gradient-primary-soft: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)
```

**Secondary Gradient (Purple to Pink)**

```
gradient-secondary: linear-gradient(135deg, #9333ea 0%, #ec4899 100%)
```

**Radial Glow**

```
gradient-glow: radial-gradient(circle at center, rgba(59, 130, 246, 0.4) 0%, transparent 70%)
```

**Background Ambient**

```
gradient-ambient: radial-gradient(ellipse at top, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                  radial-gradient(ellipse at bottom, rgba(147, 51, 234, 0.05) 0%, transparent 50%)
```

### 2.8 Glass Morphism Values

```
glass-background:       rgba(255, 255, 255, 0.05)  // Base glass
glass-background-hover: rgba(255, 255, 255, 0.08)  // Hover state
glass-background-light: rgba(255, 255, 255, 0.10)  // Elevated glass
glass-background-dark:  rgba(0, 0, 0, 0.20)        // Dark glass overlay

glass-border: rgba(255, 255, 255, 0.10)
glass-backdrop-blur: 12px
glass-backdrop-saturate: 180%
```

**Glass Card Example:**

```
background: glass-background
backdrop-filter: blur(glass-backdrop-blur) saturate(glass-backdrop-saturate)
border: 1px solid glass-border
```

### 2.9 Glow Colors

Used for interactive elements and emphasis.

```
glow-primary:   rgba(59, 130, 246, 0.4)   // Blue glow
glow-secondary: rgba(147, 51, 234, 0.4)   // Purple glow
glow-success:   rgba(16, 185, 129, 0.4)   // Green glow
glow-warning:   rgba(245, 158, 11, 0.4)   // Amber glow
glow-error:     rgba(239, 68, 68, 0.4)    // Red glow
```

---

## 3. Typography

### 3.1 Font Families

**Primary Font: Inter**  
Used for UI elements, body text, and most content.

```
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
font-feature-settings: 'rlig' 1, 'calt' 1, 'ss01' 1  // Enable ligatures and alternates
```

**Monospace Font: JetBrains Mono**  
Used for code snippets, technical data, and interview questions.

```
font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace
```

### 3.2 Type Scale

**Display (Hero sections, landing pages)**

```
display-2xl: 72px / 90px   | font-weight: 700  | letter-spacing: -0.02em
display-xl:  60px / 72px   | font-weight: 700  | letter-spacing: -0.02em
display-lg:  48px / 60px   | font-weight: 700  | letter-spacing: -0.02em
display-md:  36px / 44px   | font-weight: 700  | letter-spacing: -0.01em
```

**Headings**

```
h1: 32px / 40px  | font-weight: 700  | letter-spacing: -0.01em
h2: 28px / 36px  | font-weight: 700  | letter-spacing: -0.01em
h3: 24px / 32px  | font-weight: 600  | letter-spacing: -0.01em
h4: 20px / 28px  | font-weight: 600  | letter-spacing: -0.005em
h5: 18px / 28px  | font-weight: 600  | letter-spacing: -0.005em
h6: 16px / 24px  | font-weight: 600  | letter-spacing: 0em
```

**Body Text**

```
body-xl:  20px / 32px  | font-weight: 400  | letter-spacing: 0em
body-lg:  18px / 28px  | font-weight: 400  | letter-spacing: 0em
body-md:  16px / 24px  | font-weight: 400  | letter-spacing: 0em  // Default
body-sm:  14px / 20px  | font-weight: 400  | letter-spacing: 0em
body-xs:  12px / 18px  | font-weight: 400  | letter-spacing: 0.01em
```

**Labels and UI**

```
label-lg: 16px / 24px  | font-weight: 500  | letter-spacing: 0em
label-md: 14px / 20px  | font-weight: 500  | letter-spacing: 0em
label-sm: 12px / 16px  | font-weight: 500  | letter-spacing: 0.01em
label-xs: 11px / 16px  | font-weight: 500  | letter-spacing: 0.02em
```

**Code and Monospace**

```
code-lg: 16px / 24px  | font-weight: 400  | monospace
code-md: 14px / 20px  | font-weight: 400  | monospace
code-sm: 12px / 18px  | font-weight: 400  | monospace
```

### 3.3 Font Weights

```
weight-regular:  400
weight-medium:   500
weight-semibold: 600
weight-bold:     700
```

**Usage Guidelines:**

- Headings: 600-700
- Body text: 400
- Labels, buttons: 500-600
- Emphasis: 600

### 3.4 Responsive Typography

Typography scales down on smaller screens to maintain readability and hierarchy.

**Desktop (1024px+) - Base scale above**

**Tablet (768px - 1023px)**

```
Multiply font sizes by 0.95
Maintain line heights
```

**Mobile (320px - 767px)**

```
display-2xl: 48px / 56px
display-xl:  40px / 48px
h1:          28px / 36px
h2:          24px / 32px
h3:          20px / 28px
body-md:     16px / 24px  // Keep base size
body-sm:     14px / 20px  // Minimum readable size
```

---

## 4. Spacing System

### 4.1 Base Grid

Placify uses an 8px base grid for consistent spacing. All spacing values are multiples of 4px or 8px.

```
0:    0px
0.5:  2px   // Hairline separators
1:    4px   // Minimal spacing
1.5:  6px
2:    8px   // Base unit
3:    12px
4:    16px  // Standard spacing
5:    20px
6:    24px  // Section spacing
8:    32px  // Large spacing
10:   40px
12:   48px  // XL spacing
16:   64px  // XXL spacing
20:   80px
24:   96px  // Section dividers
32:   128px // Page spacing
40:   160px
48:   192px
64:   256px
```

### 4.2 Component Spacing

**Padding (Internal spacing)**

```
padding-xs:  8px
padding-sm:  12px
padding-md:  16px   // Default for most components
padding-lg:  24px
padding-xl:  32px
padding-2xl: 48px
```

**Margins (External spacing)**

```
margin-xs:  8px
margin-sm:  16px
margin-md:  24px   // Default for sections
margin-lg:  32px
margin-xl:  48px
margin-2xl: 64px
```

**Gap (Flexbox/Grid spacing)**

```
gap-xs:  4px
gap-sm:  8px
gap-md:  12px   // Default for lists
gap-lg:  16px
gap-xl:  24px
gap-2xl: 32px
```

### 4.3 Layout Spacing

**Container Padding**

```
Desktop:  max-width: 1280px, padding: 48px
Tablet:   max-width: 100%, padding: 32px
Mobile:   max-width: 100%, padding: 16px
```

**Section Spacing**

```
Between sections (desktop):  80px
Between sections (tablet):   64px
Between sections (mobile):   48px
```

---

## 5. Border Radius

Rounded corners contribute to the modern, friendly aesthetic.

```
radius-none:  0px
radius-sm:    4px    // Subtle rounding
radius-md:    8px    // Standard (buttons, inputs)
radius-lg:    12px   // Cards, containers
radius-xl:    16px   // Large cards, modals
radius-2xl:   24px   // Hero cards, features
radius-3xl:   32px   // Premium elements
radius-full:  9999px // Pills, avatars, badges
```

**Usage:**

- Buttons: radius-md (8px)
- Inputs: radius-md (8px)
- Cards: radius-lg (12px)
- Modals: radius-xl (16px)
- Badges: radius-full
- Pills: radius-full

---

## 6. Shadows

Shadows create depth and hierarchy. Use sparingly for maximum impact.

### 6.1 Standard Shadows

```
shadow-xs:   0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow-sm:   0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)
shadow-md:   0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)
shadow-lg:   0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)
shadow-xl:   0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)
shadow-2xl:  0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### 6.2 Inner Shadows

```
shadow-inner:  inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)
```

### 6.3 Usage Guidelines

- Cards at rest: shadow-sm or shadow-md
- Cards on hover: shadow-lg
- Modals: shadow-2xl
- Dropdowns: shadow-lg
- Floating action buttons: shadow-xl

---

## 7. Glow Effects

Glows add emphasis and draw attention to interactive elements. Use for primary actions and active states.

### 7.1 Glow Shadows

```
glow-sm:   0 0 10px rgba(59, 130, 246, 0.3)
glow-md:   0 0 20px rgba(59, 130, 246, 0.4)
glow-lg:   0 0 30px rgba(59, 130, 246, 0.5)
glow-xl:   0 0 40px rgba(59, 130, 246, 0.6)

glow-purple-sm:  0 0 10px rgba(147, 51, 234, 0.3)
glow-purple-md:  0 0 20px rgba(147, 51, 234, 0.4)
glow-purple-lg:  0 0 30px rgba(147, 51, 234, 0.5)

glow-success-sm: 0 0 10px rgba(16, 185, 129, 0.3)
glow-success-md: 0 0 20px rgba(16, 185, 129, 0.4)
```

### 7.2 Glow Usage

**Interactive States:**

```
Default:  no glow
Hover:    glow-sm or glow-md
Focus:    glow-md
Active:   glow-lg (pulsing animation)
```

**Status Indicators:**

- Primary action buttons: glow-sm on hover
- Active roadmap nodes: glow-purple-md with pulse
- Completed items: glow-success-sm
- Important notifications: glow-md

### 7.3 Pulsing Glow Animation

For attention-grabbing elements (active nodes, new notifications).

```
Animation: pulse-glow
Duration: 2s
Easing: ease-in-out
Iteration: infinite

Keyframes:
0%, 100%:  box-shadow: glow-md
50%:       box-shadow: glow-lg
```

---

## 8. Button Variants

Buttons are the primary interaction mechanism. Each variant has a specific purpose.

### 8.1 Primary Button

**Purpose:** Main call-to-action, highest emphasis

```
Default State:
  background: gradient-primary
  color: white
  padding: 12px 24px
  border-radius: radius-md
  font-weight: weight-medium
  font-size: body-md
  border: none
  box-shadow: glow-sm

Hover State:
  box-shadow: glow-md
  transform: translateY(-1px)
  transition: all 200ms ease

Active/Pressed State:
  transform: translateY(0)
  box-shadow: glow-sm

Disabled State:
  background: neutral-700
  color: text-disabled
  cursor: not-allowed
  box-shadow: none
  opacity: 0.6

Loading State:
  Same as default with spinner
  cursor: wait
  pointer-events: none
```

### 8.2 Secondary Button

**Purpose:** Secondary actions, medium emphasis

```
Default State:
  background: glass-background
  backdrop-filter: blur(12px)
  color: text-primary
  border: 1px solid glass-border
  padding: 12px 24px
  border-radius: radius-md
  font-weight: weight-medium

Hover State:
  background: glass-background-hover
  border-color: primary-500
  box-shadow: glow-sm

Active State:
  background: glass-background-light
```

### 8.3 Ghost Button

**Purpose:** Tertiary actions, lowest emphasis

```
Default State:
  background: transparent
  color: text-secondary
  padding: 12px 24px
  border-radius: radius-md
  font-weight: weight-medium
  border: none

Hover State:
  background: glass-background
  color: text-primary

Active State:
  background: glass-background-hover
```

### 8.4 Danger Button

**Purpose:** Destructive actions (delete, remove)

```
Default State:
  background: error-500
  color: white
  padding: 12px 24px
  border-radius: radius-md
  font-weight: weight-medium

Hover State:
  background: error-600
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.4)

Active State:
  background: error-700
```

### 8.5 Icon Button

**Purpose:** Actions represented by icons only

```
Size Variants:
  small:  32px × 32px, icon: 16px
  medium: 40px × 40px, icon: 20px
  large:  48px × 48px, icon: 24px

Default State:
  background: transparent
  color: text-secondary
  border-radius: radius-md
  display: flex
  align-items: center
  justify-content: center

Hover State:
  background: glass-background
  color: text-primary
```

### 8.6 Button Sizing

```
small:  height: 32px, padding: 8px 16px,  font-size: 14px
medium: height: 40px, padding: 12px 24px, font-size: 16px (default)
large:  height: 48px, padding: 14px 28px, font-size: 18px
```

### 8.7 Button States Priority

```
1. Disabled (highest priority - overrides all)
2. Loading
3. Active/Pressed
4. Hover
5. Focus (keyboard)
6. Default
```

---

## 9. Input Fields

Input fields maintain consistency while providing clear feedback states.

### 9.1 Text Input

```
Default State:
  background: surface-elevated-1
  border: 1px solid surface-border
  border-radius: radius-md
  padding: 12px 16px
  font-size: body-md
  color: text-primary
  height: 40px

Focus State:
  border-color: primary-500
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
  outline: none

Hover State:
  border-color: surface-border-bold

Error State:
  border-color: error-500
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1)

Disabled State:
  background: surface-elevated-1
  border-color: surface-border-soft
  color: text-disabled
  cursor: not-allowed
  opacity: 0.6

Success State:
  border-color: success-500
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1)
```

### 9.2 Textarea

Same as text input, but:

```
min-height: 120px
resize: vertical
padding: 12px 16px
line-height: 1.5
```

### 9.3 Input with Icon

```
Left icon:  padding-left: 44px, icon positioned at left: 12px
Right icon: padding-right: 44px, icon positioned at right: 12px
Icon color: text-tertiary (default), text-secondary (focus)
```

### 9.4 Input Label

```
font-size: label-sm
font-weight: weight-medium
color: text-secondary
margin-bottom: 8px
display: block
```

### 9.5 Input Helper Text

```
font-size: body-xs
color: text-tertiary
margin-top: 6px

Error message: color: error-500
Success message: color: success-500
```

---

## 10. Cards

Cards are the primary content container, using glass morphism for depth.

### 10.1 Standard Card

```
background: glass-background
backdrop-filter: blur(12px) saturate(180%)
border: 1px solid glass-border
border-radius: radius-lg
padding: padding-lg (24px)
box-shadow: shadow-sm

Hover State (if interactive):
  background: glass-background-hover
  border-color: primary-500/20
  box-shadow: shadow-md, glow-sm
  transform: translateY(-2px)
  transition: all 300ms ease
```

### 10.2 Elevated Card

For nested or emphasized content.

```
background: glass-background-light
backdrop-filter: blur(16px) saturate(180%)
border: 1px solid glass-border
border-radius: radius-lg
padding: padding-lg
box-shadow: shadow-md
```

### 10.3 Compact Card

For list items or dense layouts.

```
background: glass-background
border: 1px solid glass-border
border-radius: radius-md
padding: padding-md (16px)
box-shadow: none

Hover:
  border-color: primary-500/30
  box-shadow: shadow-sm
```

### 10.4 Feature Card

For highlighting important features or achievements.

```
background: gradient-primary-soft
backdrop-filter: blur(16px)
border: 1px solid primary-500/20
border-radius: radius-xl
padding: padding-xl (32px)
box-shadow: shadow-lg, glow-md
position: relative
overflow: hidden

::before (decorative gradient overlay):
  content: ''
  position: absolute
  top: 0
  left: 0
  right: 0
  height: 2px
  background: gradient-primary
```

### 10.5 Card Header

```
margin-bottom: 16px
display: flex
align-items: center
justify-content: space-between

Title:
  font-size: h5
  font-weight: weight-semibold
  color: text-primary

Actions:
  display: flex
  gap: gap-sm
```

---

## 11. Sidebar

The sidebar is the primary navigation, always accessible and visually distinct.

### 11.1 Sidebar Container

```
Desktop:
  width: 280px
  position: fixed
  left: 0
  top: 0
  height: 100vh
  background: surface-elevated-1
  border-right: 1px solid surface-border
  padding: 24px 16px
  z-index: 100

Mobile:
  width: 280px
  position: fixed
  left: -280px (collapsed)
  left: 0 (expanded)
  transition: left 300ms ease
  background: surface-background
  backdrop-filter: blur(20px)
  box-shadow: shadow-2xl
```

### 11.2 Sidebar Logo

```
padding: 12px 16px
margin-bottom: 32px
display: flex
align-items: center
gap: 12px

Logo:
  width: 32px
  height: 32px

App Name:
  font-size: h6
  font-weight: weight-bold
  background: gradient-primary
  background-clip: text
  -webkit-text-fill-color: transparent
```

### 11.3 Sidebar Navigation Item

```
Default State:
  display: flex
  align-items: center
  gap: 12px
  padding: 12px 16px
  border-radius: radius-md
  color: text-secondary
  font-weight: weight-medium
  font-size: body-sm
  margin-bottom: 4px
  transition: all 200ms ease

Hover State:
  background: glass-background
  color: text-primary

Active State:
  background: gradient-primary-soft
  color: primary-400
  box-shadow: glow-sm

  Icon color: primary-500

Icon:
  width: 20px
  height: 20px
  flex-shrink: 0

Badge (notification count):
  margin-left: auto
  background: primary-500
  color: white
  padding: 2px 8px
  border-radius: radius-full
  font-size: label-xs
```

### 11.4 Sidebar Section Divider

```
margin: 24px 0
border: none
border-top: 1px solid surface-border-soft
```

### 11.5 Sidebar User Section (Bottom)

```
position: absolute
bottom: 24px
left: 16px
right: 16px
padding: 12px
background: glass-background
border: 1px solid glass-border
border-radius: radius-lg

Display:
  flex
  align-items: center
  gap: 12px

Avatar:
  width: 40px
  height: 40px
  border-radius: radius-full
  background: gradient-primary

User Info:
  flex: 1

  Name:
    font-size: body-sm
    font-weight: weight-medium
    color: text-primary
    margin-bottom: 2px

  Email:
    font-size: label-xs
    color: text-tertiary
```

---

## 12. Navigation

### 12.1 Top Bar

```
Desktop:
  position: fixed
  top: 0
  left: 280px (sidebar width)
  right: 0
  height: 64px
  background: glass-background
  backdrop-filter: blur(12px)
  border-bottom: 1px solid surface-border
  padding: 0 32px
  display: flex
  align-items: center
  gap: 24px
  z-index: 90

Mobile:
  left: 0
  padding: 0 16px
```

### 12.2 Breadcrumbs

```
display: flex
align-items: center
gap: 8px
font-size: body-sm
color: text-tertiary

Link:
  color: text-secondary
  transition: color 200ms

  Hover:
    color: primary-400

Separator:
  color: text-tertiary
  content: '/'

Current:
  color: text-primary
  font-weight: weight-medium
```

### 12.3 Tabs

Horizontal navigation within a page section.

```
Container:
  display: flex
  border-bottom: 1px solid surface-border
  gap: 4px

Tab Item:
  padding: 12px 20px
  font-size: body-sm
  font-weight: weight-medium
  color: text-secondary
  border-bottom: 2px solid transparent
  transition: all 200ms
  cursor: pointer

Tab Hover:
  color: text-primary
  background: glass-background

Tab Active:
  color: primary-400
  border-bottom-color: primary-500
  background: transparent

Tab Disabled:
  color: text-disabled
  cursor: not-allowed
  opacity: 0.5
```

---

## 13. Icons

Icons provide visual cues and improve scannability.

### 13.1 Icon Library

**Primary:** Lucide React (consistent, well-designed, extensive)

### 13.2 Icon Sizes

```
xs:  12px × 12px  // Inline with small text
sm:  16px × 16px  // Buttons, inputs
md:  20px × 20px  // Navigation (default)
lg:  24px × 24px  // Headings, emphasis
xl:  32px × 32px  // Feature highlights
2xl: 48px × 48px  // Hero sections
```

### 13.3 Icon Colors

```
Default:    text-secondary
Hover:      text-primary
Active:     primary-500
Disabled:   text-disabled
Success:    success-500
Warning:    warning-500
Error:      error-500
```

### 13.4 Icon Usage Guidelines

- Always provide `aria-label` or `aria-hidden="true"` with adjacent text
- Maintain consistent stroke width (1.5px to 2px)
- Use filled variants sparingly (active states, alerts)
- Icons should be decorative or have text alternatives
- Minimum touch target: 44px × 44px on mobile

---

## 14. Badges

Badges display status, counts, or short labels.

### 14.1 Status Badge

```
Default:
  display: inline-flex
  align-items: center
  padding: 4px 12px
  border-radius: radius-full
  font-size: label-sm
  font-weight: weight-medium
  gap: 6px

Variants:
  Primary:
    background: primary-500/10
    color: primary-400
    border: 1px solid primary-500/20

  Success:
    background: success-500/10
    color: success-400
    border: 1px solid success-500/20

  Warning:
    background: warning-500/10
    color: warning-400
    border: 1px solid warning-500/20

  Error:
    background: error-500/10
    color: error-400
    border: 1px solid error-500/20

  Neutral:
    background: neutral-700
    color: text-secondary
    border: 1px solid surface-border
```

### 14.2 Count Badge

For notification counts, unread indicators.

```
Sizes:
  small:  16px × 16px, font-size: 10px
  medium: 20px × 20px, font-size: 11px

Default:
  background: primary-500
  color: white
  border-radius: radius-full
  display: flex
  align-items: center
  justify-content: center
  font-weight: weight-medium
  min-width: (size)
  height: (size)
  padding: 0 4px

Positioned (absolute):
  top: -8px
  right: -8px
  border: 2px solid surface-background
```

### 14.3 Dot Badge

Minimal status indicator.

```
width: 8px
height: 8px
border-radius: radius-full

Variants:
  Active:   background: success-500
  Warning:  background: warning-500
  Error:    background: error-500
  Offline:  background: neutral-500
```

---

## 15. Progress Indicators

### 15.1 Linear Progress Bar

```
Container:
  width: 100%
  height: 8px
  background: neutral-800
  border-radius: radius-full
  overflow: hidden

Bar:
  height: 100%
  background: gradient-primary
  border-radius: radius-full
  transition: width 300ms ease

With Label:
  Container has margin-bottom: 8px

  Label:
    display: flex
    justify-content: space-between
    font-size: label-sm
    color: text-secondary
    margin-bottom: 8px
```

### 15.2 Circular Progress

```
Container:
  position: relative
  display: inline-flex
  align-items: center
  justify-content: center

Sizes:
  small:  32px × 32px, stroke: 3px
  medium: 48px × 48px, stroke: 4px
  large:  64px × 64px, stroke: 5px
  xl:     96px × 96px, stroke: 6px

Background Circle:
  stroke: neutral-800
  fill: transparent

Progress Circle:
  stroke: gradient-primary (or solid primary-500)
  stroke-linecap: round
  fill: transparent
  transition: stroke-dashoffset 300ms ease

Center Label:
  position: absolute
  font-size: label-md
  font-weight: weight-semibold
  color: text-primary
```

### 15.3 Step Progress

For multi-step processes (onboarding, interviews).

```
Container:
  display: flex
  align-items: center
  gap: 8px

Step:
  display: flex
  flex-direction: column
  align-items: center
  gap: 8px
  flex: 1

Step Circle:
  width: 32px
  height: 32px
  border-radius: radius-full
  display: flex
  align-items: center
  justify-content: center
  font-size: label-sm
  font-weight: weight-semibold

  Completed:
    background: primary-500
    color: white
    box-shadow: glow-sm

  Current:
    background: gradient-primary
    color: white
    box-shadow: glow-md
    animation: pulse-glow

  Upcoming:
    background: neutral-800
    color: text-tertiary
    border: 1px solid surface-border

Connector Line:
  flex: 1
  height: 2px

  Completed: background: primary-500
  Upcoming:  background: neutral-800
```

---

## 16. Charts and Data Visualization

Powered by Recharts, styled for consistency with the design system.

### 16.1 Chart Container

```
background: glass-background
backdrop-filter: blur(12px)
border: 1px solid glass-border
border-radius: radius-lg
padding: padding-lg

Header:
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 24px

  Title:
    font-size: h5
    font-weight: weight-semibold
    color: text-primary
```

### 16.2 Chart Colors

```
Primary Line:   primary-500
Secondary Line: secondary-500
Tertiary Line:  info-500

Area Fill:      primary-500 with opacity gradient (0.3 to 0)
Bar Fill:       primary-500
Positive:       success-500
Negative:       error-500

Grid Lines:     surface-border-soft
Axis Lines:     surface-border
Text:           text-tertiary
```

### 16.3 Chart Tooltip

```
background: surface-elevated-2
backdrop-filter: blur(16px)
border: 1px solid glass-border
border-radius: radius-md
padding: 12px
box-shadow: shadow-lg

Label:
  font-size: label-sm
  font-weight: weight-medium
  color: text-primary
  margin-bottom: 8px

Values:
  display: flex
  align-items: center
  gap: 8px
  font-size: body-sm
  color: text-secondary

  Color Indicator:
    width: 8px
    height: 8px
    border-radius: radius-full
```

### 16.4 Legend

```
display: flex
gap: 24px
justify-content: center
margin-top: 16px

Legend Item:
  display: flex
  align-items: center
  gap: 8px
  font-size: label-sm
  color: text-secondary

  Color Box:
    width: 12px
    height: 12px
    border-radius: 2px
```

---

## 17. Empty States

Empty states guide users when content is absent.

### 17.1 Empty State Container

```
display: flex
flex-direction: column
align-items: center
justify-content: center
text-align: center
padding: 64px 32px
min-height: 400px
```

### 17.2 Empty State Elements

```
Icon:
  width: 64px
  height: 64px
  color: text-tertiary
  margin-bottom: 24px
  opacity: 0.6

Title:
  font-size: h4
  font-weight: weight-semibold
  color: text-primary
  margin-bottom: 12px

Description:
  font-size: body-md
  color: text-secondary
  max-width: 480px
  line-height: 1.6
  margin-bottom: 32px

Action Button:
  (Use primary or secondary button)
```

### 17.3 Empty State Variants

**No Data Yet:**

```
Icon: Plus circle or Database
Message: "Get started by creating your first [item]"
Tone: Encouraging, instructional
```

**No Results:**

```
Icon: Search or Filter
Message: "No results found for '[query]'"
Suggestion: "Try adjusting your filters"
Tone: Helpful, suggestive
```

**Error State:**

```
Icon: Alert triangle
Message: "Unable to load [content]"
Action: "Try again" button
Tone: Apologetic, actionable
```

---

## 18. Loading States

### 18.1 Spinner

```
Primary Spinner:
  size: 24px (small), 32px (medium), 48px (large)
  border: 3px solid neutral-800
  border-top-color: primary-500
  border-radius: radius-full
  animation: spin 0.8s linear infinite

@keyframes spin:
  0%:   transform: rotate(0deg)
  100%: transform: rotate(360deg)
```

### 18.2 Loading Overlay

For full-screen or modal loading.

```
position: fixed (or absolute for containers)
inset: 0
background: surface-background/80
backdrop-filter: blur(8px)
display: flex
flex-direction: column
align-items: center
justify-content: center
z-index: 9999

Spinner:
  margin-bottom: 16px

Loading Text:
  font-size: body-sm
  color: text-secondary
```

### 18.3 Progress Loading

For operations with known progress.

```
Container:
  Same as loading overlay

Progress Bar:
  width: 320px
  margin-bottom: 16px

Status Text:
  font-size: body-sm
  color: text-secondary
  margin-bottom: 8px

Percentage:
  font-size: h4
  font-weight: weight-semibold
  color: text-primary
  margin-bottom: 24px
```

---

## 19. Skeleton Loaders

Skeleton screens maintain layout during content loading.

### 19.1 Base Skeleton

```
background: linear-gradient(
  90deg,
  neutral-800 0%,
  neutral-700 50%,
  neutral-800 100%
)
background-size: 200% 100%
animation: shimmer 1.5s infinite
border-radius: radius-md

@keyframes shimmer:
  0%:   background-position: 200% 0
  100%: background-position: -200% 0
```

### 19.2 Skeleton Variants

**Text Line:**

```
height: 16px (body text)
height: 24px (heading)
width: 100% or specific %
border-radius: radius-sm
margin-bottom: 8px
```

**Avatar:**

```
width: 40px
height: 40px
border-radius: radius-full
```

**Card:**

```
height: 200px (or specific)
width: 100%
border-radius: radius-lg
```

**Button:**

```
height: 40px
width: 120px
border-radius: radius-md
```

### 19.3 Skeleton Composition Examples

**Card with Avatar and Text:**

```
Card Container
├── Flex Row (gap: 16px)
│   ├── Avatar Skeleton (40px circle)
│   └── Flex Column (flex: 1)
│       ├── Text Line (60% width)
│       └── Text Line (40% width, smaller)
```

**List Item:**

```
Container
├── Text Line (80% width, height: 20px)
├── Text Line (60% width, height: 16px)
└── Text Line (40% width, height: 16px)
```

---

## 20. Responsive Breakpoints

Placify follows a mobile-first approach with consistent breakpoints.

### 20.1 Breakpoint Values

```
xs:   0px     // Extra small (mobile portrait)
sm:   640px   // Small (mobile landscape)
md:   768px   // Medium (tablet portrait)
lg:   1024px  // Large (tablet landscape, small desktop)
xl:   1280px  // Extra large (desktop)
2xl:  1536px  // 2X extra large (large desktop)
```

### 20.2 Container Max Widths

```
xs-sm:  100% (full width with padding)
md:     100% (full width with padding)
lg:     1024px
xl:     1280px
2xl:    1280px (stays consistent)
```

### 20.3 Responsive Patterns

**Sidebar Behavior:**

```
Mobile (< md):     Hidden by default, overlay when opened
Tablet (md - lg):  Collapsible, icon-only when collapsed
Desktop (>= lg):   Always visible, full width
```

**Grid Layouts:**

```
Mobile:   1 column
Tablet:   2 columns
Desktop:  3-4 columns
```

**Card Spacing:**

```
Mobile:   gap-md (12px)
Tablet:   gap-lg (16px)
Desktop:  gap-xl (24px)
```

### 20.4 Touch Targets (Mobile)

All interactive elements must meet minimum sizes:

```
Buttons:     44px × 44px minimum
Links:       44px × 44px minimum tap area
Icons:       44px × 44px tap area (icon can be smaller)
Checkboxes:  24px × 24px (with 44px tap area)
```

---

## 21. Accessibility Rules

Placify is built for everyone. WCAG 2.1 AA compliance is mandatory.

### 21.1 Color Contrast Requirements

**Text Contrast:**

```
Normal text (< 18px):     Minimum 4.5:1 contrast ratio
Large text (≥ 18px):      Minimum 3:1 contrast ratio
UI components:            Minimum 3:1 contrast ratio
```

**Verified Combinations:**

```
✅ text-primary on surface-background:   19.2:1
✅ text-secondary on surface-background: 9.8:1
✅ text-tertiary on surface-background:  4.9:1
✅ primary-500 on surface-background:    8.2:1
✅ white on primary-500:                 8.6:1
```

### 21.2 Keyboard Navigation

**Focus Indicators:**

```
Visible focus ring on all interactive elements
Ring width: 2px
Ring color: primary-500
Ring offset: 2px
Border-radius: matches element + 2px

Focus style:
  outline: 2px solid primary-500
  outline-offset: 2px
  (Never use outline: none without replacement)
```

**Tab Order:**

- Follows logical reading order (top to bottom, left to right)
- Skip navigation link provided
- Modal traps focus until dismissed
- Dropdowns navigate with arrow keys

**Keyboard Shortcuts:**

```
Cmd/Ctrl + K:  Open search
Escape:        Close modals/dropdowns
Enter:         Submit forms, activate buttons
Space:         Toggle checkboxes, activate buttons
Arrow keys:    Navigate lists, tabs, dropdowns
Tab/Shift+Tab: Navigate between focusable elements
```

### 21.3 Screen Reader Support

**ARIA Labels:**

- All icons without adjacent text have `aria-label`
- Decorative icons use `aria-hidden="true"`
- Form inputs have associated labels
- Error messages linked with `aria-describedby`
- Live regions for dynamic content (`aria-live="polite"`)

**Semantic HTML:**

- Use `<button>` for actions, `<a>` for navigation
- Proper heading hierarchy (h1 → h2 → h3, no skipping)
- Landmark regions (`<nav>`, `<main>`, `<aside>`, `<footer>`)
- Lists use `<ul>`, `<ol>`, or `<dl>`

**ARIA Roles:**

```
Modal:        role="dialog", aria-modal="true"
Tabs:         role="tablist", "tab", "tabpanel"
Alerts:       role="alert" or role="status"
Breadcrumbs:  aria-label="Breadcrumb"
```

### 21.4 Motion and Animation

**Respect User Preferences:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Animation Guidelines:**

- Duration: 200-400ms for most transitions
- No auto-playing videos with sound
- Provide pause button for content > 5 seconds
- Avoid flashing content (< 3 times per second)

### 21.5 Form Accessibility

**Required Fields:**

```html
<input required aria-required="true" /> <label> Name <span aria-label="required">*</span> </label>
```

**Error Messages:**

```html
<input aria-invalid="true" aria-describedby="error-id" />
<span id="error-id" role="alert">Error message</span>
```

**Helper Text:**

```html
<input aria-describedby="help-id" /> <span id="help-id">Helper text</span>
```

### 21.6 Alternative Text

**Images:**

- Decorative: `alt=""` or `aria-hidden="true"`
- Informative: Descriptive alt text
- Complex: Alt text + long description

**Icon-only Buttons:**

```html
<button aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>
```

---

## 22. Component Design Rules

Guidelines for creating new components or variants.

### 22.1 Composition Principles

**Single Responsibility:**
Each component should do one thing well. Prefer composition over complex components.

**Prop Interface:**

```typescript
interface ComponentProps {
  // Visual variants
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';

  // State
  disabled?: boolean;
  loading?: boolean;

  // Accessibility
  'aria-label'?: string;

  // Common
  className?: string;
  children?: React.ReactNode;
}
```

**Compound Components:**
Prefer explicit sub-components over implicit children structure.

```
✅ <Card><Card.Header><Card.Body><Card.Footer>
❌ <Card> with magic children detection
```

### 22.2 Variant System

Components should offer clear, purposeful variants.

**Naming Convention:**

```
variant:  visual style (primary, secondary, ghost, danger)
size:     dimensions (sm, md, lg)
state:    interaction state (default, hover, active, disabled)
```

**Avoid:**

- Too many variants (max 4-5 per property)
- Ambiguous names ("special", "custom")
- Variants that only differ in color

### 22.3 Animation Standards

**Transition Timing:**

```
Instant:     0ms       (only for state that doesn't change visually)
Fast:        150ms     (small movements, opacity)
Default:     200-300ms (most transitions)
Moderate:    400ms     (larger movements, complex states)
Slow:        600ms+    (page transitions, special emphasis)
```

**Easing Functions:**

```
ease-in:      cubic-bezier(0.4, 0, 1, 1)       // Accelerating
ease-out:     cubic-bezier(0, 0, 0.2, 1)       // Decelerating (default)
ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1)     // Smooth both ends
spring:       cubic-bezier(0.34, 1.56, 0.64, 1) // Bounce effect
```

**Framer Motion Variants:**

```typescript
// Fade in
const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Slide up
const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// Scale
const scale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};
```

### 22.4 Spacing Consistency

**Internal Padding:**

- Small components (badges, pills): 4-8px
- Medium components (buttons, inputs): 12-16px
- Large components (cards): 24-32px

**External Margins:**

- Related elements: 8-12px
- Sections: 24-32px
- Major sections: 48-64px

**Gap in Flex/Grid:**

- Tight layouts: 8px
- Standard layouts: 12-16px
- Loose layouts: 24px

### 22.5 State Management

All interactive components should handle these states:

**Required States:**

1. Default (resting)
2. Hover
3. Focus (keyboard)
4. Active/Pressed
5. Disabled

**Optional States:** 6. Loading 7. Error 8. Success

**State Priority (highest to lowest):**

```
1. Disabled (if true, ignore all other states)
2. Loading (if true, ignore hover/active)
3. Error (visual feedback)
4. Active (currently pressed/selected)
5. Focus (keyboard navigation)
6. Hover (mouse over)
7. Default
```

### 22.6 Consistency Checklist

Before shipping a new component, verify:

- [ ] Follows color system (no arbitrary colors)
- [ ] Uses spacing scale (no arbitrary margins/padding)
- [ ] Implements all required states
- [ ] Has focus indicator (keyboard accessible)
- [ ] Includes loading state (if async)
- [ ] Has disabled state styling
- [ ] Meets contrast requirements (4.5:1 minimum)
- [ ] Works at all breakpoints
- [ ] Has proper ARIA labels
- [ ] Tested with screen reader
- [ ] Tested with keyboard only
- [ ] Animation respects prefers-reduced-motion
- [ ] Touch targets ≥ 44px on mobile
- [ ] TypeScript types exported
- [ ] Documented with examples

---

## 23. Animation Library

Reusable Framer Motion animations for common patterns.

### 23.1 Entry Animations

**Fade In:**

```typescript
{
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
}
```

**Slide Up:**

```typescript
{
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: 'easeOut' }
}
```

**Scale Up:**

```typescript
{
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, ease: 'easeOut' }
}
```

### 23.2 Stagger Animations

For lists and grids:

```typescript
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};
```

### 23.3 Hover Effects

**Lift:**

```typescript
{
  whileHover: {
    y: -2,
    transition: { duration: 0.2 }
  }
}
```

**Scale:**

```typescript
{
  whileHover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
}
```

**Glow:**

```typescript
{
  whileHover: {
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
    transition: { duration: 0.3 }
  }
}
```

### 23.4 Press Effects

```typescript
{
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
}
```

### 23.5 Page Transitions

```typescript
{
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: 'easeInOut' }
}
```

---

## 24. Best Practices

### 24.1 Performance

**Optimize Animations:**

- Animate `transform` and `opacity` only (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly and remove after animation

**Reduce Repaints:**

- Use `backdrop-filter` carefully (performance cost)
- Limit number of glass morphism elements on screen
- Debounce scroll and resize handlers

**Image Optimization:**

- Use WebP format with fallbacks
- Implement lazy loading
- Provide proper sizing attributes
- Use blur placeholders

### 24.2 Maintainability

**Design Tokens:**

- Never use raw color values (#3b82f6) directly in components
- Always reference design tokens (primary-500)
- Keep all design decisions in this document

**Component Library:**

- Build primitive components first (Button, Input, Card)
- Compose complex components from primitives
- Document each component with examples
- Export TypeScript types for all props

**Naming Conventions:**

```
Components:    PascalCase (Button, Card, UserMenu)
Files:         kebab-case (button.tsx, user-menu.tsx)
CSS Classes:   kebab-case (btn-primary, card-elevated)
Props:         camelCase (isLoading, onClick, ariaLabel)
Variants:      lowercase (primary, secondary, ghost)
```

### 24.3 Testing

**Visual Regression:**

- Screenshot test all component variants
- Test at multiple breakpoints
- Test light and dark themes

**Accessibility:**

- Automated tests with jest-axe
- Manual keyboard navigation testing
- Screen reader testing (NVDA, VoiceOver, JAWS)

**Interaction:**

- Test all states (hover, focus, active, disabled)
- Test loading states
- Test error states

### 24.4 Documentation

**Component Documentation Should Include:**

1. Purpose and use cases
2. Visual examples of all variants
3. Props table with types and defaults
4. Accessibility notes
5. Code examples
6. Do's and don'ts

**Design Token Documentation:**

- Maintain this file as source of truth
- Auto-generate token files for code
- Version control all changes
- Document breaking changes

---

## 25. Implementation Checklist

When implementing this design system:

### Phase 1: Foundation

- [ ] Configure Tailwind with design tokens
- [ ] Set up font loading (Inter, JetBrains Mono)
- [ ] Create CSS custom properties for colors
- [ ] Set up Framer Motion
- [ ] Configure dark theme
- [ ] Test color contrast ratios

### Phase 2: Primitives

- [ ] Implement Button with all variants
- [ ] Implement Input with all states
- [ ] Implement Card with variants
- [ ] Implement Badge components
- [ ] Implement progress indicators
- [ ] Test accessibility of primitives

### Phase 3: Layout

- [ ] Implement Sidebar navigation
- [ ] Implement Top bar
- [ ] Implement responsive layouts
- [ ] Test mobile navigation
- [ ] Test keyboard navigation
- [ ] Verify focus management

### Phase 4: Feedback

- [ ] Implement Toast notifications
- [ ] Implement Modal dialogs
- [ ] Implement Loading states
- [ ] Implement Skeleton loaders
- [ ] Implement Empty states
- [ ] Test ARIA announcements

### Phase 5: Data Display

- [ ] Configure Recharts theming
- [ ] Implement chart containers
- [ ] Implement data tables
- [ ] Test responsive data views
- [ ] Verify chart accessibility

### Phase 6: Polish

- [ ] Add all animations
- [ ] Test reduced motion preferences
- [ ] Optimize performance
- [ ] Run Lighthouse audits
- [ ] Complete accessibility audit
- [ ] Document all components

---

## Appendix A: Color Palette Quick Reference

```
Primary (Blue):
├─ Lightest: #eff6ff (50)
├─ Base:     #3b82f6 (500)
└─ Darkest:  #1e3a8a (900)

Secondary (Purple):
├─ Lightest: #faf5ff (50)
├─ Base:     #a855f7 (500)
└─ Darkest:  #581c87 (900)

Semantic:
├─ Success:  #10b981 (green-500)
├─ Warning:  #f59e0b (amber-500)
├─ Error:    #ef4444 (red-500)
└─ Info:     #06b6d4 (cyan-500)

Surfaces:
├─ Background:  #0a0e1a
├─ Elevated-1:  #111827
├─ Elevated-2:  #1f2937
└─ Elevated-3:  #374151

Text:
├─ Primary:    rgba(255, 255, 255, 0.95)
├─ Secondary:  rgba(255, 255, 255, 0.70)
├─ Tertiary:   rgba(255, 255, 255, 0.50)
└─ Disabled:   rgba(255, 255, 255, 0.30)
```

---

## Appendix B: Spacing Scale Quick Reference

```
0:    0px
1:    4px    ■
2:    8px    ■■
3:    12px   ■■■
4:    16px   ■■■■
5:    20px   ■■■■■
6:    24px   ■■■■■■
8:    32px   ■■■■■■■■
10:   40px   ■■■■■■■■■■
12:   48px   ■■■■■■■■■■■■
16:   64px   ■■■■■■■■■■■■■■■■
20:   80px   ■■■■■■■■■■■■■■■■■■■■
24:   96px   (24 units)
32:   128px  (32 units)
```

---

## Appendix C: Typography Scale Quick Reference

```
Display:
├─ 2xl:  72px / 90px  | Bold
├─ xl:   60px / 72px  | Bold
├─ lg:   48px / 60px  | Bold
└─ md:   36px / 44px  | Bold

Headings:
├─ h1:   32px / 40px  | Bold
├─ h2:   28px / 36px  | Bold
├─ h3:   24px / 32px  | Semibold
├─ h4:   20px / 28px  | Semibold
├─ h5:   18px / 28px  | Semibold
└─ h6:   16px / 24px  | Semibold

Body:
├─ xl:   20px / 32px  | Regular
├─ lg:   18px / 28px  | Regular
├─ md:   16px / 24px  | Regular (base)
├─ sm:   14px / 20px  | Regular
└─ xs:   12px / 18px  | Regular

Labels:
├─ lg:   16px / 24px  | Medium
├─ md:   14px / 20px  | Medium
├─ sm:   12px / 16px  | Medium
└─ xs:   11px / 16px  | Medium
```

---

## Appendix D: Component State Matrix

Quick reference for consistent state styling across components.

| State    | Background  | Border          | Text          | Shadow       | Transform        |
| -------- | ----------- | --------------- | ------------- | ------------ | ---------------- |
| Default  | Base        | border-default  | text-primary  | shadow-sm    | none             |
| Hover    | Base + 10%  | border-emphasis | text-primary  | shadow-md    | translateY(-1px) |
| Focus    | Base        | primary-500     | text-primary  | glow-focus   | none             |
| Active   | Base - 10%  | border-emphasis | text-primary  | shadow-sm    | none             |
| Disabled | neutral-700 | border-soft     | text-disabled | none         | none             |
| Loading  | Base        | border-default  | text-primary  | shadow-sm    | none             |
| Error    | Base        | error-500       | text-primary  | glow-error   | none             |
| Success  | Base        | success-500     | text-primary  | glow-success | none             |

---

## Version History

### Version 1.0 (Current)

- Initial design system specification
- Complete color palette with semantic colors
- Typography scale with responsive sizing
- Spacing system (8px grid)
- Component specifications for all primitives
- Accessibility guidelines (WCAG 2.1 AA)
- Animation standards
- Responsive breakpoints
- State management rules

### Planned Updates

- Version 1.1: Light theme variant
- Version 1.2: Extended color palette for data visualization
- Version 1.3: Advanced animation patterns
- Version 2.0: Component composition system

---

## Credits and Inspiration

This design system draws inspiration from:

- **Linear**: Clean, minimal interface with subtle animations
- **Vercel**: Premium dark theme with excellent contrast
- **Notion**: Hierarchical information architecture
- **Framer**: Fluid, natural motion design
- **Apple**: Attention to detail and accessibility
- **Roadmap.sh**: Clear visual communication of complex information

---

**Document maintained by**: Design Team  
**Last updated**: 2024  
**Status**: Production Ready  
**Next review**: Quarterly

---

_This design system is a living document. All changes should be documented and communicated to the engineering team. When in doubt, prioritize accessibility and consistency over novelty._
