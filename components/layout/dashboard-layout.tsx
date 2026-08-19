/**
 * Dashboard Layout Component
 * Main layout shell with sidebar, topbar, and content area
 * Provides consistent structure for all dashboard pages
 */

'use client';

import React from 'react';
import { CosmicBackground } from './cosmic-background';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardTopbar } from './dashboard-topbar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string;
    role?: string;
    avatar?: string;
  };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Cosmic Background */}
      <CosmicBackground />

      {/* Sidebar */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          sidebarCollapsed ? 'pl-20' : 'pl-64'
        )}
      >
        {/* Topbar */}
        <DashboardTopbar user={user} />

        {/* Page Content */}
        <main className="flex-1">
          <div className="container-content py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
