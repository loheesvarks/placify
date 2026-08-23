/**
 * Recommendations Component
 * Personalized course recommendations based on user progress
 */

'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { ArrowRight, Code, Database, Brain } from 'lucide-react';
import type { Recommendation } from '@/lib/types/dashboard.types';

interface RecommendationsProps {
  recommendations: Recommendation[];
  className?: string;
}

const categoryIcons = {
  Programming: Code,
  'Data Science': Database,
  'Machine Learning': Brain,
};

export function Recommendations({ recommendations, className = '' }: RecommendationsProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recommended for you</h3>
        <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 group">
          View all
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => {
          const Icon =
            categoryIcons[rec.category as keyof typeof categoryIcons] || Code;

          return (
            <GlassCard
              key={rec.id}
              variant="subtle"
              padding="md"
              hover
              className="cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Icon className="h-5 w-5 text-purple-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-purple-400 transition-colors">
                    {rec.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                        style={{ width: `${rec.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/50 tabular-nums w-8 text-right">
                      {rec.progress}%
                    </span>
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
