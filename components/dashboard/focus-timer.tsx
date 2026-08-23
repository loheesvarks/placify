/**
 * Focus Timer Component
 * Pomodoro-style focus timer with circular progress
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';

interface FocusTimerProps {
  className?: string;
}

export function FocusTimer({ className = '' }: FocusTimerProps) {
  const [duration, setDuration] = useState(25 * 60); // 25 minutes in seconds
  const [remaining, setRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'Deep Work' | 'Study' | 'Practice'>('Deep Work');

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && remaining > 0) {
      interval = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            // TODO: Show completion notification
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, remaining]);

  const handleStart = useCallback(() => {
    setIsActive(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsActive(false);
    setRemaining(duration);
  }, [duration]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = ((duration - remaining) / duration) * 100;
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <GlassCard variant="elevated" padding="lg" className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Focus Now</h3>
          <button
            onClick={handleReset}
            className="text-white/50 hover:text-white/80 transition-colors"
            aria-label="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Circular Timer */}
        <div className="relative flex items-center justify-center">
          <svg className="w-48 h-48 -rotate-90" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <filter id="timer-glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
            />

            {/* Progress circle */}
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#timer-gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              filter="url(#timer-glow)"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.3 }}
            />

            {/* Center content */}
            <foreignObject x="30" y="30" width="140" height="140">
              <div className="flex flex-col items-center justify-center h-full rotate-90">
                <p className="text-sm text-white/60 mb-2">{mode}</p>
                <p className="text-4xl font-bold text-white tabular-nums">
                  {formatTime(remaining)}
                </p>
              </div>
            </foreignObject>
          </svg>

          {/* Pulsing ring when active */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-500"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>

        {/* Control Button */}
        <Button
          onClick={isActive ? handlePause : handleStart}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause Focus
            </>
          ) : remaining === 0 ? (
            <>
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Again
            </>
          ) : remaining === duration ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start Focus
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Resume
            </>
          )}
        </Button>

        {/* Mode selector */}
        <div className="flex gap-2">
          {(['Deep Work', 'Study', 'Practice'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                const durations = { 'Deep Work': 25, Study: 30, Practice: 15 };
                const newDuration = durations[m] * 60;
                setDuration(newDuration);
                setRemaining(newDuration);
                setIsActive(false);
              }}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                mode === m
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-white/5 text-white/50 hover:text-white/80 border border-white/10'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
