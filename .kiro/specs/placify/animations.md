# Placify Motion Design System

## Version 1.0

**Official Motion Language Specification**

This document defines the complete animation and motion system for Placify. Every animation in the platform must adhere to these specifications to maintain a cohesive, premium user experience that feels intelligent, purposeful, and smooth.

---

## 1. Motion Philosophy

### 1.1 Design Principles

**Purposeful Motion**
Every animation must serve a functional purpose—never decorative alone. Motion guides attention, provides feedback, communicates relationships, and reinforces user actions.

**Intelligent Responsiveness**
Animations respond to user intent with appropriate speed and easing. Fast interactions feel instant (<100ms), medium interactions feel smooth (200-400ms), complex transitions feel orchestrated (400-800ms).

**Spatial Continuity**
Elements maintain spatial relationships through transitions. Objects don't teleport—they move through space with appropriate physics. Parent-child relationships are preserved visually.

**Predictable Behavior**
Similar actions produce similar motion. Users learn the motion language and develop expectations. Consistency builds confidence and reduces cognitive load.

**Performance First**
All animations target 60fps minimum. Use GPU-accelerated properties (transform, opacity). Avoid animating layout properties (width, height, top, left, margin). Respect reduced motion preferences.

**Accessible by Default**
Motion enhances experience but never blocks functionality. Critical information is never communicated through motion alone. Prefers-reduced-motion is respected universally.

### 1.2 When Animations Should Be Used

**Provide Feedback**

- Button presses and interactions
- Form submissions and validation
- Loading states and progress
- Success and error states
- Drag and drop operations

**Guide Attention**

- New content appearing
- Important notifications
- Active elements and selections
- Milestone achievements
- AI recommendations

**Communicate Relationships**

- Parent-child hierarchies
- Sequential dependencies (roadmap nodes)
- Cause and effect
- State transitions
- Data updates

**Create Delight**

- Onboarding experiences
- Achievement celebrations
- Milestone completions
- Weekly review reveals
- First-time interactions

**Maintain Context**

- Page transitions
- Modal appearances
- Sidebar expand/collapse
- Content filtering
- Search results

### 1.3 When Animations Should NOT Be Used

**During Critical Tasks**

- Password entry
- Payment processing
- Data deletion confirmations
- Time-sensitive actions

**On Initial Load**

- Above-the-fold content should appear immediately
- Avoid animation blocking First Contentful Paint
- Skeleton screens don't animate on initial render

**For Repetitive Actions**

- Rapidly repeated clicks should reduce animation duration
- Bulk operations should skip individual item animations
- List scrolling should not animate every item

**When Performance Suffers**

- If frame rate drops below 45fps, disable animation
- On low-power devices, simplify or disable decorative animations
- Large dataset rendering should prioritize performance over motion

### 1.4 Performance Goals

- **Target frame rate**: 60fps (16.67ms per frame)
- **Acceptable minimum**: 45fps (22.22ms per frame)
- **Maximum animation duration**: 800ms for single elements
- **Stagger delay limit**: 50ms per item maximum
- **GPU-accelerated properties only**: transform (translate, scale, rotate), opacity, filter (blur)
- **JavaScript animation budget**: <5ms per frame
- **Total animations on screen**: Limit to 5 simultaneous complex animations

### 1.5 Accessibility Considerations

**Respect User Preferences**

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations become instant or significantly reduced */
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Never Animate Critical Information**

- Error messages appear instantly
- Success confirmations appear instantly
- Navigation changes don't require animation completion
- Form validation appears immediately

**Avoid Vestibular Issues**

- No continuous spinning animations >3 seconds
- Parallax effects are subtle (<20px movement)
- Zoom animations stay <1.1x scale factor for backgrounds
- Auto-playing animations pause after 5 seconds

**Provide Animation Controls**

- Users can disable non-essential animations in settings
- Notification animations can be reduced
- Decorative effects can be disabled

**Keyboard Navigation**

- Focus indicators animate smoothly (200ms)
- Focus never jumps or teleports
- Animated elements remain keyboard accessible during animation
- Animation doesn't interfere with focus order

---

## 2. Global Motion Tokens

### 2.1 Duration Scale

All durations in milliseconds (ms). Use these exact values—no custom durations.

```
instant:     0ms      // Disabled state, critical feedback
immediate:   50ms     // Micro-interactions, hover states
fast:        150ms    // Button press, input focus
normal:      250ms    // Card hover, simple transitions (default)
moderate:    350ms    // Modal open, drawer slide
comfortable: 500ms    // Page transitions, complex reveals
slow:        700ms    // Dramatic reveals, achievements
deliberate:  1000ms   // Multi-step animations, celebrations
```

**Usage Guidelines:**

- Hover states: immediate (50ms)
- Button clicks: fast (150ms)
- Form inputs: normal (250ms)
- Modals/drawers: moderate (350ms)
- Page transitions: comfortable (500ms)
- Achievements: slow (700ms) to deliberate (1000ms)

### 2.2 Delay Scale

Stagger delays for sequential animations.

```
stagger-xs:   20ms    // Tight sequential items (list items)
stagger-sm:   40ms    // Standard sequential items
stagger-md:   60ms    // Relaxed sequential items
stagger-lg:   100ms   // Emphasized sequential items
stagger-xl:   150ms   // Dramatic sequential items
```

**Stagger Patterns:**

- List items (5-10 items): stagger-xs (20ms)
- Card grids (3-6 items): stagger-sm (40ms)
- Feature reveals (3-4 items): stagger-md (60ms)
- Onboarding steps: stagger-lg (100ms)
- Achievement reveals: stagger-xl (150ms)

### 2.3 Easing Curves

Named easing functions following industry standards.

**Standard Easings (CSS cubic-bezier):**

```
linear:      cubic-bezier(0, 0, 1, 1)
ease-in:     cubic-bezier(0.4, 0, 1, 1)
ease-out:    cubic-bezier(0, 0, 0.2, 1)       // Most common, default
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

**Custom Easings (Placify-specific):**

```
ease-smooth:    cubic-bezier(0.25, 0.1, 0.25, 1)      // Smooth, subtle
ease-bounce:    cubic-bezier(0.68, -0.55, 0.265, 1.55) // Playful overshoot
ease-snappy:    cubic-bezier(0.4, 0, 0, 1)            // Quick start, smooth end
ease-elegant:   cubic-bezier(0.16, 1, 0.3, 1)         // Premium feel
ease-dramatic:  cubic-bezier(0.87, 0, 0.13, 1)        // Strong emphasis
```

**Usage Guidelines:**

- Hover states: ease-out (standard)
- Modal open/close: ease-smooth
- Button press: ease-snappy
- Achievements: ease-bounce (subtle)
- Page transitions: ease-elegant
- Dramatic reveals: ease-dramatic
- Default fallback: ease-out

### 2.4 Spring Configurations

For Framer Motion spring animations. Springs feel more natural than easing curves for interactive elements.

**Standard Springs:**

```javascript
spring-gentle: {
  type: "spring",
  stiffness: 100,
  damping: 15,
  mass: 1
}

spring-responsive: {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.5
}

