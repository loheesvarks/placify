/**
 * Custom React Hooks for Placify
 * Clean component interface: Component → Hook → Service → Server Action → Supabase
 */

export { useToast, ToastProvider } from './use-toast';
export type { Toast, ToastVariant } from './use-toast';

export { useAuth } from './use-auth';
export type { UseAuthReturn } from './use-auth';

export { useUser } from './use-user';
export type { UseUserReturn } from './use-user';

export { useDashboard } from './use-dashboard';
export type { UseDashboardReturn } from './use-dashboard';

export { useSidebar } from './use-sidebar';
export type { UseSidebarReturn } from './use-sidebar';

export { useTheme } from './use-theme';
export type { UseThemeReturn } from './use-theme';
