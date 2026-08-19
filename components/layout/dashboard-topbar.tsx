/**
 * Dashboard Topbar Component
 * Matches reference image topbar design with search, controls, and profile
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { Search, Sun, Moon, Bell, User, Settings, UserCircle, ChevronDown } from 'lucide-react';
import { useTheme } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { LogoutButton } from '@/components/auth/logout-button';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardTopbarProps {
  user?: {
    name?: string;
    role?: string;
    avatar?: string;
  };
}

export function DashboardTopbar({ user }: DashboardTopbarProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [hasNotifications] = React.useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0d1f]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search anything..."
              className={cn(
                'h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4',
                'text-sm text-white placeholder:text-white/40',
                'transition-all duration-200',
                'focus:border-primary-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary-500/50'
              )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/60">
                ⌘ K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              'border border-white/10 bg-white/5 transition-all duration-200',
              'hover:bg-white/10 hover:border-primary-500/30'
            )}
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="h-4 w-4 text-white/70" />
            ) : (
              <Sun className="h-4 w-4 text-white/70" />
            )}
          </button>

          {/* Notifications */}
          <button
            className={cn(
              'relative flex h-10 w-10 items-center justify-center rounded-lg',
              'border border-white/10 bg-white/5 transition-all duration-200',
              'hover:bg-white/10 hover:border-primary-500/30'
            )}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-white/70" />
            {hasNotifications && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary-500">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary-500 opacity-75" />
              </span>
            )}
          </button>

          {/* User Profile with Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={cn(
                'ml-2 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2',
                'cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-primary-500/30',
                isProfileMenuOpen && 'bg-white/10 border-primary-500/30'
              )}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-600">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || 'User'}
                    width={28}
                    height={28}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="hidden flex-col lg:flex">
                <span className="text-sm font-medium text-white">
                  {user?.name || 'Loheesvar KS'}
                </span>
                <span className="text-xs text-white/50">
                  {user?.role || 'ML Engineer'}
                </span>
              </div>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 text-white/50 transition-transform duration-200",
                  isProfileMenuOpen && "rotate-180"
                )} 
              />
            </button>
            
            {/* Dropdown Menu */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    'absolute right-0 top-full mt-2 w-56 z-50',
                    'bg-[#0a0d1f]/95 backdrop-blur-xl',
                    'border border-white/10 rounded-lg shadow-xl',
                    'py-2'
                  )}
                >
                  {/* Menu Items */}
                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5',
                      'text-sm text-white/80 hover:text-white',
                      'hover:bg-white/5 transition-colors'
                    )}
                  >
                    <UserCircle className="h-4 w-4 text-white/60" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5',
                      'text-sm text-white/80 hover:text-white',
                      'hover:bg-white/5 transition-colors'
                    )}
                  >
                    <Settings className="h-4 w-4 text-white/60" />
                    <span>Settings</span>
                  </button>

                  {/* Separator */}
                  <div className="my-2 h-px bg-white/10" />

                  {/* Logout Button */}
                  <div className="px-2">
                    <LogoutButton />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
