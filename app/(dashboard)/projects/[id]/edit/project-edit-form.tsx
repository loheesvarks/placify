/**
 * Project Edit Form Component - Phase 4B
 * 
 * Loads existing project and renders edit form
 */

'use client';

import { useEffect, useState } from 'react';
import { getProjectWithDetails } from '@/lib/actions/project.actions';
import type { Project } from '@/lib/types/project.types';
import { ProjectForm } from '@/components/projects/project-form';
import { Card } from '@/components/ui/card';

interface ProjectEditFormProps {
  projectId: string;
}

export function ProjectEditForm({ projectId }: ProjectEditFormProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const result = await getProjectWithDetails(projectId);

      if (result.success && result.data) {
        setProject(result.data);
      } else {
        setError(result.error || 'Project not found');
      }
    } catch (err) {
      console.error('[ProjectEditForm] Error:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-800" />
        <div className="h-96 animate-pulse rounded-lg bg-gray-800/50" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <Card className="border-red-500/50 bg-red-950/20 p-6">
        <p className="text-center text-red-400">{error || 'Project not found'}</p>
      </Card>
    );
  }

  return <ProjectForm project={project} mode="edit" />;
}
