/**
 * Navigation configuration
 * Centralized navigation structure and metadata
 */

import { ROUTES } from '@/lib/constants';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  disabled?: boolean;
  external?: boolean;
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/**
 * Main navigation items
 * Currently minimal - will be expanded as dashboard features are built
 */
export const MAIN_NAV: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    description: 'Your personalized dashboard',
  },
];

/**
 * Footer navigation sections
 */
export const FOOTER_NAV: NavSection[] = [
  {
    title: 'Product',
    items: [
      {
        label: 'Dashboard',
        href: ROUTES.DASHBOARD,
      },
    ],
  },
  {
    title: 'Legal',
    items: [
      {
        label: 'Privacy',
        href: '/privacy',
        disabled: true,
      },
      {
        label: 'Terms',
        href: '/terms',
        disabled: true,
      },
    ],
  },
];

/**
 * Auth navigation items
 */
export const AUTH_NAV: NavItem[] = [
  {
    label: 'Sign In',
    href: ROUTES.LOGIN,
  },
  {
    label: 'Sign Up',
    href: ROUTES.REGISTER,
  },
];
