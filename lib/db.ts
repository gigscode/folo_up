// Database client and functions for FoloUp
// Using mock/localStorage data for development without Supabase
// To switch to Supabase: Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in env

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase client (if env vars are available)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Check if database is connected
export function isDatabaseConnected(): boolean {
  return supabase !== null;
}

// Mock data storage
let mockVisitors: Visitor[] = [];
let mockFollowUps: FollowUp[] = [];
let initialized = false;

function initializeMockData() {
  if (initialized) return;
  initialized = true;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const twoYearsAgo = new Date(today);
  twoYearsAgo.setDate(twoYearsAgo.getDate() - 2);
  const fiveDaysAgo = new Date(today);
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  // Sample visitor data
  mockVisitors = [
    {
      id: 'visitor-1',
      name: 'John Okafor',
      phone_number: '+234 903 7121 917',
      date_visited: twoYearsAgo.toISOString().split('T')[0],
      created_at: twoYearsAgo.toISOString(),
      updated_at: twoYearsAgo.toISOString(),
    },
    {
      id: 'visitor-2',
      name: 'Ade Adeleke',
      phone_number: '+234 701 8643 642',
      date_visited: fiveDaysAgo.toISOString().split('T')[0],
      created_at: fiveDaysAgo.toISOString(),
      updated_at: fiveDaysAgo.toISOString(),
    },
    {
      id: 'visitor-3',
      name: 'Grace Chimeze',
      phone_number: '+234 915 234 5678',
      date_visited: today.toISOString().split('T')[0],
      created_at: today.toISOString(),
      updated_at: today.toISOString(),
    },
  ];

  // Generate follow-ups for each visitor
  mockFollowUps = [];
  mockVisitors.forEach((visitor) => {
    const visitDate = new Date(visitor.date_visited);
    const followUpDays = [0, 2, 5, 10, 20];
    const messageTypes: Array<'welcome' | 'check-in' | 'invitation' | 'engagement' | 'pastoral'> = [
      'welcome',
      'check-in',
      'invitation',
      'engagement',
      'pastoral',
    ];
    const messages = [
      'Welcome to our church! We are so glad you visited us. Looking forward to seeing you again.',
      'Hi, we hope you had a blessed time at our service last time. How are you doing?',
      'You are invited to join us for a special event this weekend. We would love to see you there!',
      'We wanted to check in and see how you are doing. Your presence at church means a lot to us.',
      'We care about your spiritual journey. Is there anything we can pray for you about?',
    ];

    followUpDays.forEach((days, index) => {
      const scheduledDate = new Date(visitDate);
      scheduledDate.setDate(scheduledDate.getDate() + days);
      const isCompleted = scheduledDate < today && Math.random() > 0.4;

      mockFollowUps.push({
        id: `followup-${visitor.id}-${days}`,
        visitor_id: visitor.id,
        scheduled_date: scheduledDate.toISOString().split('T')[0],
        message_template: messages[index],
        message_type: messageTypes[index],
        completed: isCompleted,
        completed_at: isCompleted ? new Date(scheduledDate.getTime() + 86400000).toISOString() : null,
        created_at: visitDate.toISOString(),
        updated_at: visitDate.toISOString(),
      });
    });
  });
}

// Types for database
export interface Visitor {
  id: string;
  name: string;
  phone_number: string;
  date_visited: string;
  created_at: string;
  updated_at: string;
}