spring-snappy: {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.5
}

spring-bouncy: {
  type: "spring",
  stiffness: 400,
  damping: 15,
  mass: 0.8
}

spring-elastic: {
  type: "spring",
  stiffness: 200,
  damping: 12,
  mass: 1.2
}
```

**Usage Guidelines:**

- Modals/Drawers: spring-gentle
- Drag and drop: spring-responsive
- Button feedback: spring-snappy
- Playful interactions: spring-bouncy
- Floating elements: spring-elastic

### 2.5 Motion Hierarchy

Animation priority determines which animations play when multiple trigger simultaneously.

```
Level 1 (Critical - Never interrupt):
  - Error messages
  - Loading states blocking UI
  - Data saving indicators

Level 2 (High - Interrupt Level 3):
  - Modal open/close
  - Page transitions
  - Form submissions

Level 3 (Medium - Interrupt Level 4):
  - Card hovers
  - Dropdown menus
  - Tooltips

Level 4 (Low - Can be skipped):
  - Decorative glows
  - Background animations
  - Ambient effects
```

### 2.6 Z-Index Animation Rules

Animating elements must respect z-index layering.

```
Base Layer (z-index: 0-9):
  - Page background
  - Background decorative elements

Content Layer (z-index: 10-49):
  - Cards
  - List items
  - Standard content

Elevated Layer (z-index: 50-89):
  - Dropdowns
  - Tooltips
  - Popovers
  - Sticky headers

Overlay Layer (z-index: 90-98):
  - Modals
  - Drawers
  - Full-screen overlays

Critical Layer (z-index: 99):
  - Toasts
  - Loading spinners
  - Critical notifications
