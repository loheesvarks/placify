/**
 * Continue Learning Component
 * Shows current course progress with premium visual treatment
 */

'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import type { LearningCourse } from '@/lib/types/dashboard.types';

interface ContinueLearningProps {
  course: LearningCourse;
  className?: string;
}

export function ContinueLearning({ course, className = '' }: ContinueLearningProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-400" />
          Continue Learning
        </h3>
        <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 group">
          Resume
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <GlassCard variant="elevated" padding="lg" hover className="cursor-pointer group">
        <div className="flex items-start gap-4">
          {/* Course thumbnail with cosmic gradient */}
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 animate-pulse-glow" />
            <div className="absolute inset-2 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
              {/* ML Brain icon */}
              <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
                {/* Simplified neural network visualization */}
                <circle cx="32" cy="20" r="4" fill="white" opacity="0.9" />
                <circle cx="20" cy="44" r="4" fill="white" opacity="0.9" />
                <circle cx="32" cy="44" r="4" fill="white" opacity="0.9" />
                <circle cx="44" cy="44" r="4" fill="white" opacity="0.9" />
                <line x1="32" y1="24" x2="20" y2="40" stroke="white" strokeWidth="1.5" opacity="0.6" />
                <line x1="32" y1="24" x2="32" y2="40" stroke="white" strokeWidth="1.5" opacity="0.6" />
                <line x1="32" y1="24" x2="44" y2="40" stroke="white" strokeWidth="1.5" opacity="0.6" />
                {/* Connection nodes */}
                <circle cx="32" cy="32" r="2" fill="white" opacity="0.8" />
                <circle cx="26" cy="32" r="2" fill="white" opacity="0.8" />
                <circle cx="38" cy="32" r="2" fill="white" opacity="0.8" />
              </svg>
            </div>
          </div>

          {/* Course details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
              {course.title}
            </h4>
            <p className="text-sm text-white/60 mb-3">
              {course.level} · {course.lessonsCount} Lessons
            </p>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/50">Progress</span>
                <span className="text-xs font-medium text-white">{course.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            {/* Next up and time */}
            <div className="flex items-center justify-between text-sm">
              <p className="text-white/60">
                Next up: <span className="text-white font-medium">{course.nextLesson}</span>
              </p>
              <div className="flex items-center gap-1 text-white/50">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{course.timeRemaining}</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
