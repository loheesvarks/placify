/**
 * Cosmic Background Component
 * Deep cosmic navy background with atmospheric purple/blue gradients
 * Matches reference image background treatment
 */

'use client';

import React from 'react';

export function CosmicBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep navy base */}
      <div className="absolute inset-0 bg-[#0a0d1f]" />
      
      {/* Purple atmospheric glow - top right */}
      <div 
        className="absolute -top-1/2 -right-1/4 h-[800px] w-[800px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)',
        }}
      />
      
      {/* Blue atmospheric glow - center right */}
      <div 
        className="absolute top-1/4 right-0 h-[600px] w-[600px] rounded-full opacity-25 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
        }}
      />
      
      {/* Purple atmospheric glow - bottom left */}
      <div 
        className="absolute -bottom-1/4 -left-1/4 h-[700px] w-[700px] rounded-full opacity-15 blur-[110px]"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
        }}
      />
      
      {/* Subtle grain/noise overlay for depth */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Distant stars effect */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[1px] w-[1px] rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite ${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
