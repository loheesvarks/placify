/**
 * Project Evidence Panel - Phase 4B
 * 
 * Display evidence status for project skills
 */

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ProjectSkill } from '@/lib/types/project.types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface ProjectEvidencePanelProps {
  projectId: string;
  skills: Array<ProjectSkill & { skill_name: string }>;
}

interface EvidenceStatus {
  skill_id: string;
  skill_name: string;
  has_evidence: boolean;
  evidence_count: number;
  demonstrated_level?: string;
}

export function ProjectEvidencePanel({ projectId, skills }: ProjectEvidencePanelProps) {
  const [evidenceStatus, setEvidenceStatus] = useState<EvidenceStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvidenceStatus();
  }, [projectId, skills]);

  const loadEvidenceStatus = async () => {
    try {
      setLoading(true);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Get evidence for this project
      const { data: evidence } = await supabase
        .from('skill_evidence')
        .select('skill_id')
        .eq('user_id', user.id)
        .eq('evidence_type', 'project')
        .eq('evidence_source_table', 'projects')
        .eq('evidence_source_id', projectId);

      // Count evidence per skill
      const evidenceCounts = (evidence || []).reduce(
        (acc, e) => {
          acc[e.skill_id] = (acc[e.skill_id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      // Build status array
      const status: EvidenceStatus[] = skills.map(skill => ({
        skill_id: skill.skill_id,
        skill_name: skill.skill_name,
        has_evidence: evidenceCounts[skill.skill_id] > 0,
        evidence_count: evidenceCounts[skill.skill_id] || 0,
        demonstrated_level: skill.skill_level_demonstrated || undefined,
      }));

      setEvidenceStatus(status);
    } catch (err) {
      console.error('[ProjectEvidencePanel] Error loading evidence:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-gray-800/50 bg-gray-900/50 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-800" />
      </Card>
    );
  }

  if (skills.length === 0) {
    return null;
  }

  return (
    <Card className="border-gray-800/50 bg-gray-900/50 p-6">
      <h2 className="mb-4 text-xl font-semibold text-white">Evidence Status</h2>

      <div className="space-y-3">
        {evidenceStatus.map(status => (
          <div
            key={status.skill_id}
            className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800/30 p-4"
          >
            <div className="flex items-center gap-3">
              {status.has_evidence ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : status.demonstrated_level ? (
                <Circle className="h-5 w-5 text-gray-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}

              <div>
                <h3 className="font-medium text-white">{status.skill_name}</h3>
                <p className="text-xs text-gray-400">
                  {status.has_evidence
                    ? `Evidence recorded (${status.evidence_count} ${status.evidence_count === 1 ? 'entry' : 'entries'})`
                    : status.demonstrated_level
                      ? 'No evidence yet - ready to generate'
                      : 'Demonstrated level not specified'}
                </p>
              </div>
            </div>

            {status.demonstrated_level && (
              <Badge
                className={
                  status.demonstrated_level === 'expert'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : status.demonstrated_level === 'advanced'
                      ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                      : status.demonstrated_level === 'intermediate'
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                }
              >
                {status.demonstrated_level}
              </Badge>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-gray-800/30 p-3">
        <p className="text-xs text-gray-400">
          <strong className="text-gray-300">About Evidence:</strong> Project evidence shows that you
          demonstrated these skills through this project. Evidence feeds into your skill assessments
          but does not automatically verify mastery. The trust engine considers all evidence types
          together.
        </p>
      </div>
    </Card>
  );
}
