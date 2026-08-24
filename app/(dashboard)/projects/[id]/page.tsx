/**
 * Project Detail Page - Phase 4B
 * 
 * View and manage individual project
 */

import { Suspense } from 'react';
import { ProjectDetail } from './project-detail';

export const metadata = {
  title: 'Project Details | Placify',
  description: 'View project details and evidence',
};

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 p-6">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectDetail projectId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}
