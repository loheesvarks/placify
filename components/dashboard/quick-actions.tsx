/**
 * Quick Actions Component
 * Quick access buttons for common dashboard actions
 */

'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { MessageSquare, FileText, StickyNote, Layers } from 'lucide-react';

const actions = [
  {
    id: 'ask-ai',
    icon: MessageSquare,
    title: 'Ask AI',
    description: 'Get instant help',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'take-quiz',
    icon: FileText,
    title: 'Take Quiz',
    description: 'Test your knowledge',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'notes',
    icon: StickyNote,
    title: 'Notes',
    description: 'Review your notes',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'flashcards',
    icon: Layers,
    title: 'Flashcards',
    description: 'Practice recall',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
];

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className = '' }: QuickActionsProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <GlassCard
              key={action.id}
              variant="elevated"
              padding="md"
              hover
              interactive
              className="cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-0.5">
                    {action.title}
                  </p>
                  <p className="text-xs text-white/50">{action.description}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
