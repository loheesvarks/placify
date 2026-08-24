/**
 * Project Stats Bar Component - Phase 4B
 * 
 * Display project statistics overview
 */

'use client';

import { Card } from '@/components/ui/card';
import type { ProjectStatistics } from '@/lib/types/project.types';
import { Briefcase, CheckCircle, Clock, Code, Layers, Sparkles } from 'lucide-react';

interface ProjectStatsBarProps {
  statistics: ProjectStatistics;
}

export function ProjectStatsBar({ statistics }: ProjectStatsBarProps) {
  const stats = [
    {
      label: 'Total Projects',
      value: statistics.total_projects,
      icon: Briefcase,
      color: 'text-purple-400',
    },
    {
      label: 'Completed',
      value: statistics.completed_projects,
      icon: CheckCircle,
      color: 'text-green-400',
    },
    {
      label: 'In Progress',
      value: statistics.in_progress_projects,
      icon: Clock,
      color: 'text-blue-400',
    },
    {
      label: 'Skills Demonstrated',
      value: statistics.total_skills_demonstrated,
      icon: Code,
      color: 'text-orange-400',
    },
    {
      label: 'Technologies Used',
      value: statistics.total_technologies_used,
      icon: Layers,
      color: 'text-cyan-400',
    },
    {
      label: 'With Evidence',
      value: statistics.projects_with_evidence,
      icon: Sparkles,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="border-gray-800/50 bg-gray-900/50 p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg bg-gray-800/50 p-2 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
