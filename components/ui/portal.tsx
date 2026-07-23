import * as React from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  /**
   * Content to render in the portal
   */
  children: React.ReactNode;
  /**
   * Target container element or selector
   * Defaults to document.body
   */
  container?: Element | DocumentFragment | null;
}

/**
 * Portal component for rendering overlays outside the root element
 * SSR-safe with proper hydration handling
 */
export const Portal: React.FC<PortalProps> = ({ children, container }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Return null during SSR and initial render
  if (!mounted) return null;

  // Use provided container or default to document.body
  const target = container || (typeof document !== 'undefined' ? document.body : null);

  if (!target) return null;

  return createPortal(children, target);
};

Portal.displayName = 'Portal';
