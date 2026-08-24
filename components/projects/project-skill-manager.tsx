/**
 * Project Skill Manager - Phase 4B
 * 
 * Manage skills associated with a project
 */

'use client';

import { useState, useEffect } from 'react';
import {
  addSkillToProject,
  removeSkillFromProject,
  updateProjectSkill,
} from '@/lib/actions/project.actions';
import type { ProjectSkill, SkillLevelDemonstrated } from '@/lib/types/project.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ProjectSkillManagerProps {
  projectId: string;
  skills: Array<ProjectSkill & { skill_name: string }>;
  onUpdate: () => void;
}

interface Skill {
  id: string;
  skill_name: string;
  category: string | null;
}

export function ProjectSkillManager({ projectId, skills, onUpdate }: ProjectSkillManagerProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [demonstratedLevel, setDemonstratedLevel] = useState<SkillLevelDemonstrated | ''>('');
  const [usageNotes, setUsageNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editLevel, setEditLevel] = useState<SkillLevelDemonstrated | ''>('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    if (showAdd) {
      loadAvailableSkills();
    }
  }, [showAdd]);

  const loadAvailableSkills = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: userSkills } = await supabase
        .from('skills')
        .select('id, skill_name, category')
        .eq('user_id', user.id)
        .order('skill_name');

      // Filter out already added skills
      const addedSkillIds = new Set(skills.map(s => s.skill_id));
      const available = (userSkills || []).filter(s => !addedSkillIds.has(s.id));

      setAvailableSkills(available);
    } catch (err) {
      console.error('[ProjectSkillManager] Error loading skills:', err);
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkillId) {
      setError('Please select a skill');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await addSkillToProject(projectId, {
        skill_id: selectedSkillId,
        skill_level_demonstrated: demonstratedLevel || undefined,
        usage_notes: usageNotes.trim() || undefined,
      });

      if (result.success) {
        setShowAdd(false);
        setSelectedSkillId('');
        setDemonstratedLevel('');
        setUsageNotes('');
        onUpdate();
      } else {
        setError(result.error || 'Failed to add skill');
      }
    } catch (err) {
      console.error('[ProjectSkillManager] Error adding skill:', err);
      setError('Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    const confirmed = confirm('Remove this skill from the project?');
    if (!confirmed) return;

    try {
      const result = await removeSkillFromProject(projectId, skillId);

      if (result.success) {
        onUpdate();
      } else {
        setError(result.error || 'Failed to remove skill');
      }
    } catch (err) {
      console.error('[ProjectSkillManager] Error removing skill:', err);
      setError('Unexpected error');
    }
  };

  const handleStartEdit = (skill: ProjectSkill) => {
    setEditingSkillId(skill.skill_id);
    setEditLevel((skill.skill_level_demonstrated as SkillLevelDemonstrated) || '');
    setEditNotes(skill.usage_notes || '');
  };

  const handleSaveEdit = async (skillId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await updateProjectSkill(projectId, skillId, {
        skill_level_demonstrated: editLevel || undefined,
        usage_notes: editNotes.trim() || undefined,
      });

      if (result.success) {
        setEditingSkillId(null);
        onUpdate();
      } else {
        setError(result.error || 'Failed to update skill');
      }
    } catch (err) {
      console.error('[ProjectSkillManager] Error updating skill:', err);
      setError('Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const levelColors: Record<string, string> = {
    beginner: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    intermediate: 'bg-green-500/20 text-green-300 border-green-500/30',
    advanced: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    expert: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  };

  return (
    <Card className="border-gray-800/50 bg-gray-900/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Skills</h2>
        {!showAdd && (
          <Button onClick={() => setShowAdd(true)} variant="secondary" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/50 bg-red-950/20 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Add Skill Form */}
      {showAdd && (
        <div className="mb-4 space-y-3 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Select Skill</label>
            <select
              value={selectedSkillId}
              onChange={e => setSelectedSkillId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Choose a skill...</option>
              {availableSkills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.skill_name} {skill.category && `(${skill.category})`}
                </option>
              ))}
            </select>
            {availableSkills.length === 0 && (
              <p className="mt-1 text-xs text-gray-500">
                No available skills. Create skills first from your profile.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Demonstrated Level</label>
            <select
              value={demonstratedLevel}
              onChange={e => setDemonstratedLevel(e.target.value as SkillLevelDemonstrated)}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Not specified</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Usage Notes</label>
            <textarea
              value={usageNotes}
              onChange={e => setUsageNotes(e.target.value)}
              placeholder="Describe how you used this skill in the project..."
              rows={2}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
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
            <Button onClick={handleAddSkill} disabled={loading}>
              {loading ? 'Adding...' : 'Add Skill'}
            </Button>
          </div>
        </div>
      )}

      {/* Skills List */}
      {skills.length === 0 && !showAdd && (
        <p className="text-center text-sm text-gray-400">
          No skills added yet. Add skills to demonstrate what you used in this project.
        </p>
      )}

      <div className="space-y-3">
        {skills.map(skill => (
          <div
            key={skill.id}
            className="flex items-start justify-between rounded-lg border border-gray-700 bg-gray-800/30 p-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white">{skill.skill_name}</h3>
                {skill.skill_level_demonstrated && (
                  <Badge className={levelColors[skill.skill_level_demonstrated]}>
                    {skill.skill_level_demonstrated}
                  </Badge>
                )}
              </div>

              {editingSkillId === skill.skill_id ? (
                <div className="mt-2 space-y-2">
                  <select
                    value={editLevel}
                    onChange={e => setEditLevel(e.target.value as SkillLevelDemonstrated)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white"
                  >
                    <option value="">Not specified</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                  <textarea
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder="Usage notes..."
                    rows={2}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSaveEdit(skill.skill_id)}
                      disabled={loading}
                      className="gap-1"
                    >
                      <Check className="h-3 w-3" />
                      Save
                    </Button>
                    <Button onClick={() => setEditingSkillId(null)} variant="secondary">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {skill.usage_notes && (
                    <p className="mt-1 text-sm text-gray-400">{skill.usage_notes}</p>
                  )}
                </>
              )}
            </div>

            {editingSkillId !== skill.skill_id && (
              <div className="flex gap-1">
                <button
                  onClick={() => handleStartEdit(skill)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleRemoveSkill(skill.skill_id)}
                  className="rounded p-1 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
