// Database client and functions for FoloUp
// Since Supabase is not connected yet, this file provides the structure
// To use: Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in env

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
  if (!supabase) throw new Error('Database not connected');

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

export async function getVisitor(id: string) {
  if (!supabase) throw new Error('Database not connected');

  const { data, error } = await supabase
    .from('visitors')
    .select()
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getAllVisitors() {
  if (!supabase) throw new Error('Database not connected');

  const { data, error } = await supabase
    .from('visitors')
    .select()
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteVisitor(id: string) {
  if (!supabase) throw new Error('Database not connected');

  const { error } = await supabase
    .from('visitors')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Follow-up operations
export async function createFollowUp(
  visitorId: string,
  scheduledDate: string,
  messageTemplate: string,
  messageType: 'welcome' | 'check-in' | 'invitation' | 'engagement' | 'pastoral'
) {
  if (!supabase) throw new Error('Database not connected');

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

export async function getFollowUpsForVisitor(visitorId: string) {
  if (!supabase) throw new Error('Database not connected');

  const { data, error } = await supabase
    .from('follow_ups')
    .select()
    .eq('visitor_id', visitorId)
    .order('scheduled_date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getAllFollowUps() {
  if (!supabase) throw new Error('Database not connected');

  const { data, error } = await supabase
    .from('follow_ups')
    .select('*, visitors(name, phone_number)')
    .order('scheduled_date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getFollowUpsByDate(date: string) {
  if (!supabase) throw new Error('Database not connected');

  const { data, error } = await supabase
    .from('follow_ups')
    .select('*, visitors(name, phone_number)')
    .eq('scheduled_date', date)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function markFollowUpComplete(id: string) {
  if (!supabase) throw new Error('Database not connected');

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

export async function getFollowUpsForDateRange(startDate: string, endDate: string) {
  if (!supabase) throw new Error('Database not connected');

  const { data, error } = await supabase
    .from('follow_ups')
    .select('*, visitors(name, phone_number)')
    .gte('scheduled_date', startDate)
    .lte('scheduled_date', endDate)
    .order('scheduled_date', { ascending: true });

  if (error) throw error;
  return data;
}

// Analytics
export async function getAnalytics() {
  if (!supabase) throw new Error('Database not connected');

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
