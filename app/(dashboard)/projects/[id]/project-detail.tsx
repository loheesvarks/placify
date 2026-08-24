/**
 * Project Detail Component - Phase 4B
 * 
 * Display full project information with skills, technologies, and evidence
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getProjectWithDetails,
  generateProjectEvidence,
  deleteProject,
} from '@/lib/actions/project.actions';
import type { ProjectWithDetails } from '@/lib/types/project.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectSkillManager } from '@/components/projects/project-skill-manager';
import { ProjectTechnologyManager } from '@/components/projects/project-technology-manager';
import { ProjectEvidencePanel } from '@/components/projects/project-evidence-panel';
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  GitBranch,
  Calendar,
  Users,
  Sparkles,
} from 'lucide-react';

interface ProjectDetailProps {
  projectId: string;
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingEvidence, setGeneratingEvidence] = useState(false);
  const [evidenceMessage, setEvidenceMessage] = useState<string | null>(null);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getProjectWithDetails(projectId);

      if (result.success && result.data) {
        setProject(result.data);
      } else {
        setError(result.error || 'Project not found');
      }
    } catch (err) {
      console.error('[ProjectDetail] Error loading project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEvidence = async () => {
    if (!project) return;

    try {
      setGeneratingEvidence(true);
      setEvidenceMessage(null);

      const result = await generateProjectEvidence(projectId);

      if (result.success && result.data) {
        const { evidence_generated, skills_processed, errors } = result.data;

        if (evidence_generated > 0) {
          setEvidenceMessage(
            `Project evidence recorded for ${evidence_generated} of ${skills_processed} skills.`
          );
        } else {
          setEvidenceMessage(
            errors.length > 0
              ? `Could not generate evidence: ${errors.join(', ')}`
              : 'No evidence generated. Ensure project is completed with skill levels specified.'
          );
        }

        // Reload project to refresh evidence status
        await loadProject();
      } else {
        setEvidenceMessage(result.error || 'Failed to generate evidence');
      }
    } catch (err) {
      console.error('[ProjectDetail] Error generating evidence:', err);
      setEvidenceMessage('Unexpected error generating evidence');
    } finally {
      setGeneratingEvidence(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;

    const confirmed = confirm(
      'Are you sure you want to delete this project? Historical skill evidence will be preserved.'
    );

    if (!confirmed) return;

    try {
      const result = await deleteProject(projectId);

      if (result.success) {
        router.push('/dashboard/projects');
      } else {
        setError(result.error || 'Failed to delete project');
      }
    } catch (err) {
      console.error('[ProjectDetail] Error deleting project:', err);
      setError('Unexpected error deleting project');
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/projects/${projectId}/edit`);
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
        <div className="mt-4 flex justify-center">
          <Button onClick={() => router.push('/dashboard/projects')} variant="ghost">
            Back to Projects
          </Button>
        </div>
      </Card>
    );
  }

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

  const canGenerateEvidence = project.status === 'completed' && project.skills.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/dashboard/projects')}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
            <Badge className={`mt-2 ${statusColors[project.status]}`}>
              {statusLabels[project.status]}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleEdit} variant="secondary" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button onClick={handleDelete} variant="danger" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Evidence Message */}
      {evidenceMessage && (
        <Card className="border-purple-500/50 bg-purple-950/20 p-4">
          <p className="text-sm text-purple-300">{evidenceMessage}</p>
        </Card>
      )}

      {/* Project Information */}
      <Card className="border-gray-800/50 bg-gray-900/50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Project Information</h2>

        {project.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-400">Description</p>
            <p className="mt-1 text-white">{project.description}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {project.contribution_role && (
            <div>
              <p className="text-sm text-gray-400">Role</p>
              <p className="mt-1 text-white">{project.contribution_role}</p>
            </div>
          )}

          {project.team_size && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Team Size</p>
                <p className="mt-1 text-white">{project.team_size} members</p>
              </div>
            </div>
          )}

          {(project.start_date || project.completion_date) && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Timeline</p>
                <p className="mt-1 text-white">
                  {project.start_date && new Date(project.start_date).toLocaleDateString()}
                  {project.start_date && project.completion_date && ' → '}
                  {project.completion_date && new Date(project.completion_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {project.outcomes && (
          <div className="mt-4">
            <p className="text-sm text-gray-400">Outcomes</p>
            <p className="mt-1 text-white">{project.outcomes}</p>
          </div>
        )}

        {/* External Links */}
        <div className="mt-4 flex gap-4">
          {project.repository_url && (
            <a
              href={project.repository_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              <GitBranch className="h-4 w-4" />
              Repository
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
        </div>
      </Card>

      {/* Skills */}
      <ProjectSkillManager projectId={projectId} skills={project.skills} onUpdate={loadProject} />

      {/* Technologies */}
      <ProjectTechnologyManager
        projectId={projectId}
        technologies={project.technologies}
        onUpdate={loadProject}
      />

      {/* Evidence Panel */}
      <ProjectEvidencePanel projectId={projectId} skills={project.skills} />

      {/* Generate Evidence Action */}
      {canGenerateEvidence && (
        <Card className="border-purple-500/50 bg-purple-950/20 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Generate Project Evidence</h3>
              <p className="mt-1 text-sm text-gray-400">
                Record evidence for skills demonstrated in this project. Evidence feeds into your
                skill assessments.
              </p>
            </div>
            <Button
              onClick={handleGenerateEvidence}
              disabled={generatingEvidence}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {generatingEvidence ? 'Generating...' : 'Generate Evidence'}
            </Button>
          </div>
        </Card>
      )}

      {!canGenerateEvidence && (
        <Card className="border-gray-700/50 bg-gray-800/20 p-6">
          <p className="text-sm text-gray-400">
            {project.status !== 'completed'
              ? 'Mark project as completed to generate evidence.'
              : 'Add skills to this project to generate evidence.'}
          </p>
        </Card>
      )}
    </div>
  );
}
