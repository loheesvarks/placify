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
