import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors (Blue)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Secondary Colors (Purple)
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Semantic Colors
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          900: '#7f1d1d',
        },
        info: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#06b6d4',
          600: '#0891b2',
          900: '#164e63',
        },
        // Neutral Colors
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        // Surface Colors (Dark Theme)
        surface: {
          background: '#0a0e1a',
          elevated: {
            1: '#111827',
            2: '#1f2937',
            3: '#374151',
          },
          border: 'rgba(255, 255, 255, 0.1)',
          'border-soft': 'rgba(255, 255, 255, 0.05)',
          'border-bold': 'rgba(255, 255, 255, 0.2)',
        },
        // Text Colors (Dark Theme)
        text: {
          primary: 'rgba(255, 255, 255, 0.95)',
          secondary: 'rgba(255, 255, 255, 0.70)',
          tertiary: 'rgba(255, 255, 255, 0.50)',
          disabled: 'rgba(255, 255, 255, 0.30)',
          inverse: 'rgba(0, 0, 0, 0.90)',
        },
        // Glass Morphism Colors
        glass: {
          background: 'rgba(255, 255, 255, 0.05)',
          'background-hover': 'rgba(255, 255, 255, 0.08)',
          'background-light': 'rgba(255, 255, 255, 0.10)',
          'background-dark': 'rgba(0, 0, 0, 0.20)',
          border: 'rgba(255, 255, 255, 0.10)',
        },
        // Glow Colors
        glow: {
          primary: 'rgba(59, 130, 246, 0.4)',
          secondary: 'rgba(147, 51, 234, 0.4)',
          success: 'rgba(16, 185, 129, 0.4)',
          warning: 'rgba(245, 158, 11, 0.4)',
          error: 'rgba(239, 68, 68, 0.4)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Display
        'display-2xl': [
          '72px',
          { lineHeight: '90px', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'display-xl': ['60px', { lineHeight: '72px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['48px', { lineHeight: '60px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['36px', { lineHeight: '44px', letterSpacing: '-0.01em', fontWeight: '700' }],
        // Headings
        h1: ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' }],
        h2: ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '700' }],
        h3: ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        h4: ['20px', { lineHeight: '28px', letterSpacing: '-0.005em', fontWeight: '600' }],
        h5: ['18px', { lineHeight: '28px', letterSpacing: '-0.005em', fontWeight: '600' }],
        h6: ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '600' }],
        // Body
        'body-xl': ['20px', { lineHeight: '32px', letterSpacing: '0em', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '28px', letterSpacing: '0em', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '400' }],
        'body-xs': ['12px', { lineHeight: '18px', letterSpacing: '0.01em', fontWeight: '400' }],
        // Labels
        'label-lg': ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '500' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '500' }],
        'label-xs': ['11px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '500' }],
        // Code
        'code-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'code-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'code-sm': ['12px', { lineHeight: '18px', fontWeight: '400' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        // Extends default Tailwind spacing
        '18': '4.5rem', // 72px
        '88': '22rem', // 352px
        '100': '25rem', // 400px
        '112': '28rem', // 448px
        '128': '32rem', // 512px
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
        full: '9999px',
      },
      boxShadow: {
        // Standard Shadows
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        // Glow Shadows
        'glow-sm': '0 0 10px rgba(59, 130, 246, 0.3)',
        'glow-md': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.5)',
        'glow-xl': '0 0 40px rgba(59, 130, 246, 0.6)',
        'glow-purple-sm': '0 0 10px rgba(147, 51, 234, 0.3)',
        'glow-purple-md': '0 0 20px rgba(147, 51, 234, 0.4)',
        'glow-purple-lg': '0 0 30px rgba(147, 51, 234, 0.5)',
        'glow-success-sm': '0 0 10px rgba(16, 185, 129, 0.3)',
        'glow-success-md': '0 0 20px rgba(16, 185, 129, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      backdropSaturate: {
        DEFAULT: '180%',
        glass: '180%',
      },
      transitionDuration: {
        instant: '0ms',
        immediate: '50ms',
        fast: '150ms',
        normal: '250ms',
        moderate: '350ms',
        comfortable: '500ms',
        slow: '700ms',
        deliberate: '1000ms',
      },
      transitionDelay: {
        'stagger-xs': '20ms',
        'stagger-sm': '40ms',
        'stagger-md': '60ms',
        'stagger-lg': '100ms',
        'stagger-xl': '150ms',
      },
      transitionTimingFunction: {
        'ease-smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-snappy': 'cubic-bezier(0.4, 0, 0, 1)',
        'ease-elegant': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-dramatic': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
        'gradient-primary-soft':
          'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
        'gradient-glow':
          'radial-gradient(circle at center, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
        'gradient-ambient': `radial-gradient(ellipse at top, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
          radial-gradient(ellipse at bottom, rgba(147, 51, 234, 0.05) 0%, transparent 50%)`,
      },
      keyframes: {
        // Fade animations
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        // Slide animations
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        // Scale animations
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        // Shimmer animation
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        // Pulse glow animation
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' },
        },
        'pulse-glow-purple': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(147, 51, 234, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(147, 51, 234, 0.6)' },
        },
        // Float animation
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        // Spin animation (already exists in Tailwind but ensuring it's available)
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        // Fade animations
        'fade-in': 'fade-in 0.25s ease-out',
        'fade-out': 'fade-out 0.25s ease-in',
        // Slide animations
        'slide-up': 'slide-up 0.25s ease-out',
        'slide-down': 'slide-down 0.25s ease-out',
        'slide-left': 'slide-left 0.25s ease-out',
        'slide-right': 'slide-right 0.25s ease-out',
        // Scale animations
        'scale-in': 'scale-in 0.25s ease-out',
        'scale-out': 'scale-out 0.25s ease-in',
        // Shimmer animation
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        // Pulse glow animations
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-glow-purple': 'pulse-glow-purple 2s ease-in-out infinite',
        // Float animation
        float: 'float 3s ease-in-out infinite',
        // Spin animation
        spin: 'spin 1s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
};

export default config;
