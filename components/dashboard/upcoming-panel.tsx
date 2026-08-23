/**
 * Upcoming Tasks Panel
 * Shows upcoming assignments, practice sessions, and events
 */

'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  FileText, 
  Code, 
  Network, 
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';
import type { UpcomingTask } from '@/lib/types/dashboard.types';

interface UpcomingPanelProps {
  tasks: UpcomingTask[];
  className?: string;
}

const categoryConfig = {
  assignment: {
    icon: FileText,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  practice: {
    icon: Code,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
  design: {
    icon: Network,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  interview: {
    icon: Users,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
  },
  quiz: {
    icon: FileText,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
  },
  lesson: {
    icon: FileText,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
};

export function UpcomingPanel({ tasks, className = '' }: UpcomingPanelProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Upcoming</h3>
        <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 group">
          View all
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const config = categoryConfig[task.category];
          const Icon = config.icon;

          return (
            <GlassCard
              key={task.id}
              variant="elevated"
              padding="md"
              hover
              className="cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${config.bgColor} ${config.borderColor} border`}
                >
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-white/50 mt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>{task.time}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
