'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/navigation';
import PageHeader from '@/components/page-header';
import TodayFollowUps from '@/components/today-followups';
import OverdueFollowUps from '@/components/overdue-followups';
import UpcomingFollowUps from '@/components/upcoming-followups';
import { getAllFollowUps } from '@/lib/db';
import { getFollowUpStatus } from '@/lib/followup-engine';

interface FollowUpItem {
  id: string;
  visitor_id: string;
  scheduled_date: string;
  message_template: string;
  message_type: string;
  completed: boolean;
  visitors: {
    name: string;
    phone_number: string;
  };
}

export default function Dashboard() {
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'overdue' | 'upcoming'>('today');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFollowUps();
  }, []);

  async function loadFollowUps() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllFollowUps();
      // Filter out completed follow-ups for display
      const incomplete = data.filter((fu: FollowUpItem) => !fu.completed);
      setFollowUps(incomplete);
    } catch (err) {
      console.error('Error loading follow-ups:', err);
      setError('Failed to load follow-ups');
    } finally {
      setIsLoading(false);
    }
  }

  const todayFollowUps = followUps.filter((fu) => getFollowUpStatus(fu.scheduled_date, fu.completed) === 'today');
  const overdueFollowUps = followUps.filter((fu) => getFollowUpStatus(fu.scheduled_date, fu.completed) === 'overdue');
  const upcomingFollowUps = followUps.filter((fu) => getFollowUpStatus(fu.scheduled_date, fu.completed) === 'upcoming');

  return (
    <div className="pb-20">
      {/* Header */}
      <PageHeader />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6 text-destructive text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading follow-ups...</p>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-border">
              <button
                onClick={() => setActiveTab('today')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'today'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Today{todayFollowUps.length > 0 && ` (${todayFollowUps.length})`}
              </button>
              <button
                onClick={() => setActiveTab('overdue')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'overdue'
                    ? 'border-destructive text-destructive'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Overdue{overdueFollowUps.length > 0 && ` (${overdueFollowUps.length})`}
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'upcoming'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Upcoming{upcomingFollowUps.length > 0 && ` (${upcomingFollowUps.length})`}
              </button>
            </div>

            {/* Content */}
            {activeTab === 'today' && <TodayFollowUps followUps={todayFollowUps} onComplete={loadFollowUps} />}
            {activeTab === 'overdue' && <OverdueFollowUps followUps={overdueFollowUps} onComplete={loadFollowUps} />}
            {activeTab === 'upcoming' && <UpcomingFollowUps followUps={upcomingFollowUps} />}

            {/* Empty State */}
            {followUps.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No follow-ups scheduled yet</p>
                <Link href="/add-visitor">
                  <Button>Add Your First Visitor</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
