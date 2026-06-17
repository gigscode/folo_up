'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDate, getDaysUntilFollowUp } from '@/lib/followup-engine';
import { markFollowUpComplete } from '@/lib/db';

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

interface FollowUpCardProps {
  followUp: FollowUpItem;
  onComplete?: () => void;
  isOverdue?: boolean;
  isPreview?: boolean;
}

export default function FollowUpCard({ followUp, onComplete, isOverdue = false, isPreview = false }: FollowUpCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const cleanPhone = followUp.visitors.phone_number.replace(/[^\d+]/g, '');
  const encodedMessage = encodeURIComponent(followUp.message_template);
  const daysUntil = getDaysUntilFollowUp(followUp.scheduled_date);
  const messageTypeLabel = followUp.message_type.charAt(0).toUpperCase() + followUp.message_type.slice(1).replace('-', ' ');
  const phoneForCall = followUp.visitors.phone_number.replace(/[\s\-\(\)]/g, '');

  const handleOpenWhatsApp = () => {
    // Use whatsapp-business:// scheme directly — on devices where the user
    // has set WhatsApp Business as default this will open it immediately.
    // On devices without WhatsApp Business installed, the OS will fall back
    // to the regular WhatsApp app or prompt to choose.
    window.location.href = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneForCall}`;
  };

  const handleMarkComplete = async () => {
    try {
      setIsLoading(true);
      await markFollowUpComplete(followUp.id);
      onComplete?.();
    } catch (err) {
      console.error('Error marking complete:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`border rounded-lg p-4 transition-colors ${isOverdue ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-card'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">{followUp.visitors.name}</h3>
          <p className="text-sm text-muted-foreground">{followUp.visitors.phone_number}</p>
        </div>
        <div className="text-right">
          <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
            {messageTypeLabel}
          </div>
          <p className={`text-xs font-medium mt-2 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
            {isOverdue && <>Overdue </>}
            {!isPreview && (daysUntil === 0 ? 'Today' : `${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''} ${daysUntil < 0 ? 'overdue' : 'away'}`)}
            {isPreview && <>{formatDate(new Date(followUp.scheduled_date))}</>}
          </p>
        </div>
      </div>

      {/* Message Preview */}
      <div className="bg-secondary/30 rounded p-3 mb-4 text-sm text-foreground line-clamp-3 leading-relaxed">
        {followUp.message_template}
      </div>

      {/* Actions */}
      {!isPreview ? (
        <div className="flex gap-2">
          {/* Visible WhatsApp button with hidden Business link overlaid */}
          <div className="relative flex-1">
            <Button className="w-full font-semibold" size="lg" onClick={handleOpenWhatsApp}>
              WhatsApp
            </Button>
            {/* Hidden anchor that fires whatsapp-business:// — keeps OS default intact */}
            <a
              href={`whatsapp-business://send?phone=${cleanPhone}&text=${encodedMessage}`}
              className="absolute inset-0 opacity-0 pointer-events-none"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
          <Button onClick={handleCall} variant="outline" className="flex-1 font-semibold" size="lg">
            Call
          </Button>
          <Button onClick={handleMarkComplete} disabled={isLoading} variant="outline" size="lg" className="px-4">
            {isLoading ? '...' : '✓'}
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link href={`/visitor/${followUp.visitor_id}`} className="flex-1">
            <Button className="w-full font-semibold" size="lg">
              View Visitor
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
