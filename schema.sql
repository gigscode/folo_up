-- FoloUp Database Schema
-- Create this in your Supabase project

-- Visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  date_visited DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follow-ups table
CREATE TABLE IF NOT EXISTS follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  message_template TEXT NOT NULL,
  message_type VARCHAR(50) NOT NULL, -- 'welcome', 'check-in', 'invitation', 'engagement', 'pastoral'
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON visitors(created_at);
CREATE INDEX IF NOT EXISTS idx_follow_ups_visitor_id ON follow_ups(visitor_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_scheduled_date ON follow_ups(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_follow_ups_completed ON follow_ups(completed);

-- Disable Row Level Security (RLS) for anonymous access
ALTER TABLE visitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups DISABLE ROW LEVEL SECURITY;

-- Grant access privileges to anon and authenticated roles
GRANT ALL ON public.visitors TO anon, authenticated, service_role;
GRANT ALL ON public.follow_ups TO anon, authenticated, service_role;

-- Message templates table
CREATE TABLE IF NOT EXISTS message_templates (
  key VARCHAR(50) PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable Row Level Security (RLS) for anonymous access
ALTER TABLE message_templates DISABLE ROW LEVEL SECURITY;

-- Grant access privileges to anon and authenticated roles
GRANT ALL ON public.message_templates TO anon, authenticated, service_role;

-- Insert default message templates if they do not exist
INSERT INTO message_templates (key, message) VALUES
  ('welcome', 'Welcome to our church! We are so glad you visited us. Looking forward to seeing you again.'),
  ('check-in', 'Hi, we hope you had a blessed time at our service last time. How are you doing?'),
  ('invitation', 'You are invited to join us for a special event this weekend. We would love to see you there!'),
  ('engagement', 'We wanted to check in and see how you are doing. Your presence at church means a lot to us.'),
  ('pastoral', 'We care about your spiritual journey. Is there anything we can pray for you about?')
ON CONFLICT (key) DO NOTHING;


