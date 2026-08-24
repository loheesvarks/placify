/**
 * Edit Project Page - Phase 4B
 */

import { Suspense } from 'react';
import { ProjectEditForm } from './project-edit-form';

export const metadata = {
  title: 'Edit Project | Placify',
  description: 'Edit project information',
};

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 p-6">
      <div className="mx-auto max-w-4xl">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectEditForm projectId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}
