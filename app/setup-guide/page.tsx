'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SetupGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/">
            <button className="text-2xl hover:opacity-80">←</button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Setup Guide</h1>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex gap-4 mb-3">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm">
                1
              </div>
              <h2 className="text-lg font-bold text-foreground">Set up Supabase Project</h2>
            </div>
            <p className="text-muted-foreground mb-3">
              Create a new Supabase project or use an existing one. Go to{' '}
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                supabase.com
              </a>{' '}
              and create your project.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex gap-4 mb-3">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm">
                2
              </div>
              <h2 className="text-lg font-bold text-foreground">Create Database Schema</h2>
            </div>
            <p className="text-muted-foreground mb-3">
              In your Supabase project, go to SQL Editor and create a new query. Copy and paste the following SQL:
            </p>
            <div className="bg-secondary/50 rounded p-4 overflow-x-auto mb-3">
              <code className="text-xs text-foreground font-mono whitespace-pre-wrap break-words">
                {`-- Create visitors table
CREATE TABLE visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  date_visited DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create follow-ups table
CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  message_template TEXT NOT NULL,
  message_type VARCHAR(50) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_visitors_created_at ON visitors(created_at);
CREATE INDEX idx_follow_ups_visitor_id ON follow_ups(visitor_id);
CREATE INDEX idx_follow_ups_scheduled_date ON follow_ups(scheduled_date);
CREATE INDEX idx_follow_ups_completed ON follow_ups(completed);`}
              </code>
            </div>
            <p className="text-sm text-muted-foreground">Click "Run" to execute the SQL.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex gap-4 mb-3">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm">
                3
              </div>
              <h2 className="text-lg font-bold text-foreground">Get Your Credentials</h2>
            </div>
            <p className="text-muted-foreground mb-3">
              In your Supabase project:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-6 mb-3">
              <li>• Click "Settings" in the left sidebar</li>
              <li>• Go to "API" tab</li>
              <li>• Find your <code className="bg-secondary/50 px-2 py-1 rounded font-mono text-xs">Project URL</code> and <code className="bg-secondary/50 px-2 py-1 rounded font-mono text-xs">anon public</code> key</li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex gap-4 mb-3">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm">
                4
              </div>
              <h2 className="text-lg font-bold text-foreground">Add Environment Variables</h2>
            </div>
            <p className="text-muted-foreground mb-3">
              In your FoloUp app settings (click the settings button in the top right), add these env vars:
            </p>
            <div className="bg-secondary/50 rounded p-4 space-y-2 mb-3">
              <div>
                <p className="text-xs font-mono font-semibold text-foreground">NEXT_PUBLIC_SUPABASE_URL</p>
                <p className="text-sm text-muted-foreground">Paste your Project URL here</p>
              </div>
              <div>
                <p className="text-xs font-mono font-semibold text-foreground">NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
                <p className="text-sm text-muted-foreground">Paste your anon public key here</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Note: These are "public" keys meant for client-side use. They&apos;re safe to expose in your browser.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex gap-4 mb-3">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm">
                5
              </div>
              <h2 className="text-lg font-bold text-foreground">Refresh and Go!</h2>
            </div>
            <p className="text-muted-foreground">
              Reload this page. FoloUp should now be ready to use. You&apos;ll see the dashboard and can start adding visitors!
            </p>
          </div>

          {/* Troubleshooting */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
            <h2 className="text-lg font-bold text-primary mb-3">Troubleshooting</h2>
            <div className="space-y-3 text-sm text-primary">
              <div>
                <p className="font-semibold">Still seeing the setup screen?</p>
                <p className="text-xs mt-1">Clear your browser cache or do a hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)</p>
              </div>
              <div>
                <p className="font-semibold">Getting errors when adding visitors?</p>
                <p className="text-xs mt-1">Make sure your Supabase credentials are correct and the database tables were created successfully</p>
              </div>
              <div>
                <p className="font-semibold">WhatsApp links not working?</p>
                <p className="text-xs mt-1">Ensure phone numbers include country codes (e.g., +1 for USA). WhatsApp requires the full international format</p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex gap-3">
            <Link href="/" className="flex-1">
              <Button className="w-full font-semibold" size="lg">
                Back to FoloUp
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
