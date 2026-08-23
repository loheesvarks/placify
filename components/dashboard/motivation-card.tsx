/**
 * Motivation Card
 * Inspirational message with animated flowing lines
 */

'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface MotivationCardProps {
  className?: string;
}

export function MotivationCard({ className = '' }: MotivationCardProps) {
  return (
    <GlassCard variant="elevated" padding="lg" className={className}>
      <div className="relative overflow-hidden">
        {/* Animated background lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 400 150"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity={0} />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Flowing curved lines */}
          <motion.path
            d="M 0 50 Q 100 30 200 50 T 400 50"
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 0 80 Q 100 100 200 80 T 400 80"
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 0 110 Q 100 90 200 110 T 400 110"
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">Daily Inspiration</span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xl font-bold text-white leading-relaxed">
              Small daily improvements
              <br />
              lead to stunning results.
            </h4>

            <p className="text-white/60 text-sm leading-relaxed">
              Keep going, you&apos;re building your future.
            </p>
          </div>

          {/* Decorative graph line */}
          <div className="relative h-16 mt-6">
            <svg viewBox="0 0 300 60" className="w-full h-full">
              <defs>
                <linearGradient id="graph-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              {/* Graph path */}
              <motion.path
                d="M 0 50 L 50 45 L 100 35 L 150 30 L 200 20 L 250 15 L 300 10"
                fill="none"
                stroke="url(#graph-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />

              {/* Data points */}
              {[0, 50, 100, 150, 200, 250, 300].map((x, i) => {
                const y = 50 - i * 6.5;
                return (
                  <motion.circle
                    key={x}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#3b82f6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
