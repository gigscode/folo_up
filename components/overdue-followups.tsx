'use client';

import { Button } from '@/components/ui/button';
import FollowUpCard from '@/components/followup-card';
import { getDaysUntilFollowUp } from '@/lib/followup-engine';

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

interface OverdueFollowUpsProps {
  followUps: FollowUpItem[];
  onComplete: () => void;
}

export default function OverdueFollowUps({ followUps, onComplete }: OverdueFollowUpsProps) {
  if (followUps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No overdue follow-ups</p>
        <p className="text-sm text-muted-foreground mt-2">Great job staying on top of things!</p>
      </div>
    );
  }

  // Sort by days overdue (most recent first)
  const sorted = [...followUps].sort((a, b) => {
    const daysA = Math.abs(getDaysUntilFollowUp(a.scheduled_date));
    const daysB = Math.abs(getDaysUntilFollowUp(b.scheduled_date));
    return daysA - daysB;
  });

  return (
    <div className="space-y-3">
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-4">
        <p className="text-sm font-semibold text-destructive">
          {followUps.length} {followUps.length === 1 ? 'follow-up is' : 'follow-ups are'} overdue
        </p>
      </div>
      {sorted.map((followUp) => (
        <FollowUpCard key={followUp.id} followUp={followUp} onComplete={onComplete} isOverdue={true} />
      ))}
    </div>
  );
}
