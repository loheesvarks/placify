/**
 * Skill Distribution Chart
 * Donut chart showing skill category distribution
 */

'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import type { SkillDistribution } from '@/lib/types/dashboard.types';

interface SkillDistributionChartProps {
  data: SkillDistribution[];
  className?: string;
}

export function SkillDistributionChart({ data, className = '' }: SkillDistributionChartProps) {
  const radius = 80;
  const strokeWidth = 30;
  const centerX = 100;
  const centerY = 100;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate cumulative percentages for each segment
  let cumulativePercent = 0;
  const segments = data.map((item) => {
    const startPercent = cumulativePercent;
    const endPercent = cumulativePercent + item.percentage;
    cumulativePercent = endPercent;
    
    return {
      ...item,
      startPercent,
      endPercent,
      dashArray: `${(item.percentage / 100) * circumference} ${circumference}`,
      dashOffset: -((startPercent / 100) * circumference),
    };
  });

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Skill Distribution</h3>
        <span className="text-xs text-white/50">Based on time spent</span>
      </div>

      <GlassCard variant="elevated" padding="lg">
        <div className="flex flex-col items-center gap-6">
          {/* Donut Chart */}
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
              <defs>
                {segments.map((_, index) => (
                  <filter key={`glow-${index}`} id={`donut-glow-${index}`}>
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                ))}
              </defs>

              {/* Background circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth={strokeWidth}
              />

              {/* Segment circles */}
              {segments.map((segment, index) => (
                <motion.circle
                  key={segment.category}
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                  strokeLinecap="butt"
                  filter={`url(#donut-glow-${index})`}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: segment.dashOffset }}
                  transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                  className="hover:opacity-80 cursor-pointer transition-opacity"
                />
              ))}

              {/* Center circle */}
              <circle cx={centerX} cy={centerY} r={radius - strokeWidth / 2} fill="rgba(6, 10, 22, 0.8)" />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-xs text-white/50">Skills</p>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full space-y-2">
            {data.map((item, index) => (
              <motion.div
                key={item.category}
                className="flex items-center justify-between text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white/80">{item.category}</span>
                </div>
                <span className="text-white font-medium">{item.percentage}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
