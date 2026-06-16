'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Dashboard from '@/components/dashboard';
import { isDatabaseConnected } from '@/lib/db';

export default function Home() {
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsDbConnected(isDatabaseConnected());
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

  if (!isDbConnected) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-foreground">FoloUp Setup Required</h1>
          <p className="text-muted-foreground mb-6">
            To use FoloUp, you need to connect Supabase. Please add the following environment variables:
          </p>
          <ul className="text-left bg-secondary/50 rounded-lg p-4 mb-6 text-sm font-mono">
            <li className="mb-2">NEXT_PUBLIC_SUPABASE_URL</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          </ul>
          <p className="text-sm text-muted-foreground mb-6">
            Then create the database schema by running the SQL in <code className="bg-secondary/50 px-2 py-1 rounded">schema.sql</code>
          </p>
          <Link href="/setup-guide">
            <Button className="w-full">View Setup Guide</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Dashboard />
    </main>
  );
}