```

**Animation Rules:**

- Elements animate within their z-index layer
- Opening modals: increase z-index before animation starts
- Closing modals: decrease z-index after animation completes
- Dropdowns animate in Elevated Layer
- Page transitions keep elements in Content Layer

---

## 3. Page Transitions

Full-page navigation animations.

### 3.1 Standard Page Transition

**Purpose:** Navigate between dashboard pages  
**Trigger:** User clicks navigation link  
**Duration:** 500ms  
**Easing:** ease-elegant

**Outgoing Page:**

- Opacity: 1 → 0.4
- Scale: 1 → 0.98
- Blur: 0px → 4px
- Transform: translateY(0) → translateY(-10px)
- Duration: 250ms
- Easing: ease-in

**Incoming Page:**

- Opacity: 0 → 1
- Scale: 0.98 → 1
- Blur: 4px → 0px
- Transform: translateY(10px) → translateY(0)
- Delay: 100ms (wait for outgoing to progress)
- Duration: 400ms
- Easing: ease-elegant

### 3.2 Deep Navigation Transition

**Purpose:** Navigate to child/detail page  
**Trigger:** User clicks card or list item  
**Duration:** 450ms  
**Easing:** ease-smooth

**Outgoing Page:**

- Opacity: 1 → 0
- Scale: 1 → 1.05
- Blur: 0px → 8px
- Duration: 200ms

**Incoming Page:**

- Opacity: 0 → 1
- Transform: translateX(30px) → translateX(0)
- Duration: 450ms
- Delay: 100ms

### 3.3 Back Navigation Transition

**Purpose:** Return to previous page  
**Trigger:** User clicks back button  
**Duration:** 400ms  
**Easing:** ease-snappy

**Outgoing Page:**

- Opacity: 1 → 0
- Transform: translateX(0) → translateX(30px)
- Duration: 300ms

**Incoming Page:**

- Opacity: 0 → 1
- Scale: 0.98 → 1
- Transform: translateX(-20px) → translateX(0)
- Delay: 50ms
- Duration: 400ms

---

## 4. Route Transitions

Animations specific to app routing between major sections.

### 4.1 Dashboard to Roadmap

**Purpose:** Transition from overview to detailed roadmap view  
**Trigger:** User navigates from dashboard to roadmap  
**Duration:** 600ms  
**Spring:** spring-gentle

**Animation:**

- Fade out dashboard: 200ms
- Roadmap fades in: 0 → 1 opacity
- Roadmap scales: 0.95 → 1
- Canvas background animates from center
- Node connections draw in sequentially (stagger-sm)
- Delay: 150ms after dashboard fade

### 4.2 Any Page to Settings

**Purpose:** Slide in settings from right  
**Trigger:** User clicks settings link  
**Duration:** 400ms  
**Easing:** ease-smooth

**Animation:**

- Current page: opacity 1 → 0.3, blur 0 → 8px
- Settings page: translateX(100%) → translateX(0)
- Settings page: opacity 0 → 1
- Backdrop appears: opacity 0 → 0.5

### 4.3 Login to Dashboard (First Time)

**Purpose:** Celebrate successful authentication  
**Trigger:** User completes login  
**Duration:** 1200ms  
**Easing:** ease-elegant

**Animation Sequence:**

1. Success checkmark appears (scale 0 → 1.2 → 1) - 300ms
2. Login form fades out (opacity 1 → 0) - 200ms
3. Screen flashes subtle gradient - 150ms
4. Dashboard elements appear sequentially:
   - Sidebar: translateX(-100%) → translateX(0) - 400ms
   - Top bar: translateY(-100%) → translateY(0) - 400ms, delay 50ms
   - Main content: fade + scale up - 500ms, delay 200ms
   - Welcome message: fade in - 300ms, delay 600ms

---

## 5. Sidebar Animations

### 5.1 Sidebar Expand/Collapse (Desktop)

**Purpose:** Toggle sidebar visibility  
**Trigger:** User clicks collapse icon  
**Duration:** 350ms  
**Spring:** spring-responsive

**Expand:**

- Width: 64px → 280px
- Labels: opacity 0 → 1, translateX(-10px) → translateX(0)
- Icons: no animation (stay in place)
- Delay for labels: 150ms

**Collapse:**

- Width: 280px → 64px
- Labels: opacity 1 → 0, translateX(0) → translateX(-10px)
- Duration: 200ms (faster collapse)

### 5.2 Sidebar Mobile Slide

**Purpose:** Show/hide sidebar on mobile  
**Trigger:** User taps hamburger menu  
**Duration:** 300ms  
**Easing:** ease-smooth

**Open:**

- Sidebar: translateX(-100%) → translateX(0)
- Backdrop: opacity 0 → 0.6
- Both animate simultaneously

**Close:**

- Sidebar: translateX(0) → translateX(-100%)
- Backdrop: opacity 0.6 → 0
- Duration: 250ms (faster close)

### 5.3 Navigation Item Hover

**Purpose:** Provide feedback on interactive item  
**Trigger:** Mouse enters navigation item  
**Duration:** 150ms  
**Easing:** ease-out

**Animation:**

- Background: opacity 0 → 1
- Glow: box-shadow 0 → glow-sm
- Scale: 1 → 1.02
- Icon color: text-secondary → text-primary

### 5.4 Navigation Item Active State

**Purpose:** Show current page  
**Trigger:** Page loads/changes  
**Duration:** 400ms  
**Spring:** spring-gentle

**Animation:**

- Background: gradient-primary-soft fades in
- Border-left: 3px solid primary-500 grows from top
- Glow: pulsing glow-sm (2s cycle)
- Icon: color shifts to primary-400
- Scale: subtle pulse 1 → 1.03 → 1

---

## 6. Navigation Animations

### 6.1 Breadcrumb Separator

**Purpose:** Smooth appearance of breadcrumb trail  
**Trigger:** Page loads  
**Duration:** 200ms per item  
**Stagger:** stagger-xs (20ms)  
**Easing:** ease-out

**Animation:**

- Opacity: 0 → 1
- TranslateX: -10px → 0
- Separator fades in after text

### 6.2 Tab Switch

**Purpose:** Highlight active tab  
**Trigger:** User clicks tab  
**Duration:** 250ms  
**Easing:** ease-smooth

**Active Tab:**

- Border-bottom: 2px solid, slides in from left to right
- Color: text-secondary → primary-400
- Background: subtle highlight fades in

**Inactive Tab:**

- Border: fades out
- Color: shifts to text-secondary
- Duration: 150ms (faster fade)

### 6.3 Dropdown Menu Open

**Purpose:** Reveal dropdown options  
**Trigger:** User clicks dropdown button  
**Duration:** 250ms  
**Easing:** ease-out

**Animation:**

- Opacity: 0 → 1
- Scale: 0.95 → 1
- Transform origin: top center
- Blur: 4px → 0px
- Items stagger in (stagger-xs): translateY(-5px) → translateY(0)

---

## 7. Button Animations

### 7.1 Button Hover

**Purpose:** Indicate interactivity  
**Trigger:** Mouse enters button  
**Duration:** 150ms  
**Easing:** ease-out

**Primary Button:**

- Transform: translateY(0) → translateY(-2px)
- Box-shadow: glow-sm → glow-md
- Scale: 1 → 1.02

**Secondary Button:**

- Background: glass-background → glass-background-hover
- Border-color: glass-border → primary-500/30
- Glow: none → glow-sm

**Ghost Button:**

- Background: transparent → glass-background
- Color: text-secondary → text-primary

**Icon Button:**

- Background: transparent → glass-background
- Scale: 1 → 1.1
- Icon color: text-secondary → text-primary

### 7.2 Button Active/Press

**Purpose:** Confirm physical interaction  
**Trigger:** Mouse down on button  
**Duration:** 100ms  
**Easing:** ease-snappy

**Animation:**

- Transform: translateY(-2px) → translateY(0)
- Scale: 1.02 → 0.98
- Box-shadow: glow-md → glow-sm

### 7.3 Button Disabled

**Purpose:** Show non-interactive state  
**Trigger:** Button disabled property changes  
**Duration:** 200ms  
**Easing:** ease-out

**Animation:**

- Opacity: 1 → 0.6
- Cursor: pointer → not-allowed
- Glow: fades to 0
- Background: desaturates

### 7.4 Button Loading

**Purpose:** Indicate processing state  
**Trigger:** Form submission or async action  
**Duration:** Indefinite (until complete)  
**Easing:** linear

**Animation:**

- Text: opacity 1 → 0 (150ms)
- Spinner: fades in opacity 0 → 1 (150ms)
- Spinner: continuous rotation 360deg (1000ms loop)
- Width: maintains original width (no shift)
- Cursor: pointer → wait
- Pointer events: none

**Spinner Specifics:**

- Size: 16px × 16px
- Stroke: 2px
- Color: currentColor
- Rotation: clockwise
- Animation: linear, infinite

---

## 8. Input Animations

### 8.1 Input Focus

**Purpose:** Highlight active input field  
**Trigger:** Input receives focus  
**Duration:** 200ms  
**Easing:** ease-out

**Animation:**

- Border-color: surface-border → primary-500
- Box-shadow: none → 0 0 0 3px rgba(59, 130, 246, 0.1)
- Label color: text-secondary → primary-400 (if floating)
- Scale: 1 → 1.005 (subtle)

### 8.2 Input Error

**Purpose:** Alert user to validation failure  
**Trigger:** Validation fails  
**Duration:** 400ms  
**Easing:** ease-bounce (subtle)

**Animation:**

- Border-color: surface-border → error-500 (instant)
- Box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1)
- Shake animation: translateX(0 → 4px → -4px → 2px → -2px → 0) over 400ms
- Error message: slides down translateY(-10px) → translateY(0), opacity 0 → 1
- Error icon: scale 0 → 1.2 → 1 (bounce)

**Shake Keyframes:**

```
0%:   translateX(0)
25%:  translateX(4px)
50%:  translateX(-4px)
75%:  translateX(2px)
100%: translateX(0)
```

### 8.3 Input Success

**Purpose:** Confirm valid input  
**Trigger:** Validation passes  
**Duration:** 300ms  
**Easing:** ease-out

**Animation:**

- Border-color: surface-border → success-500
- Box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1)
- Success checkmark: scale 0 → 1, opacity 0 → 1
- Duration: 300ms
- Checkmark rotation: -45deg → 0deg

---

## 9. Card Animations

### 9.1 Card Hover (Interactive Cards)

**Purpose:** Indicate clickable card  
**Trigger:** Mouse enters card  
**Duration:** 250ms  
**Easing:** ease-smooth

**Animation:**

- Transform: translateY(0) → translateY(-4px)
- Box-shadow: shadow-sm → shadow-md + glow-sm
- Border-color: glass-border → primary-500/20
- Background: glass-background → glass-background-hover
- Scale: 1 → 1.01

### 9.2 Card Appear (Initial Load)

**Purpose:** Progressive reveal of content  
**Trigger:** Page load or content fetch complete  
**Duration:** 400ms per card  
**Stagger:** stagger-sm (40ms)  
**Easing:** ease-elegant

**Animation:**

- Opacity: 0 → 1
- Transform: translateY(20px) → translateY(0)
- Scale: 0.95 → 1
- Blur: 4px → 0px

### 9.3 Card Flip

**Purpose:** Reveal back of card (e.g., flashcard mode)  
**Trigger:** User clicks flip button  
**Duration:** 600ms  
**Easing:** ease-in-out

**Animation:**

- RotateY: 0deg → 180deg
- Front face: opacity 1 → 0 at 50% progress
- Back face: opacity 0 → 1 at 50% progress
- Scale: 1 → 1.05 → 1 (slight zoom during flip)

### 9.4 Card Remove/Delete

**Purpose:** Smooth removal animation  
**Trigger:** User deletes card  
**Duration:** 400ms  
**Easing:** ease-in

**Animation:**

- Scale: 1 → 0.9
- Opacity: 1 → 0
- Transform: translateX(0) → translateX(-30px)
- Height: collapses to 0 (margin collapse)
- Adjacent cards: shift up smoothly to fill space (300ms, stagger-xs)

---

## 10. Glass Morphism Effects

Glass effects are static visual styles, but blur can animate during transitions.

### 10.1 Glass Surface Transition

**Purpose:** Smooth transition into glass state  
**Trigger:** Element appears or hovers  
**Duration:** 300ms  
**Easing:** ease-out

**Animation:**

- Backdrop-blur: 0px → 12px
- Background: transparent → glass-background
- Border: opacity 0 → 1
- Backdrop-saturate: 100% → 180%

### 10.2 Glass Intensity Shift (Hover)

**Purpose:** Emphasize interactive glass element  
**Trigger:** Mouse enters glass card  
**Duration:** 250ms  
**Easing:** ease-smooth

**Animation:**

- Backdrop-blur: 12px → 16px
- Background: glass-background → glass-background-hover
- Border: glass-border → primary-500/20
- Glow: none → glow-sm

### 10.3 Frosted Overlay Appear

**Purpose:** Backdrop for modals/drawers  
**Trigger:** Modal opens  
**Duration:** 300ms  
**Easing:** ease-out

**Animation:**

- Opacity: 0 → 1
- Backdrop-blur: 0px → 20px
- Background: transparent → rgba(0, 0, 0, 0.4)

---

## 11. Modal Animations

### 11.1 Modal Open

**Purpose:** Present modal dialog  
**Trigger:** User clicks button to open modal  
**Duration:** 350ms  
**Easing:** ease-smooth

**Backdrop:**

- Opacity: 0 → 1
- Backdrop-blur: 0 → 20px
- Duration: 300ms

**Modal Content:**

- Opacity: 0 → 1
- Scale: 0.9 → 1
- TranslateY: 20px → 0
- Blur: 8px → 0px
- Delay: 50ms after backdrop starts
- Duration: 350ms

### 11.2 Modal Close

**Purpose:** Dismiss modal gracefully  
**Trigger:** User clicks close, ESC, or backdrop  
**Duration:** 300ms  
**Easing:** ease-in

**Modal Content:**

- Opacity: 1 → 0
- Scale: 1 → 0.95
- TranslateY: 0 → 10px
- Duration: 250ms

**Backdrop:**

- Opacity: 1 → 0
- Backdrop-blur: 20px → 0
- Delay: 100ms (wait for content to fade)
- Duration: 200ms

### 11.3 Modal Content Transitions

**Purpose:** Animate content changes within modal (multi-step forms)  
**Trigger:** User clicks next/previous in wizard  
**Duration:** 400ms  
**Easing:** ease-elegant

**Outgoing Content:**

- Opacity: 1 → 0
- TranslateX: 0 → -30px (next) or 30px (previous)
- Duration: 200ms

**Incoming Content:**

- Opacity: 0 → 1
- TranslateX: 30px (next) or -30px (previous) → 0
- Delay: 150ms
- Duration: 400ms

---

## 12. Drawer Animations

### 12.1 Drawer Slide In (Right)

**Purpose:** Open side drawer  
**Trigger:** User opens settings, filters, or details  
**Duration:** 350ms  
**Spring:** spring-responsive

**Animation:**

- TranslateX: 100% → 0
- Opacity: 0 → 1 (first 100ms)
- Box-shadow: none → shadow-2xl
- Backdrop: opacity 0 → 0.5

### 12.2 Drawer Slide Out (Right)

**Purpose:** Close side drawer  
**Trigger:** User closes drawer  
**Duration:** 300ms  
**Easing:** ease-in

**Animation:**

- TranslateX: 0 → 100%
- Opacity: 1 → 0 (last 100ms)
- Backdrop: opacity 0.5 → 0

### 12.3 Drawer Slide In (Left)

**Purpose:** Open secondary navigation drawer  
**Trigger:** Mobile menu open  
**Duration:** 300ms  
**Easing:** ease-smooth

**Animation:**

- TranslateX: -100% → 0
- Opacity: 0 → 1
- Backdrop: opacity 0 → 0.6

### 12.4 Drawer Content Reveal

**Purpose:** Stagger drawer content appearance  
**Trigger:** Drawer opens  
**Duration:** 300ms per item  
**Stagger:** stagger-xs (20ms)  
**Easing:** ease-out

**Animation:**

- Opacity: 0 → 1
- TranslateY: 10px → 0
- Delay: Starts after drawer slide completes

---

## 13. Tooltip Animations

### 13.1 Tooltip Appear

**Purpose:** Show contextual help  
**Trigger:** Mouse hovers 500ms OR focus  
**Duration:** 150ms  
**Easing:** ease-out

**Animation:**

- Opacity: 0 → 1
- Scale: 0.9 → 1
- TransformOrigin: bottom center (for top tooltip), top center (for bottom tooltip)
- TranslateY: 5px → 0 (for top tooltip), -5px → 0 (for bottom tooltip)

### 13.2 Tooltip Disappear

**Purpose:** Hide tooltip  
**Trigger:** Mouse leaves OR blur  
**Duration:** 100ms  
**Easing:** ease-in

**Animation:**

- Opacity: 1 → 0
- Scale: 1 → 0.95
- Duration: faster exit for immediate feel

---

## 14. Toast Animations

### 14.1 Toast Appear (Slide In)

**Purpose:** Show notification  
**Trigger:** System event or user action completes  
**Duration:** 400ms  
**Spring:** spring-responsive

**Animation:**

- TranslateY: -100% → 0 (top position) or 100% → 0 (bottom position)
- Opacity: 0 → 1
- Scale: 0.95 → 1
- Glow: grows in (based on variant)

### 14.2 Toast Disappear (Slide Out)

**Purpose:** Hide notification  
**Trigger:** Auto-dismiss timer OR user closes  
**Duration:** 300ms  
**Easing:** ease-in

**Animation:**

- TranslateX: 0 → 100% (slide right)
- Opacity: 1 → 0
- Scale: 1 → 0.9
- Height: collapses over 200ms after slide completes

### 14.3 Toast Stack Shuffle

**Purpose:** Reposition remaining toasts  
**Trigger:** A toast is removed from stack  
**Duration:** 250ms  
**Easing:** ease-smooth

**Animation:**

- TranslateY: shift all toasts up to fill gap
- Smooth spring transition

### 14.4 Toast Progress Bar

**Purpose:** Show auto-dismiss countdown  
**Trigger:** Toast appears  
**Duration:** Matches auto-dismiss time (e.g., 5000ms)  
**Easing:** linear

**Animation:**

- Width: 100% → 0%
- Smooth linear progression
- Pauses on hover
- Resumes on mouse leave

---

## 15. Dropdown Animations

### 15.1 Dropdown Menu Open

**Purpose:** Reveal menu options  
**Trigger:** User clicks dropdown trigger  
**Duration:** 200ms  
**Easing:** ease-out

**Animation:**

- Opacity: 0 → 1
- Scale: 0.95 → 1
- TransformOrigin: top (for dropdowns below trigger), bottom (for dropdowns above)
- Blur: 4px → 0px

**Menu Items Stagger:**

- Delay: stagger-xs (20ms)
- TranslateY: -5px → 0
- Opacity: 0 → 1

### 15.2 Dropdown Menu Close

**Purpose:** Hide menu  
**Trigger:** User selects option, clicks outside, or ESC  
**Duration:** 150ms  
**Easing:** ease-in

**Animation:**

- Opacity: 1 → 0
- Scale: 1 → 0.95
- No stagger on close (instant)

---

## 16. Skeleton Loading Animations

### 16.1 Skeleton Shimmer

**Purpose:** Indicate loading state  
**Trigger:** Content is loading  
**Duration:** 1500ms (loop infinitely)  
**Easing:** ease-in-out

**Animation:**

- Gradient position: translateX(-100%) → translateX(100%)
- Gradient: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)
- Continuous loop

### 16.2 Skeleton to Content Transition

**Purpose:** Replace skeleton with real content  
**Trigger:** Data loads  
**Duration:** 400ms  
**Easing:** ease-elegant

**Skeleton:**

- Opacity: 1 → 0
- Duration: 200ms

**Content:**

- Opacity: 0 → 1
- TranslateY: 10px → 0
- Scale: 0.98 → 1
- Delay: 100ms
- Duration: 400ms

---

## 17. Dashboard Widget Animations

### 17.1 Widget Appear on Load

**Purpose:** Progressively reveal dashboard widgets  
**Trigger:** Dashboard page loads  
**Duration:** 500ms per widget  
**Stagger:** stagger-md (60ms)  
**Easing:** ease-elegant

**Animation:**

- Opacity: 0 → 1
- TranslateY: 30px → 0
- Scale: 0.95 → 1
- Blur: 6px → 0px

### 17.2 Widget Data Update

**Purpose:** Indicate data refresh  
**Trigger:** Real-time data update  
**Duration:** 600ms  
**Easing:** ease-smooth

**Animation:**

- Pulse glow: box-shadow glow-sm (0 → 1 → 0.5 → 1)
- Updated value: scale 1 → 1.1 → 1, color shift to primary-400
- Chart: smooth data transition (interpolate values)

### 17.3 Widget Hover (Interactive)

**Purpose:** Show widget is clickable  
**Trigger:** Mouse enters widget  
**Duration:** 250ms  
**Easing:** ease-smooth

**Animation:**

- Transform: translateY(0) → translateY(-3px)
- Box-shadow: shadow-md → shadow-lg + glow-sm
- Background: glass-background → glass-background-hover
- Border: glass-border → primary-500/30

---

## 18. Progress Animations

### 18.1 Linear Progress Bar Fill

**Purpose:** Show completion progress  
**Trigger:** Progress value changes  
**Duration:** 800ms  
**Easing:** ease-out

**Animation:**

- Width: current% → new%
- Gradient shifts: gradient position animates
- Smooth interpolation
- Glow pulses at 100% completion

### 18.2 Circular Progress

**Purpose:** Show radial progress  
**Trigger:** Progress updates  
**Duration:** 1000ms  
**Easing:** ease-elegant

**Animation:**

- Stroke-dashoffset: animates based on percentage
- Smooth circular fill
- Center text: counts up with easing
- Glow at 100%: scale 1 → 1.05 → 1, glow-success-md

### 18.3 Step Progress Indicator

**Purpose:** Show multi-step completion  
**Trigger:** Step completes  
**Duration:** 600ms per step  
**Easing:** ease-bounce (subtle)

**Completed Step:**

- Circle background: neutral-800 → primary-500
- Checkmark: scale 0 → 1, rotate -90deg → 0deg
- Glow: glow-sm appears
- Connector line: fills with primary-500 (300ms)

---

## 19. Chart Animations

### 19.1 Line Chart Draw-In

**Purpose:** Animate chart appearance  
**Trigger:** Chart data loads  
**Duration:** 1200ms  
**Easing:** ease-elegant

**Animation:**

- Path: stroke-dasharray animates from 0 to full length
- Points: appear sequentially with stagger-xs
- Grid lines: fade in opacity 0 → 1 (400ms)
- Axes: fade in (300ms)
- Legend: fade in with stagger-sm (500ms delay)

### 19.2 Bar Chart Rise

**Purpose:** Animate bars growing  
**Trigger:** Chart renders  
**Duration:** 800ms  
**Stagger:** stagger-xs (20ms) per bar  
**Easing:** ease-out

**Animation:**

- Height: 0 → full height
- Opacity: 0 → 1
- Transform origin: bottom
- Glow: subtle glow-sm on highest bar

### 19.3 Pie/Donut Chart Reveal

**Purpose:** Animate segments appearing  
**Trigger:** Chart loads  
**Duration:** 1000ms  
**Easing:** ease-in-out

**Animation:**

- Segments: draw clockwise from top (12 o'clock)
- Each segment: opacity 0 → 1 as it draws
- Labels: fade in with stagger-sm after segments complete
- Center text (donut): counts up after draw completes

### 19.4 Chart Hover Interaction

**Purpose:** Highlight data point  
**Trigger:** Mouse hovers over data point  
**Duration:** 150ms  
**Easing:** ease-out

**Animation:**

- Data point: scale 1 → 1.3
- Tooltip: appears (see tooltip animations)
- Other data points: opacity 1 → 0.4
- Hovered bar/line: glow-sm appears

---

## 20. Roadmap Animations

### 20.1 Locked Node

**Purpose:** Indicate node is not yet available  
**Trigger:** Initial render, prerequisite incomplete  
**Duration:** Static (no animation)  
**Visual State:**

**Style:**

- Background: neutral-800
- Border: 1px solid surface-border
- Opacity: 0.5
- Icon: Lock icon, text-tertiary
- Cursor: not-allowed

**Hover (no animation):**

- Tooltip appears explaining prerequisites

### 20.2 Available Node

**Purpose:** Show node is ready to start  
**Trigger:** Prerequisites complete  
**Duration:** Static with pulse  
**Animation:** Pulse glow (2000ms loop)

**Style:**

- Background: glass-background
- Border: 1px solid primary-500/30
- Icon: Unlock icon, primary-400
- Cursor: pointer

**Pulse Animation:**

- Box-shadow: glow-sm → glow-md → glow-sm
- Duration: 2000ms
- Easing: ease-in-out
- Infinite loop

**Hover:**

- Transform: translateY(-3px)
- Box-shadow: glow-md
- Scale: 1.02
- Duration: 200ms

### 20.3 Active Node (In Progress)

**Purpose:** Highlight current learning node  
**Trigger:** User starts node  
**Duration:** Continuous pulse

**Style:**

- Background: gradient-primary-soft
- Border: 2px solid primary-500
- Icon: Progress spinner or active indicator
- Glow: pulsing glow-purple-md

**Pulse Glow Animation:**

- Box-shadow: glow-purple-md → glow-purple-lg → glow-purple-md
- Duration: 2500ms
- Easing: ease-in-out
- Infinite

**Progress Ring (Optional):**

- Circular progress around node
- Stroke: primary-500
- Animates as completion increases
- Duration: 800ms per update

### 20.4 Completed Node

**Purpose:** Celebrate finished node  
**Trigger:** User completes all requirements  
**Duration:** 1200ms (celebration), then static

**Celebration Animation:**

1. Checkmark appears: scale 0 → 1.3 → 1, rotate -90deg → 0deg (400ms)
2. Success glow: glow-success-md pulses 3 times (300ms each)
3. Confetti particles (optional): burst from center, fade and fall (800ms)
4. Background shifts: neutral → success-500/10

**Static Completed State:**

- Background: success-500/10
- Border: 1px solid success-500/30
- Icon: Checkmark, success-400
- Glow: subtle glow-success-sm
- Opacity: 0.8 (de-emphasize completed)

**Hover:**

- Opacity: 1
- Glow: glow-success-md
- Duration: 200ms

### 20.5 Connection Line Animations

**Purpose:** Show dependencies between nodes  
**Trigger:** Roadmap loads or updates  
**Duration:** 800ms  
**Stagger:** stagger-sm (40ms) per connection  
**Easing:** ease-out

**Draw-In Animation:**

- Stroke-dasharray: animates from 0 to full length
- Direction: from prerequisite to dependent node
- Opacity: 0 → 1

**Connection States:**

**Locked Connection:**

- Stroke: surface-border
- Opacity: 0.3
- Dash pattern: 5px 5px (dashed)

**Available Connection:**

- Stroke: primary-500/50
- Opacity: 0.6
- Solid line

**Active Path (user's current progress):**

- Stroke: primary-500
- Opacity: 1
- Glow: subtle drop-shadow
- Animated flow: gradient moves along path (2s loop)

**Completed Connection:**

- Stroke: success-500
- Opacity: 0.5
- Checkmarks appear at intervals (optional)

### 20.6 Node Unlock Animation

**Purpose:** Celebrate node becoming available  
**Trigger:** Prerequisites complete  
**Duration:** 1000ms  
**Easing:** ease-bounce

**Animation Sequence:**

1. Lock icon: shakes (0-200ms)
2. Lock icon: scale 1 → 0, rotate 0 → 180deg (200-400ms)
3. Unlock icon: scale 0 → 1.2 → 1 (400-700ms)
4. Border: animates to primary-500 (500-700ms)
5. Glow: pulse appears (700-1000ms)
6. Background: shifts to glass-background (700-1000ms)

**Particle Effect:**

- Small particles burst from lock position
- Fade and drift outward
- Duration: 800ms
- Count: 8-12 particles

---

## 21. AI Animations

### 21.1 AI Thinking Indicator

**Purpose:** Show AI is processing  
**Trigger:** User sends message, AI hasn't responded  
**Duration:** Infinite loop until response

**Animation:**

- Three dots pulsing sequentially
- Dot 1: scale 0.8 → 1 → 0.8 (1000ms)
- Dot 2: same, delay 200ms
- Dot 3: same, delay 400ms
- Container: subtle glow-primary-sm pulse

**Alternative (Spinner):**

- Rotating gradient ring
- Duration: 1500ms per rotation
- Easing: linear

### 21.2 Streaming Response Animation

**Purpose:** Display AI response as it generates  
**Trigger:** AI starts responding  
**Duration:** Real-time streaming

**Animation:**

- Text appears character by character or word by word
- Cursor blinks at current position (500ms interval)
- Smooth scroll to keep cursor visible
- Slight fade-in per word: opacity 0.7 → 1 (100ms)

**Cursor Animation:**

```
Blink cycle: 1000ms
0-500ms:   opacity 1
500-1000ms: opacity 0.3
```

**Complete Signal:**

- Cursor fades out (300ms)
- Message container: subtle scale 1 → 1.01 → 1 (200ms)
- Border: brief primary-500 highlight (300ms)

### 21.3 Typing Indicator (User is typing)

**Purpose:** Show user is composing message  
**Trigger:** User types in input  
**Duration:** Appears after 500ms of typing, disappears 2s after last keystroke

**Animation:**

- Fade in: opacity 0 → 1 (200ms)
- Three dots bounce sequentially
- Dot animation: translateY(0 → -4px → 0), duration 600ms
- Stagger: 150ms between dots
- Loop: infinite

### 21.4 AI Recommendation Appearance

**Purpose:** Present AI suggestion smoothly  
**Trigger:** AI generates recommendation  
**Duration:** 600ms  
**Easing:** ease-elegant

**Animation:**

- Recommendation card slides in: translateY(20px) → translateY(0)
- Opacity: 0 → 1
- Scale: 0.95 → 1
- Border: animates from left (gradient sweep)
- Icon: rotates in 180deg → 0deg, scale 0 → 1
- Glow: glow-primary-sm fades in

**Emphasis Animation (Important recommendations):**

- After appearing, gentle pulse (once)
- Scale: 1 → 1.03 → 1 (800ms)
- Glow: glow-md → glow-lg → glow-md

---

## 22. Success Animations

### 22.1 Checkmark Success

**Purpose:** Confirm successful action  
**Trigger:** Operation completes successfully  
**Duration:** 600ms  
**Easing:** ease-bounce

**Animation:**

- Circle background: scale 0 → 1.1 → 1 (300ms)
- Circle: background success-500, glow-success-md
- Checkmark path: draws from bottom-left to top-right
- Stroke-dasharray animation: 0 → full length (400ms)
- Delay: 100ms after circle
- Scale pulse: 1 → 1.1 → 1 at completion

### 22.2 Confetti Celebration

**Purpose:** Celebrate major milestones  
**Trigger:** Roadmap phase complete, weekly goals achieved  
**Duration:** 2000ms  
**Easing:** ease-out (gravity simulation)

**Animation:**

- 30-50 confetti particles
- Colors: primary-400, secondary-400, success-400, warning-400
- Initial velocity: random upward vectors
- Gravity: particles fall with deceleration
- Rotation: each particle rotates randomly
- Opacity: 1 → 0 over final 500ms
- Scale: 1 → 0.5 as they fade

**Particle Physics:**

- Initial Y velocity: -300px to -500px
- Initial X velocity: -200px to 200px
- Gravity: 800px/s²
- Rotation speed: 180-360deg/s

### 22.3 Success Toast with Icon

**Purpose:** Brief success notification  
**Trigger:** Form submitted, data saved, action completed  
**Duration:** 400ms appear, auto-dismiss after 4000ms

**Animation:**

- Toast slides in from top (see Toast animations)
- Icon (checkmark): scale 0 → 1.2 → 1 (300ms, ease-bounce)
- Icon rotates: -90deg → 0deg
- Success glow: glow-success-sm
- Progress bar: counts down (see Toast progress)

---

## 23. Error Animations

### 23.1 Error Shake

**Purpose:** Alert user to error  
**Trigger:** Validation fails, operation errors  
**Duration:** 500ms  
**Easing:** ease-in-out

**Animation:**

- Shake pattern: translateX(0 → 10px → -10px → 8px → -8px → 4px → -4px → 0)
- Error icon appears: scale 0 → 1.2 → 1
- Background: flash error-500/10 (200ms)
- Border: error-500 with glow

**Keyframes:**

```
0%:   translateX(0)
15%:  translateX(10px)
30%:  translateX(-10px)
45%:  translateX(8px)
60%:  translateX(-8px)
75%:  translateX(4px)
90%:  translateX(-4px)
100%: translateX(0)
```

### 23.2 Error Icon Pulse

**Purpose:** Emphasize error state  
**Trigger:** Error appears  
**Duration:** 400ms  
**Easing:** ease-out

**Animation:**

- Icon (X or alert): scale 0 → 1.3 → 1
- Rotation: 90deg → 0deg
- Color: pulses error-500
- Glow: error glow appears
- Container: brief red border flash

### 23.3 Error Message Slide Down

**Purpose:** Display error description  
**Trigger:** Validation fails  
**Duration:** 300ms  
**Easing:** ease-out

**Animation:**

- Height: 0 → auto (use max-height technique)
- Opacity: 0 → 1
- TranslateY: -10px → 0
- Error icon: appears first (see 23.2)
- Text follows: delay 100ms

---

## 24. Empty State Animations

### 24.1 Empty State Illustration

**Purpose:** Friendly empty state presentation  
**Trigger:** No data to display  
**Duration:** 800ms  
**Easing:** ease-elegant

**Animation:**

- Illustration: scale 0.8 → 1, opacity 0 → 1
- Float animation (continuous): translateY(0 → -10px → 0), duration 3000ms, ease-in-out, infinite
- Heading: fade in with delay 200ms
- Description: fade in with delay 400ms
- CTA button: fade in with delay 600ms

### 24.2 Empty State to Content Transition

**Purpose:** Smooth transition when data appears  
**Trigger:** First item added  
**Duration:** 600ms  
**Easing:** ease-smooth

**Empty State:**

- Opacity: 1 → 0
- Scale: 1 → 0.9
- Duration: 300ms

**Content:**

- Opacity: 0 → 1
- TranslateY: 20px → 0
- Scale: 0.95 → 1
- Delay: 200ms
- Items stagger in (stagger-sm)

---

## 25. Mobile Gesture Animations

### 25.1 Pull to Refresh

**Purpose:** Refresh content on mobile  
**Trigger:** User pulls down from top  
**Duration:** Variable (gesture-driven), snap: 400ms  
**Spring:** spring-responsive

**Pull Animation:**

- Content: translateY follows finger (0 to max 120px)
- Resistance increases after 80px
- Spinner rotates proportional to pull distance
- Opacity increases: 0 → 1 as user pulls

**Release (trigger refresh):**

- Content: spring back to translateY(60px)
- Spinner: full rotation animation begins
- After refresh: content springs to translateY(0)

**Release (cancel):**

- Content: springs back to translateY(0)
- Spinner: fades out
- Duration: 300ms

### 25.2 Swipe to Delete

**Purpose:** Remove item via swipe gesture  
**Trigger:** User swipes list item left  
**Duration:** Variable (gesture), confirm: 400ms  
**Easing:** ease-out

**Swipe Animation:**

- Item: translateX follows finger
- Delete button reveals underneath
- Background: shifts to error-500/20
- Delete icon opacity increases with swipe distance

**Confirm Delete:**

- Item: translateX continues to -100% (400ms)
- Opacity: 1 → 0
- Height: collapses to 0 (300ms)
- Items below: shift up smoothly

**Cancel (incomplete swipe):**

- Item: springs back to translateX(0)
- Spring: spring-snappy
- Duration: 300ms

### 25.3 Swipe Between Views

**Purpose:** Navigate between tabs/pages  
**Trigger:** Horizontal swipe on mobile  
**Duration:** Variable (gesture), snap: 350ms  
**Easing:** ease-smooth

**Gesture Animation:**

- Current view: translateX follows finger
- Next view: slides in from right/left
- Parallax: next view moves slower (0.7x speed)
- Opacity: current view fades slightly (1 → 0.8)

**Snap to Next:**

- Views: spring to final position
- Duration: 350ms
- Spring: spring-responsive

**Snap Back:**

- Views: return to original
- Duration: 300ms

### 25.4 Bottom Sheet Drag

**Purpose:** Expand/collapse bottom sheet  
**Trigger:** User drags handle  
**Duration:** Variable (gesture), snap: 400ms  
**Spring:** spring-gentle

**Drag Animation:**

- Sheet: translateY follows finger (with resistance)
- Backdrop: opacity changes with position
- Resistance: increases near boundaries

**Snap Points:**

- Collapsed: 80px from bottom
- Half: 50% screen height
- Full: 90% screen height
- Dismissed: 100% (off-screen)

**Snap Animation:**

- Spring to nearest snap point
- Duration: 400ms
- Backdrop adjusts opacity

---

## 26. Accessibility Motion Rules

### 26.1 Prefers Reduced Motion

When user has enabled reduced motion preferences:

**Disable Completely:**

- All decorative animations (glows, particles, confetti)
- Background animations and ambient effects
- Continuous loops (pulses, spins >3s)
- Parallax effects
- Automatic carousels

**Reduce to Instant:**

- Page transitions: 0ms (instant)
- Modal open/close: 0ms
- All hover states: 0ms
- Tooltips: 0ms

**Keep with Reduced Duration:**

- Loading spinners: keep but reduce to 50ms (visible but brief)
- Success/error feedback: 100ms (critical feedback preserved)
- Focus indicators: 50ms (accessibility requirement)
- Skeleton screens: crossfade only, 100ms

**Implementation:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Preserve critical feedback */
  [data-critical-animation='true'] {
    animation-duration: 100ms !important;
    transition-duration: 100ms !important;
  }
}
```

