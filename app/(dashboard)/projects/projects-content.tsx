/**
 * Projects Content - Phase 4B
 * 
 * Main content for projects page
 * Client component that fetches and displays projects
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProjects, getProjectStatistics } from '@/lib/actions/project.actions';
import type { Project, ProjectStatistics } from '@/lib/types/project.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ProjectCard } from '@/components/projects/project-card';
import { ProjectStatsBar } from '@/components/projects/project-stats-bar';
import { Plus } from 'lucide-react';

export function ProjectsContent() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [statistics, setStatistics] = useState<ProjectStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsResult, statsResult] = await Promise.all([
        getUserProjects(),
        getProjectStatistics(),
      ]);

      if (projectsResult.success && projectsResult.data) {
        setProjects(projectsResult.data);
      } else {
        setError(projectsResult.error || 'Failed to load projects');
      }

      if (statsResult.success && statsResult.data) {
        setStatistics(statsResult.data);
      }
    } catch (err) {
      console.error('[ProjectsContent] Error loading data:', err);
      setError('Unexpected error loading projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    router.push('/dashboard/projects/new');
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-800" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-800/50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 p-6">
        <div className="mx-auto max-w-7xl">
          <Card className="border-red-500/50 bg-red-950/20 p-6">
            <p className="text-center text-red-400">{error}</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={loadData} variant="ghost">
                Retry
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <Button onClick={handleCreateProject} className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>

          <EmptyState
            title="No projects yet"
            description="Start building your portfolio by creating your first project. Projects demonstrate your skills and feed into your placement readiness assessment."
            action={{
              label: 'Create Project',
              onClick: handleCreateProject,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="mt-1 text-sm text-gray-400">
              Build your portfolio and demonstrate your skills
            </p>
          </div>
          <Button onClick={handleCreateProject} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Statistics */}
        {statistics && <ProjectStatsBar statistics={statistics} />}

        {/* Projects Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
