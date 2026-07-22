# Placify

AI-Powered Placement Preparation Platform

## Description

Placify is an AI-powered placement preparation platform designed to provide personalized, adaptive learning experiences for college students, fresh graduates, and job seekers. The platform creates intelligent roadmaps tailored to individual goals, skills, and constraints, delivering a premium SaaS experience.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4 Turbo
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd placify
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
placify/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── (onboarding)/      # Onboarding flow
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layouts/          # Layout components
│   └── features/         # Feature-specific components
├── lib/                   # Utilities and libraries
│   ├── actions/          # Server actions
│   ├── hooks/            # Custom hooks
│   ├── stores/           # Zustand stores
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── validations/      # Zod schemas
└── public/                # Static assets
```

## Design Philosophy

- **Purposeful Minimalism**: Every pixel has intent
- **Intelligent Hierarchy**: Information architecture that guides
- **Fluid Motion**: Natural, smooth transitions
- **Adaptive Precision**: Responsive to user context
- **Premium Accessibility**: WCAG 2.1 AA compliance

## License

Proprietary - All rights reserved

## Support

For support, email support@placify.com