### 26.2 Focus Visible Animations

**Purpose:** Indicate keyboard focus clearly  
**Trigger:** Keyboard navigation (Tab)  
**Duration:** 200ms  
**Easing:** ease-out

**Animation:**

- Outline appears: 2px solid primary-500
- Outline offset: 2px
- Box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2)
- Scale: 1 → 1.02 (subtle)

**Never animate out focus:**

- Focus ring disappears instantly on blur (0ms)
- Focus changes are instant between elements

### 26.3 Skip Animation Controls

Allow users to disable animations via settings:

**Settings Toggle:**

```typescript
// User preference
animationLevel: 'full' | 'reduced' | 'minimal'

full:     All animations enabled
reduced:  Decorative disabled, functional at 50% duration
minimal:  Only critical feedback (100ms max)
```

**Apply Globally:**

- Store in user preferences
- Add data attribute to body: `data-animation-level="reduced"`
- CSS and JS respect this setting

---

## 27. Performance Rules

### 27.1 GPU Acceleration

**Always Use Transform and Opacity:**

```css
/* ✅ Good - GPU accelerated */
transform: translate3d(0, 10px, 0);
opacity: 0.5;
filter: blur(4px);

/* ❌ Bad - Forces layout/paint */
top: 10px;
margin-top: 10px;
width: 100px;
height: 100px;
```

