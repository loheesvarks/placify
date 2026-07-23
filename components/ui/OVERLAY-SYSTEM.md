# Placify Overlay System Documentation

Complete implementation of Task PLAC-006: Global Overlay System

## Overview

The overlay system provides a comprehensive set of components for displaying content above the main application interface. All components follow the Placify design system with:

- ✅ Glass morphism effects with backdrop blur
- ✅ Smooth Framer Motion animations
- ✅ Focus trap and keyboard navigation
- ✅ SSR-safe implementation
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Responsive design (mobile-friendly)
- ✅ Proper z-index stacking

## Components

### 1. Portal

**Purpose:** Render overlays outside the root element for proper stacking.

**Features:**
- SSR-safe with hydration handling
- Renders to `document.body` by default
- Supports custom container

**Usage:**
```tsx
import { Portal } from '@/components/ui';

<Portal>
  <div>Content rendered outside root</div>
</Portal>
```

---

### 2. Backdrop

**Purpose:** Blurred background overlay with click-to-close support.

**Features:**
- Configurable blur amount
- Configurable opacity
- Smooth fade animation
- Click handler support

**Props:**
- `show: boolean` - Whether backdrop is visible
- `onClick?: () => void` - Click handler
- `blur?: number` - Blur amount in pixels (default: 20)
- `opacity?: number` - Background opacity (default: 0.5)
- `zIndex?: number` - Stacking order (default: 90)

**Usage:**
```tsx
import { Backdrop } from '@/components/ui';

<Backdrop 
  show={isOpen} 
  onClick={handleClose}
  blur={20}
  opacity={0.5}
/>
```

---

### 3. Modal

**Purpose:** Centered dialog with focus management and animations.

**Features:**
- Controlled and uncontrolled modes
- Multiple sizes (sm, md, lg, xl, full)
- Focus trap implemented
- ESC key closes modal
- Click outside to close (optional)
- Prevents background scroll
- Restores previous focus on close
- Glass morphism styling

**Props:**
- `open?: boolean` - Controlled open state
- `onOpenChange?: (open: boolean) => void` - State change callback
- `defaultOpen?: boolean` - Uncontrolled default state
- `size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'` - Modal size
- `closeOnClickOutside?: boolean` - Allow backdrop click to close (default: true)
- `closeOnEscape?: boolean` - Allow ESC to close (default: true)
- `showCloseButton?: boolean` - Show X button (default: true)
- `preventScroll?: boolean` - Prevent body scroll (default: true)
- `onClose?: () => void` - Close callback

**Sub-components:**
- `ModalHeader` - Header container with bottom border
- `ModalTitle` - Semantic h2 heading
- `ModalDescription` - Descriptive text
- `ModalBody` - Main content area
- `ModalFooter` - Footer with action buttons

**Usage:**
```tsx
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  Button,
} from '@/components/ui';

const [isOpen, setIsOpen] = useState(false);

<Modal open={isOpen} onOpenChange={setIsOpen} size="md">
  <ModalHeader>
    <ModalTitle>Modal Title</ModalTitle>
    <ModalDescription>
      Optional description text
    </ModalDescription>
  </ModalHeader>
  <ModalBody>
    <p>Modal content goes here</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={() => setIsOpen(false)}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>
```

**Keyboard Navigation:**
- `Tab` / `Shift+Tab` - Navigate between focusable elements (trapped)
- `Escape` - Close modal (if enabled)

**Accessibility:**
- `role="dialog"`
- `aria-modal="true"`
- Focus management and restoration
- Screen reader announcements

---

### 4. Dialog

**Purpose:** Pre-built modal with confirm/cancel pattern.

**Features:**
- Built on Modal component
- Standard confirm/cancel buttons
- Async confirm support with loading state
- Prevents close during loading
- Safer defaults (no click-outside close)

**Props:**
- All Modal props except `children` structure
- `title: string` - Dialog title (required)
- `description?: string` - Dialog description
- `children?: React.ReactNode` - Additional content
- `confirmText?: string` - Confirm button text (default: 'Confirm')
- `cancelText?: string` - Cancel button text (default: 'Cancel')
- `onConfirm?: () => void | Promise<void>` - Confirm handler
- `onCancel?: () => void` - Cancel handler
- `loading?: boolean` - External loading state
- `confirmVariant?: 'primary' | 'danger'` - Confirm button style
- `showCancel?: boolean` - Show cancel button (default: true)

**Usage:**
```tsx
import { Dialog, Button } from '@/components/ui';

const [isOpen, setIsOpen] = useState(false);

const handleConfirm = async () => {
  await saveChanges();
  setIsOpen(false);
};

<>
  <Button onClick={() => setIsOpen(true)}>Delete</Button>
  
  <Dialog
    open={isOpen}
    onOpenChange={setIsOpen}
    title="Confirm Deletion"
    description="This action cannot be undone."
    confirmText="Delete"
    cancelText="Cancel"
    confirmVariant="danger"
    onConfirm={handleConfirm}
  >
    <p>Additional warning content</p>
  </Dialog>
</>
```

