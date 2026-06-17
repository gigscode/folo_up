'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/navigation';
import FollowUpCard from '@/components/followup-card';
import { getVisitor, getFollowUpsForVisitor, deleteVisitor, updateVisitorNotes } from '@/lib/db';
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

interface FollowUp {
  id: string;
  visitor_id: string;
  scheduled_date: string;
  message_template: string;
  message_type: string;
  completed: boolean;
  visitors?: {
    name: string;
    phone_number: string;
  };
}

export default function VisitorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const visitorId = params.id as string;

  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    loadVisitorData();
  }, [visitorId]);

  async function loadVisitorData() {
    try {
      setIsLoading(true);
      setError(null);

      const visitorData = await getVisitor(visitorId);
      setVisitor(visitorData);

      const followUpData = await getFollowUpsForVisitor(visitorId);
      // Add visitor info to each follow-up
      const withVisitorInfo = followUpData.map((fu: FollowUp) => ({
        ...fu,
        visitors: {
          name: visitorData.name,
          phone_number: visitorData.phone_number,
        },
      }));
      setFollowUps(withVisitorInfo);
    } catch (err) {
      console.error('Error loading visitor:', err);
      setError('Failed to load visitor profile');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteVisitor = async () => {
    if (!visitor) return;

    if (!confirm('Are you sure you want to delete this visitor and all their follow-ups?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteVisitor(visitorId);
      router.push('/visitors');
    } catch (err) {
      console.error('Error deleting visitor:', err);
      setError('Failed to delete visitor');
      setIsDeleting(false);
    }
  };

  const handleEditNotes = () => {
    setNotesDraft(visitor?.notes || '');
    setIsEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    if (!visitor) return;

    try {
      setIsSavingNotes(true);
      await updateVisitorNotes(visitor.id, notesDraft);
      setVisitor({ ...visitor, notes: notesDraft });
      setIsEditingNotes(false);
    } catch (err) {
      console.error('Error saving notes:', err);
      setError('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleCancelNotes = () => {
    setIsEditingNotes(false);
    setNotesDraft('');
  };

  if (isLoading) {
    return (
      <div className="pb-20">
        <header className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/visitors">
              <button className="text-2xl hover:opacity-80">←</button>
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading visitor profile...</p>
        </div>
        <Navigation />
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="pb-20">
        <header className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/visitors">
              <button className="text-2xl hover:opacity-80">←</button>
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Visitor not found</p>
        </div>
        <Navigation />
      </div>
    );
  }

  const completedFollowUps = followUps.filter((fu) => fu.completed);
  const pendingFollowUps = followUps.filter((fu) => !fu.completed);
  const nextFollowUp = pendingFollowUps[0];

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/visitors">
              <button className="text-2xl hover:opacity-80">←</button>
            </Link>
            <Button
              onClick={handleDeleteVisitor}
              disabled={isDeleting}
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              Delete
            </Button>
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

        {/* Visitor Info Card */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-4">{visitor.name}</h1>

          <div className="space-y-3 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Phone Number</p>
              <p className="text-lg font-medium text-foreground mt-1">{visitor.phone_number}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Date Visited</p>
                <p className="text-lg font-medium text-foreground mt-1">{formatDate(new Date(visitor.date_visited))}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Member Since</p>
                <p className="text-lg font-medium text-foreground mt-1">{formatDate(new Date(visitor.created_at))}</p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="pt-4 border-t border-border mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Notes</p>
              {!isEditingNotes && (
                <Button
                  onClick={handleEditNotes}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {visitor.notes ? 'Edit' : 'Add'}
                </Button>
              )}
            </div>
            
            {isEditingNotes ? (
              <div className="space-y-3">
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Add notes about this visitor..."
                  className="w-full min-h-24 p-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    size="sm"
                    className="flex-1"
                  >
                    {isSavingNotes ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={handleCancelNotes}
                    disabled={isSavingNotes}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-background rounded-lg p-3 min-h-12 text-foreground">
                {visitor.notes ? (
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{visitor.notes}</p>
                ) : (
                  <p className="text-muted-foreground text-sm italic">No notes yet</p>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
            <div className="text-center py-3">
              <p className="text-2xl font-bold text-primary">{completedFollowUps.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Completed Follow-ups</p>
            </div>
            <div className="text-center py-3">
              <p className="text-2xl font-bold text-primary">{pendingFollowUps.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Pending Follow-ups</p>
            </div>
          </div>
        </div>

        {/* Next Follow-up */}
        {nextFollowUp && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground mb-3">Next Follow-up</h2>
            <FollowUpCard followUp={nextFollowUp} onComplete={loadVisitorData} />
          </div>
        )}

        {/* Follow-up Timeline */}
        {followUps.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Follow-up Timeline</h2>
            <div className="space-y-3">
              {followUps.map((followUp) => (
                <div
                  key={followUp.id}
                  className={`border rounded-lg p-3 ${
                    followUp.completed
                      ? 'border-border bg-secondary/30 opacity-60'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {followUp.message_type.charAt(0).toUpperCase() + followUp.message_type.slice(1).replace('-', ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date(followUp.scheduled_date))}
                        {followUp.completed && ' — Completed'}
                      </p>
                    </div>
                    {followUp.completed && <span className="text-lg">✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
