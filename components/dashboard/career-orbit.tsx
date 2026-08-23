/**
 * Career Orbit Component
 * Dynamic SVG-based skill visualization with orbital rings
 * Reference-matched visual fidelity
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { SkillNode } from '@/lib/types/dashboard.types';

interface CareerOrbitProps {
  skills: SkillNode[];
  className?: string;
}

export function CareerOrbit({ skills, className = '' }: CareerOrbitProps) {
  const centerX = 350;
  const centerY = 250;
  const orbitRadii = [100, 180, 250]; // Inner, middle, outer orbits

  // Calculate position for a skill node
  const getNodePosition = (skill: SkillNode) => {
    const radius = orbitRadii[skill.orbit - 1] || orbitRadii[0];
    const angleRad = (skill.angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleRad),
      y: centerY + radius * Math.sin(angleRad),
    };
  };

  // Get color based on category
  const getCategoryColor = (category: string) => {
    const colors = {
      programming: '#3b82f6',
      'data-science': '#06b6d4',
      'machine-learning': '#a855f7',
      'web-development': '#10b981',
      'system-design': '#f59e0b',
      'soft-skills': '#ec4899',
    };
    return colors[category as keyof typeof colors] || '#8b5cf6';
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 700 500"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity={0.6} />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#6d28d9" stopOpacity={0} />
          </radialGradient>

          <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.2} />
          </linearGradient>

          {/* Filters */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="strong-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background particles */}
        {Array.from({ length: 50 }).map((_, i) => {
          const x = 120 + (i * 137) % 480;
          const y = 60 + (i * 97) % 400;
          const size = 0.6 + (i % 3) * 0.4;
          return (
            <motion.circle
              key={`particle-${i}`}
              cx={x}
              cy={y}
              r={size}
              fill="#a855f7"
              opacity={0.4}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + (i % 4),
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          );
        })}

        {/* Orbital rings */}
        {orbitRadii.map((radius, index) => (
          <motion.ellipse
            key={`orbit-${index}`}
            cx={centerX}
            cy={centerY}
            rx={radius}
            ry={radius * 0.85}
            fill="none"
            stroke="url(#orbit-gradient)"
            strokeWidth={1.5}
            opacity={0.3}
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 1.5, delay: index * 0.2 }}
          />
        ))}

        {/* Central Placify emblem */}
        <g filter="url(#strong-glow)">
          {/* Glow circle */}
          <circle cx={centerX} cy={centerY} r={65} fill="url(#center-glow)" opacity={0.6} />
          
          {/* Central circle */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={45}
            fill="rgba(168, 85, 247, 0.2)"
            stroke="#a855f7"
            strokeWidth={2.5}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          {/* Placify "P" logo */}
          <g transform={`translate(${centerX - 15}, ${centerY - 22})`}>
            <path
              d="M 10 0 L 10 44 M 10 0 Q 25 0 25 15 Q 25 22 10 22"
              stroke="#a855f7"
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#glow)"
            />
            <circle cx={10} cy={37} r={3} fill="#a855f7" />
          </g>

          {/* Pulsing ring */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={45}
            fill="none"
            stroke="#a855f7"
            strokeWidth={1}
            opacity={0.8}
            animate={{
              r: [45, 65, 45],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        </g>

        {/* Skill nodes */}
        {skills.map((skill, index) => {
          const pos = getNodePosition(skill);
          const color = getCategoryColor(skill.category);

          return (
            <g key={skill.id}>
              {/* Connection line to center */}
              <motion.line
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke={color}
                strokeWidth={0.5}
                opacity={0.2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
              />

              {/* Glow circle */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={20}
                fill={color}
                opacity={0.2}
                filter="url(#glow)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              />

              {/* Main node circle */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={15}
                fill="rgba(6, 10, 22, 0.9)"
                stroke={color}
                strokeWidth={2}
                filter="url(#glow)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                className="cursor-pointer hover:scale-110 transition-transform"
              />

              {/* Progress ring */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={15}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeDasharray={`${skill.progress * 0.942} 94.2`}
                strokeLinecap="round"
                transform={`rotate(-90 ${pos.x} ${pos.y})`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              />

              {/* Skill label */}
              <motion.g
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
              >
                <rect
                  x={pos.x - 38}
                  y={pos.y - 44}
                  width={76}
                  height={24}
                  rx={12}
                  fill="rgba(6, 10, 22, 0.95)"
                  stroke={color}
                  strokeWidth={1}
                  opacity={0.9}
                />
                <text
                  x={pos.x}
                  y={pos.y - 27}
                  textAnchor="middle"
                  fill="white"
                  fontSize={11}
                  fontWeight={600}
                  fontFamily="system-ui, sans-serif"
                >
                  {skill.name}
                </text>
              </motion.g>

              {/* Pulse animation */}
              {skill.progress > 70 && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={15}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  opacity={0.6}
                  animate={{
                    r: [15, 25, 15],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