**Force GPU Layer:**

```css
.animated-element {
  will-change: transform, opacity;
  /* Remove will-change after animation */
}
```

### 27.2 Animation Budgets

**Per-Frame Budget: 16.67ms (60fps)**

**Budget Allocation:**

- JavaScript: <3ms per frame
- Style calculations: <2ms
- Layout: <2ms (ideally 0 - avoid layout thrashing)
- Paint: <5ms
- Composite: <4ms

**Limits:**

- Maximum 5 complex animations simultaneously
- Stagger limit: 50ms per item
- Total stagger duration: <1000ms
- Infinite loops: max 3 on screen

### 27.3 Optimize Techniques

**Use CSS Animations for Loops:**

```css
/* CSS is more efficient than JS for repeated animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

**Use Framer Motion Optimization:**

```typescript
// Optimize layout animations
<motion.div
  layout="position"  // Only animate position, not size
  layoutId="unique"  // Share element across components
/>

// Use hardware acceleration hint
<motion.div
  style={{
    transform: 'translateZ(0)',  // Force GPU layer
  }}
/>
```

**Debounce Scroll Animations:**

```typescript
// Don't animate every scroll event
const handleScroll = debounce(() => {
  // Animation logic
}, 100);
```

**Lazy Load Animations:**

```typescript
// Only animate elements in viewport
const isInView = useInView(ref, { once: true });

