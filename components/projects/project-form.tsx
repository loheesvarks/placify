/**
 * Project Form Component - Phase 4B
 * 
 * Form for creating and editing projects
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject, updateProject } from '@/lib/actions/project.actions';
import type { Project, ProjectStatus } from '@/lib/types/project.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface ProjectFormProps {
  project?: Project;
  mode?: 'create' | 'edit';
}

export function ProjectForm({ project, mode = 'create' }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    status: (project?.status as ProjectStatus) || 'planning' as ProjectStatus,
    contribution_role: project?.contribution_role || '',
    team_size: project?.team_size?.toString() || '',
    repository_url: project?.repository_url || '',
    demo_url: project?.demo_url || '',
    start_date: project?.start_date || '',
    completion_date: project?.completion_date || '',
    outcomes: project?.outcomes || '',
    is_public: project?.is_public || false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }

    if (formData.start_date && formData.completion_date) {
      const start = new Date(formData.start_date);
      const completion = new Date(formData.completion_date);
      if (completion < start) {
        setError('Completion date cannot be before start date');
        return;
      }
    }

    try {
      setLoading(true);

      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        contribution_role: formData.contribution_role.trim() || undefined,
        team_size: formData.team_size ? parseInt(formData.team_size, 10) : undefined,
        repository_url: formData.repository_url.trim() || undefined,
        demo_url: formData.demo_url.trim() || undefined,
        start_date: formData.start_date || undefined,
        completion_date: formData.completion_date || undefined,
        outcomes: formData.outcomes.trim() || undefined,
        is_public: formData.is_public,
      };

      if (mode === 'create') {
        const result = await createProject(projectData);

        if (result.success && result.data) {
          router.push(`/dashboard/projects/${result.data.id}`);
        } else {
          setError(result.error || 'Failed to create project');
        }
      } else if (project) {
        const result = await updateProject(project.id, projectData);

        if (result.success && result.data) {
          router.push(`/dashboard/projects/${result.data.id}`);
        } else {
          setError(result.error || 'Failed to update project');
        }
      }
    } catch (err) {
      console.error('[ProjectForm] Error:', err);
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() =>
            router.push(project ? `/dashboard/projects/${project.id}` : '/dashboard/projects')
          }
          variant="ghost"
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-white">
          {mode === 'create' ? 'Create Project' : 'Edit Project'}
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-500/50 bg-red-950/20 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </Card>
      )}

      {/* Form */}
      <Card className="border-gray-800/50 bg-gray-900/50 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Project Title <span className="text-red-400">*</span>
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Customer Churn Prediction System"
              className="mt-1"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this project does and your role..."
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Contribution Role */}
          <div>
            <label htmlFor="contribution_role" className="block text-sm font-medium text-gray-300">
              Your Role
            </label>
            <Input
              id="contribution_role"
              name="contribution_role"
              value={formData.contribution_role}
              onChange={handleChange}
              placeholder="e.g., Full Stack Developer, Solo Developer, Team Lead"
              className="mt-1"
            />
          </div>

          {/* Team Size */}
          <div>
            <label htmlFor="team_size" className="block text-sm font-medium text-gray-300">
              Team Size
            </label>
            <Input
              id="team_size"
              name="team_size"
              type="number"
              min="1"
              value={formData.team_size}
              onChange={handleChange}
              placeholder="e.g., 1 for solo project, 5 for team"
              className="mt-1"
            />
          </div>

          {/* Repository URL */}
          <div>
            <label htmlFor="repository_url" className="block text-sm font-medium text-gray-300">
              Repository URL
            </label>
            <Input
              id="repository_url"
              name="repository_url"
              type="url"
              value={formData.repository_url}
              onChange={handleChange}
              placeholder="https://github.com/username/project"
              className="mt-1"
            />
          </div>

          {/* Demo URL */}
          <div>
            <label htmlFor="demo_url" className="block text-sm font-medium text-gray-300">
              Demo URL
            </label>
            <Input
              id="demo_url"
              name="demo_url"
              type="url"
              value={formData.demo_url}
              onChange={handleChange}
              placeholder="https://myproject.com"
              className="mt-1"
            />
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-300">
                Start Date
              </label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="completion_date" className="block text-sm font-medium text-gray-300">
                Completion Date
              </label>
              <Input
                id="completion_date"
                name="completion_date"
                type="date"
                value={formData.completion_date}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>

          {/* Outcomes */}
          <div>
            <label htmlFor="outcomes" className="block text-sm font-medium text-gray-300">
              Outcomes & Achievements
            </label>
            <textarea
              id="outcomes"
              name="outcomes"
              value={formData.outcomes}
              onChange={handleChange}
              placeholder="e.g., Reduced processing time by 40%, Deployed to 500 users, Achieved 95% accuracy"
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Describe measurable results or achievements from this project
            </p>
          </div>

          {/* Public Visibility */}
          <div className="flex items-center gap-2">
            <input
              id="is_public"
              name="is_public"
              type="checkbox"
              checked={formData.is_public}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-2 focus:ring-purple-500"
            />
            <label htmlFor="is_public" className="text-sm text-gray-300">
              Make this project visible in public portfolio (future feature)
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                router.push(project ? `/dashboard/projects/${project.id}` : '/dashboard/projects')
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : mode === 'create' ? 'Create Project' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Info Card */}
      <Card className="border-gray-700/50 bg-gray-800/20 p-4">
        <p className="text-sm text-gray-400">
          <strong className="text-gray-300">Note:</strong> Creating a project does NOT automatically
          generate skill evidence. After creating your project, you can add skills and technologies,
          then generate evidence once the project is completed.
        </p>
      </Card>
    </div>
  );
}
