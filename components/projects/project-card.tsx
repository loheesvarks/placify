/**
 * Project Card Component - Phase 4B
 * 
 * Display project information in card format
 */

'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/types/project.types';
import { Calendar, Code, ExternalLink, GitBranch } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const statusColors: Record<string, string> = {
    planning: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    in_progress: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    completed: 'bg-green-500/20 text-green-300 border-green-500/30',
    archived: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
  };

  const statusLabels: Record<string, string> = {
    planning: 'Planning',
    in_progress: 'In Progress',
    completed: 'Completed',
    archived: 'Archived',
  };

  return (
    <Card
      className="group cursor-pointer border-gray-800/50 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20"
      onClick={onClick}
    >
      {/* Status Badge */}
      <div className="mb-3 flex items-center justify-between">
        <Badge className={statusColors[project.status]}>
          {statusLabels[project.status]}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
        {project.title}
      </h3>

      {/* Description */}
      {project.description && (
        <p className="mb-4 line-clamp-2 text-sm text-gray-400">
          {project.description}
        </p>
      )}

      {/* Contribution Role */}
      {project.contribution_role && (
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
          <Code className="h-3 w-3" />
          <span>{project.contribution_role}</span>
        </div>
      )}

      {/* Dates */}
      {(project.start_date || project.completion_date) && (
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>
            {project.start_date && formatDate(project.start_date)}
            {project.start_date && project.completion_date && ' → '}
            {project.completion_date && formatDate(project.completion_date)}
          </span>
        </div>
      )}

      {/* Links */}
      <div className="mt-4 flex items-center gap-3">
        {project.repository_url && (
          <a
            href={project.repository_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-400 transition-colors"
          >
            <GitBranch className="h-3 w-3" />
            <span>Repository</span>
          </a>
        )}
        {project.demo_url && (
          <a
            href={project.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-400 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Demo</span>
          </a>
        )}
      </div>
    </Card>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