return (
  <motion.div
    ref={ref}
    initial={{ opacity: 0 }}
    animate={isInView ? { opacity: 1 } : {}}
  />
);
```

### 27.4 Performance Monitoring

**Monitor Frame Rate:**

```typescript
// Check if animations are causing drops
const fps = useFPS();

if (fps < 45) {
  // Disable decorative animations
  setAnimationLevel('reduced');
}
```

**Use Performance API:**

```typescript
performance.mark('animation-start');
// ... animation code
performance.mark('animation-end');
performance.measure('animation', 'animation-start', 'animation-end');
```

**DevTools Profiling:**

- Use Chrome DevTools Performance tab
- Record during animations
- Look for long tasks (>50ms)
- Identify layout thrashing
- Check paint areas

### 27.5 Reduce Motion Automatically

**Detect Device Capability:**

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isLowPerformance = navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;

const shouldReduceMotion = prefersReducedMotion || isLowPerformance;
```

---

## Implementation Guidelines

### Framer Motion Variant Patterns

**Standard Fade In:**

```typescript
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: [0, 0, 0.2, 1] },
};
```

**Slide Up:**

```typescript
const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
};
```

**Scale Bounce:**

```typescript
const scaleBounce = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
  exit: { scale: 0.9, opacity: 0 },
};
```