---

### 5. Drawer

**Purpose:** Side panel or bottom sheet for secondary content.

**Features:**
- Three positions: left, right, bottom
- Smooth slide animations
- Mobile-friendly (bottom drawer)
- Configurable size
- Focus management
- Glass morphism effects

**Props:**
- `open?: boolean` - Controlled open state
- `onOpenChange?: (open: boolean) => void` - State change callback
- `defaultOpen?: boolean` - Uncontrolled default state
- `side?: 'left' | 'right' | 'bottom'` - Drawer position (default: 'right')
- `size?: string` - Width/height (default: '400px' for sides, '80vh' for bottom)
- `closeOnClickOutside?: boolean` - Allow backdrop click (default: true)
- `closeOnEscape?: boolean` - Allow ESC to close (default: true)
- `showCloseButton?: boolean` - Show X button (default: true)
- `preventScroll?: boolean` - Prevent body scroll (default: true)

**Sub-components:**
- `DrawerHeader` - Header container
- `DrawerTitle` - Semantic h2 heading
- `DrawerDescription` - Descriptive text
- `DrawerBody` - Main content area
- `DrawerFooter` - Footer with actions

**Usage:**
```tsx
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  Button,
} from '@/components/ui';

const [isOpen, setIsOpen] = useState(false);

<Drawer open={isOpen} onOpenChange={setIsOpen} side="right">
  <DrawerHeader>
    <DrawerTitle>Settings</DrawerTitle>
    <DrawerDescription>
      Manage your preferences
    </DrawerDescription>
  </DrawerHeader>
  <DrawerBody>
    <p>Settings form goes here</p>
  </DrawerBody>
  <DrawerFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={() => setIsOpen(false)}>
      Save
    </Button>
  </DrawerFooter>
</Drawer>
```

**Responsive Design:**
- Right/Left drawers: Full width on mobile, fixed width on desktop
- Bottom drawer: Optimized for mobile interactions

---

### 6. Toast

**Purpose:** Temporary notification system with auto-dismiss.

**Features:**
- Five variants: success, error, warning, info, loading
- Auto-dismiss with configurable duration
- Manual dismiss
- Queue management with max limit
- Progress timer
- Pause on hover
- Stacking with smooth animations
- Action button support

**Setup:**

1. Add `ToastProvider` to your app root:

```tsx
// app/layout.tsx
import { ToastProvider, ToastContainer } from '@/components/ui';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider maxToasts={5}>
          {children}
          <ToastContainer position="top-right" />
        </ToastProvider>
      </body>
    </html>
  );
}
```

2. Use the `useToast` hook:

```tsx
import { useToast } from '@/lib/hooks/use-toast';

function MyComponent() {
  const { success, error, warning, info, loading, update, dismiss } = useToast();

  const handleSave = async () => {
    const id = loading('Saving...', 'Please wait');
    
    try {
      await saveData();
      update(id, {
        variant: 'success',
        title: 'Saved!',
        description: 'Changes saved successfully',
        duration: 3000,
      });
    } catch (err) {
      update(id, {
        variant: 'error',
        title: 'Error',
        description: 'Failed to save changes',
        duration: 5000,
      });
    }
  };

  return (
    <div>
      <Button onClick={handleSave}>Save</Button>
      <Button onClick={() => success('Success!', 'Operation completed')}>
        Show Success
      </Button>
      <Button onClick={() => error('Error!', 'Something went wrong')}>
        Show Error
      </Button>
    </div>
  );
}
```

**Hook API:**

```tsx
const {
  // Show toast variants (returns toast ID)
  success: (title: string, description?: string) => string,
  error: (title: string, description?: string) => string,
  warning: (title: string, description?: string) => string,
  info: (title: string, description?: string) => string,
  loading: (title: string, description?: string) => string,
  
  // Custom toast
  toast: (props: Omit<Toast, 'id'>) => string,
  
  // Update existing toast
  update: (id: string, props: Partial<Toast>) => void,
  
  // Dismiss toast
  dismiss: (id: string) => void,
  
  // Current toasts
  toasts: Toast[],
} = useToast();
```

**Toast Props:**
```tsx
interface Toast {
  id: string;
  variant: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  description?: string;
  duration?: number; // milliseconds, 0 = no auto-dismiss
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**ToastContainer Props:**
- `position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'`

---

## Accessibility

All overlay components follow WCAG 2.1 AA guidelines:

### Keyboard Navigation
- **Tab/Shift+Tab:** Navigate between focusable elements
- **Escape:** Close overlay (when enabled)
- **Enter/Space:** Activate buttons and links

### Focus Management
- Focus is trapped within active overlay
- Previous focus is restored on close
- First focusable element receives focus on open
- Focus indicator is visible

### Screen Readers
- Proper ARIA roles (`dialog`, `alert`)
- `aria-modal="true"` for modals/drawers
- `aria-live` regions for toasts
- Descriptive labels and announcements

