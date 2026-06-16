'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/dashboard';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  // Show dashboard with mock data if Supabase is not connected
  return (
    <main className="min-h-screen bg-background">
      <Dashboard />
    </main>
  );
}