**Stagger Container:**

```typescript
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};
```

**Modal Variants:**

```typescript
const modalBackdrop = {
  initial: { opacity: 0, backdropFilter: 'blur(0px)' },
  animate: {
    opacity: 1,
    backdropFilter: 'blur(20px)',
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.2, delay: 0.1 },
  },
};

const modalContent = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.25 },
  },
};
```

### CSS Animation Patterns

**Pulse Glow:**

```css
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
}

.pulse-element {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

**Shimmer Loading:**

```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  background-size: 1000px 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

**Spin:**

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

### TypeScript Animation Utilities

**Animation Configuration:**

```typescript
// lib/animations/config.ts

export const DURATION = {
  instant: 0,
  immediate: 50,
  fast: 150,
  normal: 250,
  moderate: 350,
  comfortable: 500,
  slow: 700,
  deliberate: 1000,
} as const;

export const STAGGER = {
  xs: 20,
  sm: 40,
  md: 60,
  lg: 100,
  xl: 150,
} as const;

export const EASING = {
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  smooth: [0.25, 0.1, 0.25, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  snappy: [0.4, 0, 0, 1],
  elegant: [0.16, 1, 0.3, 1],
  dramatic: [0.87, 0, 0.13, 1],
} as const;

export const SPRING = {
  gentle: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 15,
    mass: 1,
  },
  responsive: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 25,
    mass: 0.5,
  },
  snappy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 30,
    mass: 0.5,
  },
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 15,
    mass: 0.8,
  },
  elastic: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 12,
    mass: 1.2,
  },
} as const;
```

