/**
 * New Project Page - Phase 4B
 * 
 * Project creation form
 */

import { Suspense } from 'react';
import { ProjectForm } from '@/components/projects/project-form';

export const metadata = {
  title: 'New Project | Placify',
  description: 'Create a new project',
};

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 p-6">
      <div className="mx-auto max-w-4xl">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectForm />
        </Suspense>
      </div>
    </div>
  );
}