### Reduced Motion
All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Animation Specifications

Following Placify animations.md specifications:

### Modal
- **Open:** Opacity 0→1, Scale 0.9→1, Y 20px→0
- **Duration:** 350ms
- **Easing:** ease-smooth (cubic-bezier(0.25, 0.1, 0.25, 1))
- **Close:** Opacity 1→0, Scale 1→0.95, Y 0→10px
- **Duration:** 300ms

### Drawer
- **Right/Left:** TranslateX 100%→0 (or -100%→0)
- **Bottom:** TranslateY 100%→0
- **Duration:** 350ms (sides), 300ms (bottom)
- **Easing:** ease-smooth
- **Spring:** spring-responsive option

### Toast
- **Enter:** TranslateY/X 100%→0, Opacity 0→1, Scale 0.95→1
- **Duration:** 400ms
- **Spring:** spring-responsive
- **Exit:** TranslateX 0→100%, Opacity 1→0, Scale 1→0.9
- **Duration:** 300ms

### Backdrop
- **Fade In:** Opacity 0→1, Blur 0→20px
- **Duration:** 300ms
- **Easing:** ease-out

---

## Z-Index Stacking

Following design system z-index hierarchy:

- **Backdrop:** z-index: 90 (Overlay Layer)
- **Modal/Drawer:** z-index: 100 (Overlay Layer)
- **Toast:** z-index: 999 (Critical Layer)

---

## Performance

### Optimizations
- GPU-accelerated transforms (translateX, translateY, scale)
- Opacity animations only
- No layout thrashing
- Efficient re-renders with React.memo where appropriate
- Proper cleanup of timers and listeners

### Bundle Size
- Portal: ~1KB
- Backdrop: ~1.5KB
- Modal: ~4KB
- Dialog: ~2KB (uses Modal)
- Drawer: ~4KB
- Toast: ~5KB + Hook ~2KB
- **Total:** ~19.5KB (minified)

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All features work in modern browsers with full ES6+ support.

---

## Common Patterns

### Confirmation Dialog
```tsx
const ConfirmDialog = ({ onConfirm }: { onConfirm: () => void }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="danger">
        Delete
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Confirm Deletion"
        description="This cannot be undone"
        confirmVariant="danger"
        onConfirm={async () => {
          await onConfirm();
          setOpen(false);
        }}
      />
    </>
  );
};
```

### Form in Modal
```tsx
const FormModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitForm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <ModalTitle>Create Item</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Input label="Name" required />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
```

### Loading Toast Pattern
```tsx
const { loading, update } = useToast();

const performAction = async () => {
  const id = loading('Processing...', 'This may take a moment');
  
  try {
    await longRunningOperation();
    update(id, {
      variant: 'success',
      title: 'Complete!',
      duration: 3000,
    });
  } catch (error) {
    update(id, {
      variant: 'error',
      title: 'Failed',
      description: error.message,
      duration: 5000,
    });
  }
};
```

---

## Testing

### Unit Tests
Test focus management, keyboard navigation, and state changes.

### Integration Tests
Test interaction between multiple overlays (modal over drawer, etc.).

### Accessibility Tests
Use tools like axe-core, WAVE, or Lighthouse to verify compliance.

---

## Migration Guide

If you have existing modal/dialog code, follow this migration:

```tsx
// Before (custom implementation)
<div className="modal">
  <div className="backdrop" onClick={close} />
  <div className="content">
    {children}
  </div>
</div>

// After (Placify overlay system)
<Modal open={isOpen} onOpenChange={setIsOpen}>
  <ModalHeader>
    <ModalTitle>Title</ModalTitle>
  </ModalHeader>
  <ModalBody>
    {children}
  </ModalBody>
  <ModalFooter>
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </ModalFooter>
</Modal>
```

---

## Support

For issues or questions:
1. Check this documentation
2. Review examples in `overlay-examples.tsx`
3. Check design system specifications
4. Refer to Framer Motion documentation for animation details

---

**Implementation Status:** ✅ Complete (Task PLAC-006)

All acceptance criteria met:
- ✅ Modal with controlled/uncontrolled support
- ✅ ESC closes modal
- ✅ Click outside closes
- ✅ Focus trap implemented
- ✅ Restore previous focus on close
- ✅ Prevent background scroll
- ✅ Glass morphism styling
- ✅ Responsive sizing
- ✅ Framer Motion animations
- ✅ Respect prefers-reduced-motion
- ✅ Dialog with header/body/footer
- ✅ Confirm/Cancel pattern
- ✅ Drawer (left, right, bottom)
- ✅ Mobile-friendly bottom drawer
- ✅ Toast (success, error, warning, info, loading)
- ✅ Auto-dismiss
- ✅ Manual dismiss
- ✅ Queue support
- ✅ Progress timer
- ✅ Portal (SSR-safe)
- ✅ Backdrop with blur and fade
