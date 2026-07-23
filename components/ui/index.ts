/**
 * Placify UI Component Library
 * 
 * Foundational UI components following the Placify design system.
 * All components are:
 * - Built with TypeScript for type safety
 * - Styled with Tailwind CSS using design tokens
 * - Animated with Framer Motion where appropriate
 * - Fully accessible (WCAG 2.1 AA compliant)
 * - Responsive across all breakpoints
 * - Production-ready with zero hardcoded values
 */

// Button Components
export {
  Button,
  buttonVariants,
  type ButtonProps,
} from './button';

// Input Components
export {
  Input,
  inputVariants,
  type InputProps,
} from './input';

// Card Components
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
  type CardProps,
} from './card';

// Badge Components
export {
  Badge,
  CountBadge,
  DotBadge,
  badgeVariants,
  countBadgeVariants,
  dotBadgeVariants,
  type BadgeProps,
  type CountBadgeProps,
  type DotBadgeProps,
} from './badge';

// Avatar Components
export {
  Avatar,
  AvatarGroup,
  avatarVariants,
  type AvatarProps,
  type AvatarGroupProps,
} from './avatar';

// Skeleton Components
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTable,
  skeletonVariants,
  type SkeletonProps,
  type SkeletonTextProps,
  type SkeletonAvatarProps,
  type SkeletonCardProps,
  type SkeletonTableProps,
} from './skeleton';

// Overlay Components
export {
  Portal,
  type PortalProps,
} from './portal';

export {
  Backdrop,
  type BackdropProps,
} from './backdrop';

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  type ModalProps,
} from './modal';

export {
  Dialog,
  type DialogProps,
} from './dialog';

export {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  type DrawerProps,
} from './drawer';

export {
  ToastContainer,
  ToastProvider,
  type ToastContainerProps,
} from './toast';

// Tabs Components
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps,
} from './tabs';

// Accordion Components
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
} from './accordion';

// Dropdown Components
export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  type DropdownProps,
  type DropdownTriggerProps,
  type DropdownContentProps,
  type DropdownItemProps,
  type DropdownSeparatorProps,
  type DropdownLabelProps,
} from './dropdown';

// Select Component
export {
  Select,
  type SelectProps,
  type SelectOption,
} from './select';

// Checkbox Component
export {
  Checkbox,
  type CheckboxProps,
} from './checkbox';

// Radio Group Component
export {
  RadioGroup,
  type RadioGroupProps,
  type RadioOption,
} from './radio-group';

// Switch Component
export {
  Switch,
  type SwitchProps,
} from './switch';

// Progress Components
export {
  Progress,
  CircularProgress,
  type ProgressProps,
  type CircularProgressProps,
} from './progress';

// Tooltip Component
export {
  Tooltip,
  type TooltipProps,
} from './tooltip';

// Popover Components
export {
  Popover,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  type PopoverProps,
  type PopoverHeaderProps,
  type PopoverBodyProps,
  type PopoverFooterProps,
} from './popover';

// Breadcrumb Component
export {
  Breadcrumb,
  type BreadcrumbProps,
  type BreadcrumbItem,
} from './breadcrumb';

// Pagination Component
export {
  Pagination,
  type PaginationProps,
} from './pagination';

// Empty State Component
export {
  EmptyState,
  type EmptyStateProps,
} from './empty-state';

// Divider Component
export {
  Divider,
  type DividerProps,
} from './divider';

// Spinner Components
export {
  Spinner,
  SpinnerOverlay,
  DotsSpinner,
  PulseSpinner,
  type SpinnerProps,
  type SpinnerOverlayProps,
  type DotsSpinnerProps,
  type PulseSpinnerProps,
} from './spinner';

// Utility Components
export {
  VisuallyHidden,
  type VisuallyHiddenProps,
} from './visually-hidden';
