/**
 * Page Container Component
 * Provides consistent layout structure for dashboard pages
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl', className)}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-6 flex items-start justify-between', className)}>
      <div>
        <h1 className="text-h1 font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-body-md text-white/60">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface PageSectionProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageSection({
  title,
  description,
  action,
  children,
  className,
}: PageSectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || action) && (
        <div className="flex items-start justify-between">
          <div>
            {title && (
              <h2 className="text-h3 font-semibold text-white">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-body-sm text-white/60">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}

interface PageGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PageGrid({
  children,
  cols = 3,
  gap = 'md',
  className,
}: PageGridProps) {
  return (
    <div
      className={cn(
        'grid',
        cols === 1 && 'grid-cols-1',
        cols === 2 && 'grid-cols-1 md:grid-cols-2',
        cols === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        cols === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        gap === 'sm' && 'gap-3',
        gap === 'md' && 'gap-4',
        gap === 'lg' && 'gap-6',
        className
      )}
    >
      {children}
    </div>
  );
}