**Reusable Variants:**

```typescript
// lib/animations/variants.ts

import { Variants } from 'framer-motion';
import { DURATION, EASING, STAGGER } from './config';

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: DURATION.normal / 1000, ease: EASING.easeOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast / 1000 },
  },
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.comfortable / 1000, ease: EASING.elegant },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: DURATION.normal / 1000 },
  },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.normal / 1000, ease: EASING.smooth },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: DURATION.fast / 1000 },
  },
};

export const staggerContainer = (delayChildren = STAGGER.sm): Variants => ({
  animate: {
    transition: {
      staggerChildren: delayChildren / 1000,
      delayChildren: 0.1,
    },
  },
});

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal / 1000, ease: EASING.easeOut },
  },
};
```

**Animation Hooks:**

```typescript
// lib/hooks/use-animation-settings.ts

import { useEffect, useState } from 'react';

export type AnimationLevel = 'full' | 'reduced' | 'minimal';

export function useAnimationSettings() {
  const [level, setLevel] = useState<AnimationLevel>('full');

  useEffect(() => {
    // Check system preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setLevel('minimal');
    }

    // Check user preference from localStorage/settings
    const userPref = localStorage.getItem('animationLevel') as AnimationLevel;
    if (userPref) {
      setLevel(userPref);
    }
  }, []);

  const getDuration = (baseDuration: number): number => {
    switch (level) {
      case 'minimal':
        return Math.min(baseDuration * 0.1, 100);
      case 'reduced':
        return baseDuration * 0.5;
      case 'full':
        return baseDuration;
    }
  };

  const shouldAnimate = (type: 'decorative' | 'functional'): boolean => {
    if (level === 'minimal') return type === 'functional';
    return true;
  };

  return { level, setLevel, getDuration, shouldAnimate };
}
```

```typescript
// lib/hooks/use-in-view-animation.ts

import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useInViewAnimation(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3,
    ...options,
  });

  return { ref, isInView };
}
```

---

## Animation Checklist

Before implementing any animation, verify:

### Purpose & UX

- [ ] Animation serves a clear functional purpose
- [ ] Animation enhances user understanding
- [ ] Animation doesn't block critical functionality
- [ ] Animation duration feels appropriate for context

### Performance

- [ ] Uses only transform and opacity (or filter for blur)
- [ ] No layout-triggering properties (width, height, margin, top, left)
- [ ] Tested on low-end devices
- [ ] Frame rate stays above 45fps
- [ ] No more than 5 complex animations simultaneous

### Accessibility

- [ ] Respects prefers-reduced-motion
- [ ] Critical information not communicated through motion alone
- [ ] Animation can be disabled in settings
- [ ] Keyboard navigation not disrupted
- [ ] Focus indicators remain clear

### Consistency

- [ ] Uses motion tokens from this document
- [ ] Follows established patterns for similar interactions
- [ ] Easing curve appropriate for context
- [ ] Duration matches similar animations in platform

### Code Quality

- [ ] Animation is reusable (variant or utility)
- [ ] TypeScript types are defined
- [ ] Cleanup on unmount (cancel animations)
- [ ] No memory leaks from infinite loops
- [ ] Tested across browsers

---

## Version History

**Version 1.0** - Initial release

- Complete motion design system
- All component animations defined
- Performance and accessibility rules established
- Implementation patterns documented

---

## Maintenance

This document should be updated when:

- New animation patterns are needed
- Performance benchmarks change
- Accessibility requirements evolve
- User feedback indicates motion issues
- New components are added to the design system

All changes must maintain consistency with the core motion philosophy and existing patterns.

---

**End of Motion Design System**
