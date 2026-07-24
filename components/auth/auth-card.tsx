import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Reusable card wrapper for authentication pages
 * Provides consistent styling with glass morphism effect
 */
export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card variant="elevated" padding="lg" animated>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
        {description && (
          <CardDescription className="text-center mt-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
