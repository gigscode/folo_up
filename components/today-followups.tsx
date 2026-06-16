'use client';

import { Button } from '@/components/ui/button';
import FollowUpCard from '@/components/followup-card';

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

interface TodayFollowUpsProps {
  followUps: FollowUpItem[];
  onComplete: () => void;
}

export default function TodayFollowUps({ followUps, onComplete }: TodayFollowUpsProps) {
  if (followUps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No follow-ups for today</p>
        <p className="text-sm text-muted-foreground mt-2">Check back later or add more visitors</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-primary mb-4">
        {followUps.length} {followUps.length === 1 ? 'follow-up' : 'follow-ups'} due today
      </p>
      {followUps.map((followUp) => (
        <FollowUpCard key={followUp.id} followUp={followUp} onComplete={onComplete} />
      ))}
    </div>
  );
}
