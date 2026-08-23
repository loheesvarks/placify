/**
 * Dashboard Data Types
 * Complete type definitions for the Placify dashboard
 */

export interface SkillNode {
  id: string;
  name: string;
  progress: number; // 0-100
  orbit: number; // orbit ring number (1, 2, 3)
  angle: number; // position in degrees (0-360)
  category: 'programming' | 'data-science' | 'machine-learning' | 'web-development' | 'system-design' | 'soft-skills';
  icon?: string;
  color?: string;
}

export interface DashboardStats {
  learningTime: {
    value: number;
    unit: string;
    label: string;
    trend?: {
      value: number;
      label: string;
      direction: 'up' | 'down';
    };
  };
  weeklyProgress: {
    value: number;
    label: string;
  };
  skillsMastered: {
    current: number;
    total: number;
    trend?: {
      value: number;
      label: string;
    };
  };
  xpEarned: {
    value: number;
    trend?: {
      value: number;
      label: string;
    };
  };
}

export interface UpcomingTask {
  id: string;
  title: string;
  time: string;
  category: 'assignment' | 'practice' | 'design' | 'interview' | 'quiz' | 'lesson';
  icon?: string;
  color?: string;
}

export interface LearningCourse {
  id: string;
  title: string;
  subtitle: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessonsCount: number;
  progress: number;
  nextLesson: string;
  timeRemaining: string;
  thumbnail?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  progress: number;
  category: string;
  icon?: string;
}

export interface WeeklyActivityData {
  day: string;
  hours: number;
}

export interface SkillDistribution {
  category: string;
  percentage: number;
  color: string;
}

export interface FocusSession {
  mode: 'Deep Work' | 'Study' | 'Practice' | 'Review';
  duration: number; // in seconds
  remaining: number; // in seconds
  isActive: boolean;
}
