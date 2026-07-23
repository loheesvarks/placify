import * as React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface BreadcrumbItem {
  /**
   * Label for the breadcrumb item
   */
  label: string;
  /**
   * URL for navigation (optional for current page)
   */
  href?: string;
  /**
   * Icon to display before label
   */
  icon?: React.ReactNode;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Array of breadcrumb items
   */
  items: BreadcrumbItem[];
  /**
   * Custom separator element
   */
  separator?: React.ReactNode;
  /**
   * Show home icon for first item
   * @default false
   */
  showHomeIcon?: boolean;
  /**
   * Maximum items to display before collapsing
   * @default undefined (no collapse)
   */
  maxItems?: number;
  /**
   * Items to show at start when collapsed
   * @default 1
   */
  itemsBeforeCollapse?: number;
  /**
   * Items to show at end when collapsed
   * @default 2
   */
  itemsAfterCollapse?: number;
}

/**
 * Breadcrumb navigation component
 * Supports responsive overflow handling and current page indication
 * Fully accessible with ARIA attributes
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      className,
      items,
      separator,
      showHomeIcon = false,
      maxItems,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 2,
      ...props
    },
    ref
  ) => {
    const shouldCollapse = maxItems !== undefined && items.length > maxItems;

    const displayItems = React.useMemo(() => {
      if (!shouldCollapse) return items;

      const startItems = items.slice(0, itemsBeforeCollapse);
      const endItems = items.slice(-itemsAfterCollapse);

      return [...startItems, { label: '...', href: undefined }, ...endItems];
    }, [items, shouldCollapse, itemsBeforeCollapse, itemsAfterCollapse]);

    const defaultSeparator = (
      <ChevronRight className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
    );

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('flex items-center', className)}
        {...props}
      >
        <ol className="flex items-center gap-2 text-body-sm">
          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;
            const isCurrent = isLast;
            const isCollapsed = item.label === '...';

            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {isCollapsed ? (
                  <span className="text-text-tertiary">...</span>
                ) : item.href && !isCurrent ? (
                  <a
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 text-text-secondary transition-colors duration-fast',
                      'hover:text-primary-400',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background rounded',
                      'px-1 -mx-1'
                    )}
                  >
                    {index === 0 && showHomeIcon ? (
                      <Home className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      item.icon && (
                        <span className="inline-flex" aria-hidden="true">
                          {item.icon}
                        </span>
                      )
                    )}
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <span
                    className={cn(
                      'flex items-center gap-1.5',
                      isCurrent
                        ? 'font-medium text-text-primary'
                        : 'text-text-secondary'
                    )}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {index === 0 && showHomeIcon ? (
                      <Home className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      item.icon && (
                        <span className="inline-flex" aria-hidden="true">
                          {item.icon}
                        </span>
                      )
                    )}
                    <span>{item.label}</span>
                  </span>
                )}

                {!isLast && (
                  <span className="flex items-center" aria-hidden="true">
                    {separator || defaultSeparator}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';
