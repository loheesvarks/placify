/**
 * Dashboard Content Component
 * Complete visual reconstruction matching reference image
 * PLAC-014: Reference-driven dashboard with Career Orbit
 */

'use client';

import React from 'react';
import { ArrowRight, PlayCircle, BookOpen } from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import {
  StatCard,
  CareerOrbit,
  FocusTimer,
  UpcomingPanel,
  QuickActions,
  ContinueLearning,
  Recommendations,
  WeeklyActivityChart,
  SkillDistributionChart,
  MotivationCard,
  EmptyCareerOrbit,
  EmptyContinueLearning,
  EmptyUpcoming,
  EmptyRecommendations,
  EmptySkillDistribution,
} from '@/components/dashboard';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { useDashboardData } from '@/lib/hooks/use-dashboard-data';

interface DashboardContentProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function DashboardContent({ user }: DashboardContentProps) {
  const greeting = getGreeting();
  
  // Get all dashboard data with loading state
  const {
    isLoading,
    skills,
    stats,
    upcomingTasks,
    currentCourse,
    recommendations,
    weeklyActivity,
    skillDistribution,
  } = useDashboardData();

  // Show loading skeleton
  if (isLoading) {
    return (
      <DashboardLayout user={user}>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      {/* Hero Section with Career Orbit */}
      <section className="relative -mt-6 mb-8">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(420px,0.9fr)_minmax(500px,1.1fr)] gap-8 items-center">
            {/* Left side - Hero text */}
            <div className="relative z-10 py-8">
              <p className="text-base text-white/60 mb-3">
                {greeting}, {user.name}! 👋
              </p>
              <h1 className="text-6xl font-bold leading-[1.1] mb-5">
                <span className="text-white">Where will you </span>
                <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  grow
                </span>
                <span className="text-white"> today?</span>
              </h1>
              <p className="text-white/60 text-lg mb-8 max-w-md leading-relaxed">
                Focus + Consistency + Curiosity
                <br />
                That&apos;s your formula.
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-4">
                <Button variant="primary" size="lg" className="text-base px-6 py-6">
                  Continue Learning
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <button
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm"
                  aria-label="Quick action"
                >
                  <PlayCircle className="h-6 w-6 text-white/80" />
                </button>
              </div>
            </div>

            {/* Right side - Career Orbit */}
            <div className="relative h-[500px]">
              {skills.length > 0 ? (
                <CareerOrbit skills={skills} className="h-full" />
              ) : (
                <EmptyCareerOrbit />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Row */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon="clock"
            iconColor="text-purple-400"
            title="Learning Time"
            value={stats.learningTime.value.toString()}
            subtitle={stats.learningTime.unit}
            description={stats.learningTime.label}
            trend={stats.learningTime.trend}
            chart
          />

          <StatCard
            icon="trending-up"
            iconColor="text-blue-400"
            title="Weekly Progress"
            value={`${stats.weeklyProgress.value}%`}
            subtitle=""
            description={stats.weeklyProgress.label}
            progress={stats.weeklyProgress.value}
          />

          <StatCard
            icon="target"
            iconColor="text-green-400"
            title="Skills Mastered"
            value={stats.skillsMastered.current.toString()}
            subtitle={`/ ${stats.skillsMastered.total}`}
            description={stats.skillsMastered.trend?.label}
            progress={(stats.skillsMastered.current / stats.skillsMastered.total) * 100}
          />

          <StatCard
            icon="sparkles"
            iconColor="text-cyan-400"
            title="XP Earned"
            value={stats.xpEarned.value.toLocaleString()}
            subtitle=""
            description={stats.xpEarned.trend?.label}
            chart
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)] gap-6">
          {/* Left Column - wider */}
          <div className="space-y-6">
            {/* Continue Learning */}
            {currentCourse ? (
              <ContinueLearning course={currentCourse} />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-400" />
                    Continue Learning
                  </h3>
                </div>
                <EmptyContinueLearning />
              </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 ? (
              <Recommendations recommendations={recommendations} />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recommended for you</h3>
                </div>
                <EmptyRecommendations />
              </div>
            )}

            {/* Motivation Card - always show */}
            <MotivationCard />

            {/* Weekly Activity Chart */}
            <WeeklyActivityChart data={weeklyActivity} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Focus Timer - always show */}
            <FocusTimer />

            {/* Upcoming Tasks */}
            {upcomingTasks.length > 0 ? (
              <UpcomingPanel tasks={upcomingTasks} />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Upcoming</h3>
                </div>
                <EmptyUpcoming />
              </div>
            )}

            {/* Quick Actions - always show */}
            <QuickActions />

            {/* Skill Distribution */}
            {skillDistribution.length > 0 ? (
              <SkillDistributionChart data={skillDistribution} />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Skill Distribution</h3>
                </div>
                <EmptySkillDistribution />
              </div>
            )}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
