/**
 * Projects Page - Phase 4B
 * 
 * Main projects list and management interface
 */

import { Suspense } from 'react';
import { ProjectsContent } from './projects-content';
import { ProjectsLoadingState } from '@/components/projects/projects-loading';

export const metadata = {
  title: 'Projects | Placify',
  description: 'Manage your project portfolio and skill evidence',
};

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsLoadingState />}>
      <ProjectsContent />
    </Suspense>
  );
}
