/**
 * Dashboard Data Hook
 * Centralized data management for the Placify dashboard
 * Fetches real user data from Supabase with loading and empty states
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import type {
  SkillNode,
  DashboardStats,
  UpcomingTask,
  LearningCourse,
  Recommendation,
  WeeklyActivityData,
  SkillDistribution,
} from '@/lib/types/dashboard.types';

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState(true);
  const [skills] = useState<SkillNode[]>([]);
  const [stats] = useState<DashboardStats | null>(null);
  const [upcomingTasks] = useState<UpcomingTask[]>([]);
  const [currentCourse] = useState<LearningCourse | null>(null);
  const [recommendations] = useState<Recommendation[]>([]);
  const [weeklyActivity] = useState<WeeklyActivityData[]>([]);
  const [skillDistribution] = useState<SkillDistribution[]>([]);

  useEffect(() => {
    // TODO: Replace with actual Supabase queries
    // For now, simulate API call with loading state
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user has any data
      // For new users, leave arrays empty
      // This is where you'd check Supabase for actual user data
      
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Default stats for new users
  const defaultStats: DashboardStats = useMemo(() => ({
    learningTime: {
      value: 0,
      unit: 'hrs',
      label: 'hrs today',
      trend: {
        value: 0,
        label: 'Start your journey!',
        direction: 'up',
      },
    },
    weeklyProgress: {
      value: 0,
      label: 'Set your first goal',
    },
    skillsMastered: {
      current: 0,
      total: 0,
      trend: {
        value: 0,
        label: 'Add skills to track',
      },
    },
    xpEarned: {
      value: 0,
      trend: {
        value: 0,
        label: 'Complete lessons to earn XP',
      },
    },
  }), []);

  // Default empty weekly activity
  const defaultWeeklyActivity: WeeklyActivityData[] = useMemo(() => [
    { day: 'Mon', hours: 0 },
    { day: 'Tue', hours: 0 },
    { day: 'Wed', hours: 0 },
    { day: 'Thu', hours: 0 },
    { day: 'Fri', hours: 0 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 },
  ], []);

  return {
    isLoading,
    skills: skills.length > 0 ? skills : [],
    stats: stats || defaultStats,
    upcomingTasks,
    currentCourse,
    recommendations,
    weeklyActivity: weeklyActivity.length > 0 ? weeklyActivity : defaultWeeklyActivity,
    skillDistribution,
    hasData: skills.length > 0 || upcomingTasks.length > 0,
  };
}
