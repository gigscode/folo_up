'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/navigation';
import { createVisitor, createFollowUp } from '@/lib/db';
import { FOLLOWUP_SCHEDULE, calculateScheduledDate, formatDateForDb, isValidPhoneNumber } from '@/lib/followup-engine';

export default function AddVisitorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    dateVisited: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter visitor&apos;s name');
      return;
    }

    if (!isValidPhoneNumber(formData.phoneNumber)) {
      setError('Please enter a valid phone number (at least 10 digits)');
      return;
    }

    if (!formData.dateVisited) {
      setError('Please select a visit date');
      return;
    }

    try {
      setIsLoading(true);

      // Create visitor
      const visitor = await createVisitor(
        formData.name.trim(),
        formData.phoneNumber.trim(),
        formData.dateVisited
      );

      // Create follow-up schedule
      for (const schedule of FOLLOWUP_SCHEDULE) {
        const scheduledDate = calculateScheduledDate(new Date(formData.dateVisited), schedule.daysAfter);
        await createFollowUp(
          visitor.id,
          formatDateForDb(scheduledDate),
          schedule.template,
          schedule.type
        );
      }

      // Redirect to visitor profile
      router.push(`/visitor/${visitor.id}`);
    } catch (err) {
      console.error('Error creating visitor:', err);
      setError('Failed to add visitor. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="text-2xl hover:opacity-80">←</button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Add Visitor</h1>
              <p className="text-sm text-muted-foreground">Create a new visitor record</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
              Visitor&apos;s Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              disabled={isLoading}
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-foreground mb-2">
              Phone Number (with country code)
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="e.g., +1234567890"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Include country code (e.g., +1 for USA, +44 for UK)
            </p>
          </div>

          {/* Date Field */}
          <div>
            <label htmlFor="dateVisited" className="block text-sm font-semibold text-foreground mb-2">
              Date Visited
            </label>
            <input
              type="date"
              id="dateVisited"
              name="dateVisited"
              value={formData.dateVisited}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              disabled={isLoading}
            />
          </div>

          {/* Info Box */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-sm text-primary">
            <p className="font-semibold mb-2">Follow-up Schedule</p>
            <ul className="space-y-1 text-xs">
              <li>• Day 0: Welcome message</li>
              <li>• Day 2: Check-in</li>
              <li>• Day 5: Invitation</li>
              <li>• Day 10: Engagement follow-up</li>
              <li>• Day 20: Pastoral care message</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full font-semibold" size="lg" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-1 font-semibold"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Visitor'}
            </Button>
          </div>
        </form>
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
