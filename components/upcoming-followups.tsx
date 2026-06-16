'use client';

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

interface UpcomingFollowUpsProps {
  followUps: FollowUpItem[];
}

export default function UpcomingFollowUps({ followUps }: UpcomingFollowUpsProps) {
  if (followUps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No upcoming follow-ups</p>
        <p className="text-sm text-muted-foreground mt-2">Add visitors to schedule follow-ups</p>
      </div>
    );
  }

  // Sort by days until due (soonest first)
  const sorted = [...followUps].sort((a, b) => {
    const daysA = getDaysUntilFollowUp(a.scheduled_date);
    const daysB = getDaysUntilFollowUp(b.scheduled_date);
    return daysA - daysB;
  });

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-muted-foreground mb-4">
        {followUps.length} {followUps.length === 1 ? 'follow-up' : 'follow-ups'} scheduled
      </p>
      {sorted.map((followUp) => (
        <FollowUpCard key={followUp.id} followUp={followUp} isPreview={true} />
      ))}
    </div>
  );
}
