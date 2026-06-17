'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/navigation';
import { getAllVisitors } from '@/lib/db';
import { formatDate } from '@/lib/followup-engine';

interface Visitor {
  id: string;
  name: string;
  phone_number: string;
  date_visited: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVisitors();
  }, []);

  async function loadVisitors() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllVisitors();
      setVisitors(data);
    } catch (err) {
      console.error('Error loading visitors:', err);
      setError('Failed to load visitors');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">All Visitors</h1>
              <p className="text-sm text-muted-foreground mt-1">{visitors.length} total</p>
            </div>
            <Link href="/add-visitor">
              <Button size="lg" className="font-semibold">
                + Add
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6 text-destructive text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading visitors...</p>
          </div>
        ) : visitors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No visitors yet</p>
            <Link href="/add-visitor">
              <Button>Add Your First Visitor</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {visitors.map((visitor) => (
              <Link key={visitor.id} href={`/visitor/${visitor.id}`}>
                <div className="border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">{visitor.name}</h3>
                      <p className="text-sm text-muted-foreground">{visitor.phone_number}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Visited</p>
                      <p className="font-medium text-foreground">{formatDate(new Date(visitor.date_visited))}</p>
                    </div>
                  </div>
                  {visitor.notes && (
                    <p className="text-xs text-muted-foreground bg-secondary/30 rounded p-2 line-clamp-2">
                      {visitor.notes}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
