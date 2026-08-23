/**
 * Dashboard Sidebar Component
 * Matches reference image sidebar design with glass morphism
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Map,
  Users,
  Code,
  BookOpen,
  FileText,
  MessageSquare,
  Briefcase,
  FolderKanban,
  TrendingUp,
  BarChart3,
  User,
  Settings,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  section?: string;
}

const navigationItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  
  // Learning Section
  { label: 'AI Roadmap', href: '/roadmap', icon: Map, section: 'LEARNING' },
  { label: 'AI Mentor', href: '/mentor', icon: Users, section: 'LEARNING' },
  { label: 'Coding Practice', href: '/practice', icon: Code, section: 'LEARNING' },
  { label: 'Courses', href: '/courses', icon: BookOpen, section: 'LEARNING' },
  
  // Career Section
  { label: 'Resume Builder', href: '/resume', icon: FileText, section: 'CAREER' },
  { label: 'Mock Interviews', href: '/interviews', icon: MessageSquare, section: 'CAREER' },
  { label: 'Job Tracker', href: '/jobs', icon: Briefcase, section: 'CAREER' },
  { label: 'Projects', href: '/projects', icon: FolderKanban, section: 'CAREER' },
  
  // Insights Section
  { label: 'Progress', href: '/progress', icon: TrendingUp, section: 'INSIGHTS' },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, section: 'INSIGHTS' },
  { label: 'Activity', href: '/activity', icon: BarChart3, section: 'INSIGHTS' },
  
  // Account Section
  { label: 'Profile', href: '/profile', icon: User, section: 'ACCOUNT' },
  { label: 'Settings', href: '/settings', icon: Settings, section: 'ACCOUNT' },
];

interface DashboardSidebarProps {
  collapsed?: boolean;
  onCollapse?: () => void;
}

export function DashboardSidebar({ collapsed = false, onCollapse }: DashboardSidebarProps) {
  const pathname = usePathname();

  const groupedItems = navigationItems.reduce((acc, item) => {
    const section = item.section || 'main';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex-col border-r border-white/10 transition-all duration-300',
        'bg-[#0a0d1f]/80 backdrop-blur-xl',
        collapsed ? 'w-20' : 'w-56',
        'flex'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-lg font-bold text-transparent">
              Placify
            </span>
          </Link>
        )}
        
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600">
            <span className="text-lg font-bold text-white">P</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {/* Main items (no section) */}
        {groupedItems.main?.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            collapsed={collapsed}
          />
        ))}

        {/* Sectioned items */}
        {Object.entries(groupedItems).map(([section, items]) => {
          if (section === 'main') return null;
          return (
            <div key={section} className="pt-4">
              {!collapsed && (
                <div className="px-3 pb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    {section}
                  </p>
                </div>
              )}
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  collapsed={collapsed}
                />
              ))}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section - User Streak */}
      {!collapsed && (
        <div className="border-t border-white/10 p-4">
          <div className="rounded-lg bg-white/5 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Keep going!</span>
              <span className="text-sm font-semibold text-white">🔥</span>
            </div>
            <div className="mt-2 text-xs text-white/50">
              You&apos;re on a{' '}
              <span className="font-semibold text-primary-400">12 day streak</span>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Button */}
      <button
        onClick={onCollapse}
        className={cn(
          'absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full',
          'border border-white/10 bg-[#0a0d1f] transition-transform hover:scale-110',
          collapsed && 'rotate-180'
        )}
      >
        <ChevronLeft className="h-4 w-4 text-white/70" />
      </button>
    </aside>
  );
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}

function NavLink({ item, isActive, collapsed }: NavLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
        isActive
          ? 'bg-primary-500/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]'
          : 'text-white/60 hover:bg-white/5 hover:text-white',
        collapsed && 'justify-center'
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary-500" />
      )}

      {/* Icon */}
      <Icon
        className={cn(
          'h-5 w-5 flex-shrink-0 transition-colors',
          isActive ? 'text-primary-400' : 'text-white/60 group-hover:text-white'
        )}
      />

      {/* Label */}
      {!collapsed && (
        <span className="text-sm font-medium transition-colors">{item.label}</span>
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-2 hidden rounded-md bg-neutral-900 px-2 py-1 text-xs text-white shadow-lg group-hover:block">
          {item.label}
        </div>
      )}
    </Link>
  );
}
