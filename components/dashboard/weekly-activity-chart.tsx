/**
 * Weekly Activity Chart
 * Bar chart showing daily activity hours
 */

'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { WeeklyActivityData } from '@/lib/types/dashboard.types';

interface WeeklyActivityChartProps {
  data: WeeklyActivityData[];
  className?: string;
}

export function WeeklyActivityChart({ data, className = '' }: WeeklyActivityChartProps) {
  const maxHours = Math.max(...data.map((d) => d.hours));

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Weekly Activity</h3>
        <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 group">
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <GlassCard variant="elevated" padding="lg">
        <div className="space-y-4">
          {/* Chart */}
          <div className="relative h-32">
            <svg className="w-full h-full" viewBox="0 0 280 128" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bar-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                </linearGradient>
                <filter id="bar-glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid lines */}
              <g className="opacity-10">
                <line x1="0" y1="32" x2="280" y2="32" stroke="white" strokeWidth="1" />
                <line x1="0" y1="64" x2="280" y2="64" stroke="white" strokeWidth="1" />
                <line x1="0" y1="96" x2="280" y2="96" stroke="white" strokeWidth="1" />
              </g>

              {/* Bars */}
              {data.map((item, index) => {
                const barWidth = 30;
                const gap = 10;
                const x = index * (barWidth + gap) + gap;
                const heightPercent = (item.hours / (maxHours * 1.2)) * 100;
                const barHeight = (heightPercent / 100) * 128;
                const y = 128 - barHeight;

                return (
                  <motion.g key={item.day}>
                    {/* Bar */}
                    <motion.rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill="url(#bar-gradient)"
                      filter="url(#bar-glow)"
                      rx="4"
                      initial={{ height: 0, y: 128 }}
                      animate={{ height: barHeight, y }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    />

                    {/* Hover highlight */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill="white"
                      opacity="0"
                      rx="4"
                      className="hover:opacity-10 transition-opacity cursor-pointer"
                    />
                  </motion.g>
                );
              })}
            </svg>
          </div>

          {/* Day labels */}
          <div className="flex justify-between px-1.5">
            {data.map((item) => (
              <span key={item.day} className="text-xs text-white/40">
                {item.day}
              </span>
            ))}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Total this week</span>
              <span className="text-white font-semibold">
                {data.reduce((sum, d) => sum + d.hours, 0).toFixed(1)}h
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
