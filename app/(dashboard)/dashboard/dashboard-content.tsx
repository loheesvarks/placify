/**
 * Dashboard Content Component (Client)
 * Main dashboard interface with stats, progress, and quick actions
 * Matches reference design
 */

'use client';

import React from 'react';
import {
  TrendingUp,
  Flame,
  Target,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  Map,
  Users,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { GlassCard } from '@/components/ui/glass-card';
import { StatCard } from '@/components/dashboard';
import { PageContainer, PageSection, PageGrid } from '@/components/ui/page-container';

interface DashboardContentProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function DashboardContent({ user }: DashboardContentProps) {
  const greeting = getGreeting();

  return (
    <DashboardLayout user={user}>
      <PageContainer>
        {/* Welcome Header */}
        <div className="mb-8">
          <p className="text-sm text-white/60">
            {greeting}, {user.name}! 👋
          </p>
          <h1 className="mt-2 text-4xl font-bold">
            <span className="text-white">Let&apos;s </span>
            <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
              grow
            </span>
            <span className="text-white"> your future</span>
          </h1>
          <p className="mt-2 text-white/60">
            Every skill you build today, lights another branch towards your dream career.
          </p>
        </div>

        {/* Role Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-lg border border-primary-500/30 bg-primary-500/10 px-3 py-1.5">
          <Sparkles className="h-4 w-4 text-primary-400" />
          <span className="text-sm font-medium text-primary-400">Machine Learning Engineer</span>
        </div>

        {/* Stats Grid */}
        <PageSection className="mb-8">
          <PageGrid cols={4} gap="md">
            <StatCard
              icon={TrendingUp}
              iconColor="text-purple-400"
              title="Today's Progress"
              value="2.4"
              subtitle="hrs"
              progress={80}
              progressLabel="of 3 hrs planned"
            />

            <StatCard
              icon={Flame}
              iconColor="text-orange-400"
              title="Current Streak"
              value="12"
              subtitle="days"
              trend={{ value: 20, label: 'Keep it up! 🔥', direction: 'up' }}
            />

            <StatCard
              icon={Target}
              iconColor="text-blue-400"
              title="Weekly Goal"
              value="8.5"
              subtitle="/ 12 hrs"
              progress={71}
              progressLabel="71% completed"
            />

            <StatCard
              icon={Sparkles}
              iconColor="text-green-400"
              title="Skills Learned"
              value="24"
              subtitle="/ 68"
              progress={35}
            />
          </PageGrid>
        </PageSection>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="space-y-6 lg:col-span-2">
            {/* Continue Learning */}
            <PageSection title="Continue Learning" action={<ActionLink>Resume</ActionLink>}>
              <GlassCard variant="elevated" padding="lg" hover>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20" />
                    <div className="absolute inset-2 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-600">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      Machine Learning Fundamentals
                    </h3>
                    <p className="mt-1 text-sm text-white/60">Linear Regression</p>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                            style={{ width: '65%' }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-white/70">65%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60">Next: Cost Function</p>
                    <div className="mt-1 flex items-center gap-1 text-sm text-white/50">
                      <Clock className="h-3 w-3" />
                      <span>30 min</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </PageSection>

            {/* Upcoming Tasks */}
            <PageSection title="Upcoming Tasks" action={<ActionLink>View all</ActionLink>}>
              <div className="space-y-3">
                <TaskItem
                  title="Complete Python Basics"
                  time="Today, 6:00 PM"
                  status="pending"
                />
                <TaskItem
                  title="Data Structures Practice"
                  time="Tomorrow, 10:00 AM"
                  status="pending"
                />
                <TaskItem
                  title="ML Quiz"
                  time="Tomorrow, 6:00 PM"
                  status="pending"
                />
              </div>
            </PageSection>

            {/* Recent Activity */}
            <PageSection title="Recent Activity" action={<ActionLink>View all</ActionLink>}>
              <div className="space-y-3">
                <ActivityItem
                  icon={CheckCircle2}
                  iconColor="text-success-400"
                  title="Completed Linear Regression lesson"
                  time="2 hrs ago"
                />
                <ActivityItem
                  icon={CheckCircle2}
                  iconColor="text-purple-400"
                  title="Solved 15 coding problems"
                  time="5 hrs ago"
                />
                <ActivityItem
                  icon={CheckCircle2}
                  iconColor="text-blue-400"
                  title="Completed Data Structures quiz"
                  time="Yesterday"
                />
                <ActivityItem
                  icon={Clock}
                  iconColor="text-orange-400"
                  title="Studied for 2.5 hours"
                  time="Yesterday"
                />
              </div>
            </PageSection>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <PageSection title="Quick Actions">
              <div className="space-y-3">
                <QuickActionCard
                  icon={Map}
                  title="AI Roadmap"
                  description="Plan your path"
                  iconColor="text-purple-400"
                  href="/roadmap"
                />
                <QuickActionCard
                  icon={Users}
                  title="AI Mentor"
                  description="Ask anything"
                  iconColor="text-blue-400"
                  href="/mentor"
                />
                <QuickActionCard
                  icon={MessageSquare}
                  title="Mock Interview"
                  description="Practice now"
                  iconColor="text-green-400"
                  href="/interviews"
                />
                <QuickActionCard
                  icon={FileText}
                  title="Resume Builder"
                  description="Create resume"
                  iconColor="text-orange-400"
                  href="/resume"
                />
              </div>
            </PageSection>

            {/* Learning Insights */}
            <PageSection title="Learning Insights">
              <GlassCard variant="elevated" padding="lg">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Study Time</span>
                      <span className="text-sm font-medium text-white">This week</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">14.5</span>
                      <span className="text-sm text-white/60">hrs</span>
                    </div>
                    <p className="mt-1 text-xs text-success-500">+ 10% from last week</p>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Problems Solved</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">47</span>
                    </div>
                    <p className="mt-1 text-xs text-success-500">+ 18% from last week</p>
                  </div>
                </div>
              </GlassCard>
            </PageSection>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-12 text-center">
          <p className="text-sm italic text-white/40">
            &quot;The best way to predict your future is to create it.&quot;
            <span className="ml-2">— Abraham Lincoln</span>
          </p>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}

// Helper Components

function ActionLink({ children }: { children: React.ReactNode }) {
  return (
    <button className="group flex items-center gap-1 text-sm font-medium text-primary-400 transition-colors hover:text-primary-300">
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

interface TaskItemProps {
  title: string;
  time: string;
  status: 'pending' | 'completed';
}

function TaskItem({ title, time, status }: TaskItemProps) {
  return (
    <GlassCard variant="elevated" padding="md" hover interactive>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
            status === 'completed'
              ? 'border-success-500 bg-success-500/20'
              : 'border-white/30'
          }`}
        >
          {status === 'completed' && <CheckCircle2 className="h-3 w-3 text-success-500" />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{title}</p>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-white/50">
            <Clock className="h-3 w-3" />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

interface ActivityItemProps {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  time: string;
}

function ActivityItem({ icon: Icon, iconColor, title, time }: ActivityItemProps) {
  return (
    <GlassCard variant="subtle" padding="sm" hover>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/5">
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-white/80">{title}</p>
          <p className="text-xs text-white/40">{time}</p>
        </div>
      </div>
    </GlassCard>
  );
}

interface QuickActionCardProps {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  href: string;
}

function QuickActionCard({ icon: Icon, iconColor, title, description }: QuickActionCardProps) {
  return (
    <GlassCard variant="elevated" padding="md" hover interactive>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-white/50">{description}</p>
        </div>
        <ArrowRight className="h-4 w-4 flex-shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5" />
      </div>
    </GlassCard>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
