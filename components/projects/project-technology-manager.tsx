/**
 * Project Technology Manager - Phase 4B
 * 
 * Manage technologies used in a project
 */

'use client';

import { useState } from 'react';
import {
  addTechnologyToProject,
  removeTechnologyFromProject,
} from '@/lib/actions/project.actions';
import type { ProjectTechnology, TechnologyCategory } from '@/lib/types/project.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface ProjectTechnologyManagerProps {
  projectId: string;
  technologies: ProjectTechnology[];
  onUpdate: () => void;
}

export function ProjectTechnologyManager({
  projectId,
  technologies,
  onUpdate,
}: ProjectTechnologyManagerProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [technologyName, setTechnologyName] = useState('');
  const [category, setCategory] = useState<TechnologyCategory | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTechnology = async () => {
    if (!technologyName.trim()) {
      setError('Technology name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await addTechnologyToProject(projectId, {
        technology_name: technologyName.trim(),
        category: category || undefined,
      });

      if (result.success) {
        setShowAdd(false);
        setTechnologyName('');
        setCategory('');
        onUpdate();
      } else {
        setError(result.error || 'Failed to add technology');
      }
    } catch (err) {
      console.error('[ProjectTechnologyManager] Error adding technology:', err);
      setError('Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTechnology = async (technologyId: string) => {
    const confirmed = confirm('Remove this technology from the project?');
    if (!confirmed) return;

    try {
      const result = await removeTechnologyFromProject(projectId, technologyId);

      if (result.success) {
        onUpdate();
      } else {
        setError(result.error || 'Failed to remove technology');
      }
    } catch (err) {
      console.error('[ProjectTechnologyManager] Error removing technology:', err);
      setError('Unexpected error');
    }
  };

  const categoryColors: Record<string, string> = {
    Frontend: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Backend: 'bg-green-500/20 text-green-300 border-green-500/30',
    Database: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    DevOps: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    Cloud: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Mobile: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    Testing: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    Other: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  };

  return (
    <Card className="border-gray-800/50 bg-gray-900/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Technologies</h2>
        {!showAdd && (
          <Button onClick={() => setShowAdd(true)} variant="secondary" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Technology
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/50 bg-red-950/20 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Add Technology Form */}
      {showAdd && (
        <div className="mb-4 space-y-3 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Technology Name</label>
            <Input
              value={technologyName}
              onChange={e => setTechnologyName(e.target.value)}
              placeholder="e.g., React, PostgreSQL, Docker"
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Category (Optional)</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as TechnologyCategory)}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Select category...</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="DevOps">DevOps</option>
              <option value="Cloud">Cloud</option>
              <option value="Mobile">Mobile</option>
              <option value="Testing">Testing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setShowAdd(false);
                setError(null);
              }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button onClick={handleAddTechnology} disabled={loading}>
              {loading ? 'Adding...' : 'Add Technology'}
            </Button>
          </div>
        </div>
      )}

      {/* Technologies List */}
      {technologies.length === 0 && !showAdd && (
        <p className="text-center text-sm text-gray-400">
          No technologies added yet. Add the tools and frameworks used in this project.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {technologies.map(tech => (
          <div
            key={tech.id}
            className="group flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/30 px-3 py-2"
          >
            <span className="text-sm text-white">{tech.technology_name}</span>
            {tech.category && (
              <Badge className={categoryColors[tech.category]}>{tech.category}</Badge>
            )}
            <button
              onClick={() => handleRemoveTechnology(tech.id)}
              className="rounded p-0.5 text-gray-400 opacity-0 transition-opacity hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Note: Technologies are separate from skills. A technology entry does not automatically
        create or associate a skill.
      </p>
    </Card>
  );
}
