import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Current page number (1-indexed)
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;
  /**
   * Number of page buttons to show on each side of current page
   * @default 1
   */
  siblingCount?: number;
  /**
   * Show first and last page buttons
   * @default true
   */
  showFirstLast?: boolean;
  /**
   * Whether pagination is disabled
   */
  disabled?: boolean;
}

/**
 * Pagination component with keyboard navigation
 * Supports ellipsis for large page counts
 * Fully accessible with ARIA attributes
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const paginationRange = React.useMemo(() => {
      const totalPageNumbers = siblingCount * 2 + 3; // siblings + current + first + last
      const totalPageBlocks = totalPageNumbers + 2; // including 2 ellipsis

      // If total pages is less than the pages we want to show, return range [1..totalPages]
      if (totalPageBlocks >= totalPages) {
        return range(1, totalPages);
      }

      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        const leftItemCount = 3 + 2 * siblingCount;
        const leftRange = range(1, leftItemCount);
        return [...leftRange, 'ellipsis-right', totalPages];
      }

      if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
        const rightItemCount = 3 + 2 * siblingCount;
        const rightRange = range(totalPages - rightItemCount + 1, totalPages);
        return [1, 'ellipsis-left', ...rightRange];
      }

      if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        const middleRange = range(leftSiblingIndex, rightSiblingIndex);
        return [1, 'ellipsis-left', ...middleRange, 'ellipsis-right', totalPages];
      }

      return [];
    }, [currentPage, totalPages, siblingCount]);

    const handlePageChange = (page: number) => {
      if (disabled || page < 1 || page > totalPages || page === currentPage) return;
      onPageChange(page);
    };

    const handlePrevious = () => {
      handlePageChange(currentPage - 1);
    };

    const handleNext = () => {
      handlePageChange(currentPage + 1);
    };

    const handleKeyDown = (event: React.KeyboardEvent, page: number) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handlePageChange(page);
      }
    };

    if (totalPages <= 1) {
      return null;
    }

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        className={cn('flex items-center justify-center gap-1', className)}
        {...props}
      >
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={disabled || currentPage === 1}
          aria-label="Go to previous page"
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-md',
            'text-text-secondary transition-colors duration-fast',
            'hover:bg-glass-background hover:text-text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent'
          )}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {paginationRange.map((pageNumber, index) => {
            const isEllipsis = typeof pageNumber === 'string';
            const isCurrent = pageNumber === currentPage;

            if (isEllipsis) {
              return (
                <span
                  key={`${pageNumber}-${index}`}
                  className="inline-flex h-9 w-9 items-center justify-center text-text-tertiary"
                  aria-hidden="true"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </span>
              );
            }

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber as number)}
                onKeyDown={(e) => handleKeyDown(e, pageNumber as number)}
                disabled={disabled || isCurrent}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md px-3',
                  'text-body-sm font-medium transition-colors duration-fast',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background',
                  isCurrent
                    ? 'bg-primary-500 text-white shadow-glow-sm cursor-default'
                    : 'text-text-secondary hover:bg-glass-background hover:text-text-primary',
                  disabled && !isCurrent && 'cursor-not-allowed opacity-50 hover:bg-transparent'
                )}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={disabled || currentPage === totalPages}
          aria-label="Go to next page"
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-md',
            'text-text-secondary transition-colors duration-fast',
            'hover:bg-glass-background hover:text-text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent'
          )}
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';

/**
 * Helper function to generate array of numbers in range
 */
function range(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
}
