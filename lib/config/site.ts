/**
 * Site configuration
 * Centralized application metadata
 */

export const SITE_CONFIG = {
  name: 'Placify',
  description: 'AI-Powered Placement Preparation Platform',
  tagline: 'Your AI-powered companion for placement success',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  author: {
    name: 'Placify Team',
    url: 'https://placify.app',
  },
  
  social: {
    twitter: '@placify',
    github: 'placify',
  },
  
  keywords: [
    'placement preparation',
    'interview prep',
    'coding practice',
    'AI mentor',
    'career guidance',
  ],
} as const;

export const SEO_DEFAULTS = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords.join(', '),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE_CONFIG.social.twitter,
  },
} as const;
