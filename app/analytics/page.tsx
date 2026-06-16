'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import { getAllVisitors, getAllFollowUps } from '@/lib/db';

interface Visitor {
  id: string;
  name: string;
  phone_number: string;
  date_visited: string;
  created_at: string;
}

interface FollowUp {
  id: string;
  visitor_id: string;
  scheduled_date: string;
  message_template: string;
  message_type: string;
  completed: boolean;
}

export default function AnalyticsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      setError(null);

      const [visitorsData, followUpsData] = await Promise.all([
        getAllVisitors(),
        getAllFollowUps(),
      ]);

      setVisitors(visitorsData);
      setFollowUps(followUpsData);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }

  const completedFollowUps = followUps.filter((fu) => fu.completed).length;
  const pendingFollowUps = followUps.filter((fu) => !fu.completed).length;
  const completionRate = followUps.length > 0 ? Math.round((completedFollowUps / followUps.length) * 100) : 0;

  // Follow-up type breakdown
  const typeBreakdown = followUps.reduce(
    (acc, fu) => {
      const key = fu.message_type;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Visitors added per week (last 4 weeks)
  const getWeekKey = (date: Date) => {
    const year = date.getFullYear();
    const week = Math.ceil((date.getDate() - date.getDay() + 1) / 7);
    return `${year}-W${week}`;
  };

  const visitorsPerWeek = visitors.reduce(
    (acc, visitor) => {
      const week = getWeekKey(new Date(visitor.created_at));
      acc[week] = (acc[week] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Campaign performance overview</p>
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
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Total Visitors</p>
                <p className="text-3xl font-bold text-primary mt-2">{visitors.length}</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Total Follow-ups</p>
                <p className="text-3xl font-bold text-primary mt-2">{followUps.length}</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Completed</p>
                <p className="text-3xl font-bold text-primary mt-2">{completedFollowUps}</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Completion Rate</p>
                <p className="text-3xl font-bold text-primary mt-2">{completionRate}%</p>
              </div>
            </div>

            {/* Pending Follow-ups */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-lg font-bold text-foreground mb-3">Pending Follow-ups</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-accent">{pendingFollowUps}</span>
                <span className="text-sm text-muted-foreground">actions awaiting execution</span>
              </div>
            </div>

            {/* Follow-up Type Breakdown */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-lg font-bold text-foreground mb-4">Follow-up Types</h2>
              <div className="space-y-3">
                {Object.entries(typeBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground">
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground">{count}</p>
                      </div>
                      <div className="w-full bg-secondary/50 rounded h-2">
                        <div
                          className="bg-primary h-2 rounded"
                          style={{
                            width: `${(count / followUps.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Empty State */}
            {visitors.length === 0 && (
              <div className="text-center py-12 bg-secondary/30 border border-border rounded-lg">
                <p className="text-muted-foreground mb-4">No data yet</p>
                <Link href="/add-visitor">
                  <button className="text-primary font-semibold hover:underline">Add your first visitor</button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
