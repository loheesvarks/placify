/**
 * Empty State Components
 * Friendly empty states for new users
 */

'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Target, 
  BookOpen, 
  Calendar,
  TrendingUp,
  Plus
} from 'lucide-react';

export function EmptyCareerOrbit() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="mb-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center">
            <Sparkles className="h-12 w-12 text-purple-400" />
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Your Career Orbit Awaits
      </h3>
      <p className="text-white/60 mb-6 max-w-sm">
        Start adding skills to visualize your learning journey. Each skill becomes a star in your orbit!
      </p>
      <Button variant="primary" size="lg">
        <Plus className="h-5 w-5 mr-2" />
        Add Your First Skill
      </Button>
    </div>
  );
}

export function EmptyContinueLearning() {
  return (
    <GlassCard variant="elevated" padding="lg">
      <div className="flex flex-col items-center text-center py-8">
        <div className="mb-4">
          <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <h4 className="text-lg font-semibold text-white mb-2">
          No Active Course
        </h4>
        <p className="text-sm text-white/60 mb-4 max-w-xs">
          Browse our course library and start learning something new today.
        </p>
        <Button variant="secondary" size="md">
          Explore Courses
        </Button>
      </div>
    </GlassCard>
  );
}

export function EmptyUpcoming() {
  return (
    <GlassCard variant="elevated" padding="md">
      <div className="flex flex-col items-center text-center py-6">
        <div className="mb-3">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <p className="text-sm font-medium text-white mb-1">
          No Upcoming Tasks
        </p>
        <p className="text-xs text-white/50">
          Schedule your first task
        </p>
      </div>
    </GlassCard>
  );
}

export function EmptyRecommendations() {
  return (
    <GlassCard variant="subtle" padding="md">
      <div className="flex flex-col items-center text-center py-6">
        <div className="mb-3">
          <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Target className="h-6 w-6 text-green-400" />
          </div>
        </div>
        <p className="text-sm font-medium text-white mb-1">
          Building Recommendations
        </p>
        <p className="text-xs text-white/50">
          Complete a few lessons to get personalized suggestions
        </p>
      </div>
    </GlassCard>
  );
}

export function EmptySkillDistribution() {
  return (
    <GlassCard variant="elevated" padding="lg">
      <div className="flex flex-col items-center text-center py-8">
        <div className="mb-4">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-cyan-400" />
          </div>
        </div>
        <p className="text-sm font-medium text-white mb-1">
          No Data Yet
        </p>
        <p className="text-xs text-white/50">
          Start learning to see your skill distribution
        </p>
      </div>
    </GlassCard>
  );
}
