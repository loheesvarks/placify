/**
 * Dashboard Data Hook
 * Centralized data management for the Placify dashboard
 * Fetches real user data from Supabase with loading and empty states
 * Phase 4A: Connected to actual dashboard.actions.ts
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { getDashboardData } from '@/lib/actions/dashboard.actions';
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
  const [error, setError] = useState<string | null>(null);
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingTasks] = useState<UpcomingTask[]>([]); // TODO: Wire up when tasks API ready
  const [currentCourse] = useState<LearningCourse | null>(null); // TODO: Wire up when course API ready
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [weeklyActivity] = useState<WeeklyActivityData[]>([]); // TODO: Wire up when activity API ready
  const [skillDistribution, setSkillDistribution] = useState<SkillDistribution[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getDashboardData();
        
        if (!result.success || !result.data) {
          setError(result.error || 'Failed to load dashboard data');
          setIsLoading(false);
          return;
        }

        const data = result.data;

        // Transform skills data into Career Orbit format
        const transformedSkills: SkillNode[] = data.skills.map((skill, index) => {
          // Distribute skills across 3 orbital rings
          const orbitIndex = index % 3;
          const orbit = orbitIndex + 1;
          
          // Calculate angle for even distribution
          const skillsInOrbit = Math.ceil(data.skills.length / 3);
          const angleStep = 360 / skillsInOrbit;
          const angle = (Math.floor(index / 3) * angleStep) % 360;
          
          // Map proficiency to progress percentage
          const proficiencyMap: Record<string, number> = {
            'novice': 20,
            'beginner': 40,
            'intermediate': 60,
            'advanced': 80,
            'expert': 100,
          };
          const progress = proficiencyMap[skill.demonstratedLevel] || 0;
          
          // Determine category (default to programming if unknown)
          const category = determineCategoryFromSkillName(skill.name);

          return {
            id: skill.id,
            name: skill.name,
            progress,
            orbit,
            angle,
            category,
          };
        });

        setSkills(transformedSkills);

        // Transform stats into dashboard format
        const transformedStats: DashboardStats = {
          learningTime: {
            value: Math.floor(data.studyTime.today / 60), // Convert minutes to hours
            unit: 'hrs',
            label: 'hrs today',
            trend: {
              value: data.studyTime.today > 0 ? Math.floor((data.studyTime.today / data.studyTime.thisWeek) * 100) : 0,
              label: data.studyTime.today > 0 ? 'Keep it up!' : 'Start your journey!',
              direction: 'up' as const,
            },
          },
          weeklyProgress: {
            value: data.progress.completedLessons > 0 
              ? Math.min(Math.floor((data.progress.completedLessons / 10) * 100), 100) 
              : 0,
            label: data.progress.completedLessons > 0 
              ? `${data.progress.completedLessons} lessons completed` 
              : 'Set your first goal',
          },
          skillsMastered: {
            current: data.progress.skillsAssessed,
            total: data.progress.skillsTotal > 0 ? data.progress.skillsTotal : data.progress.skillsAssessed,
            trend: {
              value: data.progress.skillsAssessed,
              label: data.progress.skillsAssessed > 0 
                ? `${data.progress.skillsAssessed} skills assessed` 
                : 'Add skills to track',
            },
          },
          xpEarned: {
            value: (data.progress.completedLessons * 50) + (data.progress.solvedProblems * 100),
            trend: {
              value: data.progress.completedLessons + data.progress.solvedProblems,
              label: data.progress.completedLessons + data.progress.solvedProblems > 0
                ? 'Great progress!'
                : 'Complete lessons to earn XP',
            },
          },
        };

        setStats(transformedStats);

        // Transform recommendations
        const transformedRecommendations: Recommendation[] = data.recommendations.slice(0, 3).map((rec) => ({
          id: rec.id,
          title: rec.action,
          progress: 0, // Recommendations don't have progress
          category: rec.targetSkill || 'General',
        }));

        setRecommendations(transformedRecommendations);

        // Calculate skill distribution
        const categoryCount: Record<string, number> = {};
        const categoryColors: Record<string, string> = {
          'programming': '#3b82f6',
          'data-science': '#06b6d4',
          'machine-learning': '#a855f7',
          'web-development': '#10b981',
          'system-design': '#f59e0b',
          'soft-skills': '#ec4899',
        };

        transformedSkills.forEach(skill => {
          categoryCount[skill.category] = (categoryCount[skill.category] || 0) + 1;
        });

        const total = transformedSkills.length;
        const distribution: SkillDistribution[] = Object.entries(categoryCount).map(([category, count]) => ({
          category: category.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
          color: categoryColors[category] || '#8b5cf6',
        }));

        setSkillDistribution(distribution);

      } catch (err) {
        console.error('[useDashboardData] Error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Default stats for error/empty states
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
    error,
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

/**
 * Helper function to determine skill category from name
 * Uses simple keyword matching
 */
function determineCategoryFromSkillName(skillName: string): SkillNode['category'] {
  const name = skillName.toLowerCase();
  
  if (name.includes('python') || name.includes('java') || name.includes('c++') || 
      name.includes('algorithm') || name.includes('data structure')) {
    return 'programming';
  }
  
  if (name.includes('machine learning') || name.includes('ml') || 
      name.includes('deep learning') || name.includes('neural') || name.includes('ai')) {
    return 'machine-learning';
  }
  
  if (name.includes('data') || name.includes('statistics') || 
      name.includes('analytics') || name.includes('visualization')) {
    return 'data-science';
  }
  
  if (name.includes('react') || name.includes('javascript') || name.includes('html') || 
      name.includes('css') || name.includes('web') || name.includes('frontend') || name.includes('backend')) {
    return 'web-development';
  }
  
  if (name.includes('system') || name.includes('architecture') || 
      name.includes('design pattern') || name.includes('distributed')) {
    return 'system-design';
  }
  
  if (name.includes('communication') || name.includes('leadership') || 
      name.includes('teamwork') || name.includes('problem solving')) {
    return 'soft-skills';
  }
  
  // Default to programming
  return 'programming';
}