export interface FollowUp {
  id: string;
  visitor_id: string;
  scheduled_date: string;
  message_template: string;
  message_type: 'welcome' | 'check-in' | 'invitation' | 'engagement' | 'pastoral';
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Visitor operations
export async function createVisitor(name: string, phoneNumber: string, dateVisited: string) {
  if (supabase) {
    const { data, error } = await supabase
      .from('visitors')
      .insert([
        {
          name,
          phone_number: phoneNumber,
          date_visited: dateVisited,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Mock data mode
  initializeMockData();
  const id = `visitor-${Date.now()}`;
  const now = new Date().toISOString();
  const visitor: Visitor = {
    id,
    name,
    phone_number: phoneNumber,
    date_visited: dateVisited,
    created_at: now,
    updated_at: now,
  };

  mockVisitors.push(visitor);

  // Create follow-ups for new visitor
  const visitDate = new Date(dateVisited);
  const followUpDays = [0, 2, 5, 10, 20];
  const messageTypes: Array<'welcome' | 'check-in' | 'invitation' | 'engagement' | 'pastoral'> = [
    'welcome',
    'check-in',
    'invitation',
    'engagement',
    'pastoral',
  ];
  const messages = [
    'Welcome to our church! We are so glad you visited us. Looking forward to seeing you again.',
    'Hi, we hope you had a blessed time at our service last time. How are you doing?',
    'You are invited to join us for a special event this weekend. We would love to see you there!',
    'We wanted to check in and see how you are doing. Your presence at church means a lot to us.',
    'We care about your spiritual journey. Is there anything we can pray for you about?',
  ];

  followUpDays.forEach((days, index) => {
    const scheduledDate = new Date(visitDate);
    scheduledDate.setDate(scheduledDate.getDate() + days);

    mockFollowUps.push({
      id: `followup-${id}-${days}`,
      visitor_id: id,
      scheduled_date: scheduledDate.toISOString().split('T')[0],
      message_template: messages[index],
      message_type: messageTypes[index],
      completed: false,
      completed_at: null,
      created_at: now,
      updated_at: now,
    });
  });

  return visitor;
}

export async function getVisitor(id: string) {
  if (supabase) {
    const { data, error } = await supabase
      .from('visitors')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  initializeMockData();
  return mockVisitors.find((v) => v.id === id) || null;
}

export async function getAllVisitors() {
  if (supabase) {
    const { data, error } = await supabase
      .from('visitors')
      .select()
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  initializeMockData();
  return [...mockVisitors].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function deleteVisitor(id: string) {
  if (supabase) {
    const { error } = await supabase
      .from('visitors')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return;
  }

  initializeMockData();
  mockVisitors = mockVisitors.filter((v) => v.id !== id);
  mockFollowUps = mockFollowUps.filter((f) => f.visitor_id !== id);
}

// Follow-up operations
export async function createFollowUp(
  visitorId: string,
  scheduledDate: string,
  messageTemplate: string,
  messageType: 'welcome' | 'check-in' | 'invitation' | 'engagement' | 'pastoral'
) {
  if (supabase) {
    const { data, error } = await supabase
      .from('follow_ups')
      .insert([
        {
          visitor_id: visitorId,
          scheduled_date: scheduledDate,
          message_template: messageTemplate,
          message_type: messageType,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  initializeMockData();
  const now = new Date().toISOString();
  const followUp: FollowUp = {
    id: `followup-${Date.now()}`,
    visitor_id: visitorId,
    scheduled_date: scheduledDate,
    message_template: messageTemplate,
    message_type: messageType,
    completed: false,
    completed_at: null,
    created_at: now,
    updated_at: now,
  };

  mockFollowUps.push(followUp);
  return followUp;
}

export async function getFollowUpsForVisitor(visitorId: string) {
  if (supabase) {
    const { data, error } = await supabase
      .from('follow_ups')
      .select()
      .eq('visitor_id', visitorId)
      .order('scheduled_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  initializeMockData();
  return mockFollowUps.filter((f) => f.visitor_id === visitorId).sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));
}

export async function getAllFollowUps() {
  if (supabase) {
    const { data, error } = await supabase
      .from('follow_ups')
      .select('*, visitors(name, phone_number)')
      .order('scheduled_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  initializeMockData();
  const followUpsWithVisitors = mockFollowUps.map((f) => {
    const visitor = mockVisitors.find((v) => v.id === f.visitor_id);
    return {
      ...f,
      visitors: visitor ? { name: visitor.name, phone_number: visitor.phone_number } : null,
    };
  });
  return followUpsWithVisitors.sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));
}

export async function getFollowUpsByDate(date: string) {
  if (supabase) {
    const { data, error } = await supabase
      .from('follow_ups')
      .select('*, visitors(name, phone_number)')
      .eq('scheduled_date', date)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  initializeMockData();
  const followUpsForDate = mockFollowUps.filter((f) => f.scheduled_date === date);
  return followUpsForDate.map((f) => {
    const visitor = mockVisitors.find((v) => v.id === f.visitor_id);
    return {
      ...f,
      visitors: visitor ? { name: visitor.name, phone_number: visitor.phone_number } : null,
    };
  });
}

export async function markFollowUpComplete(id: string) {
  if (supabase) {
    const { data, error } = await supabase
      .from('follow_ups')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  initializeMockData();
  const followUp = mockFollowUps.find((f) => f.id === id);
  if (followUp) {
    followUp.completed = true;
    followUp.completed_at = new Date().toISOString();
    followUp.updated_at = new Date().toISOString();
  }
  return followUp;
}

export async function getFollowUpsForDateRange(startDate: string, endDate: string) {
  if (supabase) {
    const { data, error } = await supabase
      .from('follow_ups')
      .select('*, visitors(name, phone_number)')
      .gte('scheduled_date', startDate)
      .lte('scheduled_date', endDate)
      .order('scheduled_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  initializeMockData();
  const followUpsInRange = mockFollowUps.filter((f) => f.scheduled_date >= startDate && f.scheduled_date <= endDate);
  return followUpsInRange.map((f) => {
    const visitor = mockVisitors.find((v) => v.id === f.visitor_id);
    return {
      ...f,
      visitors: visitor ? { name: visitor.name, phone_number: visitor.phone_number } : null,
    };
  });
}

// Analytics
export async function getAnalytics() {
  if (supabase) {
    const { data: visitorsCount, error: visitorsError } = await supabase
      .from('visitors')
      .select('id', { count: 'exact', head: true });

    const { data: completedCount, error: completedError } = await supabase
      .from('follow_ups')
      .select('id', { count: 'exact', head: true })
      .eq('completed', true);

    const { data: pendingCount, error: pendingError } = await supabase
      .from('follow_ups')
      .select('id', { count: 'exact', head: true })
      .eq('completed', false);

    if (visitorsError || completedError || pendingError) {
      throw new Error('Error fetching analytics');
    }

    return {
      totalVisitors: visitorsCount?.length || 0,
      completedFollowUps: completedCount?.length || 0,
      pendingFollowUps: pendingCount?.length || 0,
    };
  }

  initializeMockData();
  const completed = mockFollowUps.filter((f) => f.completed).length;
  const pending = mockFollowUps.filter((f) => !f.completed).length;

  return {
    totalVisitors: mockVisitors.length,
    completedFollowUps: completed,
    pendingFollowUps: pending,
  };
}
