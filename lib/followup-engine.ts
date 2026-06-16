// Follow-up Engine - Generates follow-up schedule and messages
export interface FollowUp {
  daysAfter: number;
  type: 'welcome' | 'check-in' | 'invitation' | 'engagement' | 'pastoral';
  template: string;
}

export const FOLLOWUP_SCHEDULE: FollowUp[] = [
  {
    daysAfter: 0,
    type: 'welcome',
    template: 'Hi {name}! Welcome to {churchName}. We&apos;re so glad you visited us. If you have any questions, feel free to reach out!',
  },
  {
    daysAfter: 2,
    type: 'check-in',
    template: 'Hi {name}, just checking in to see how you&apos;re doing. We loved meeting you last Sunday. Hope to see you again soon!',
  },
  {
    daysAfter: 5,
    type: 'invitation',
    template: 'Hi {name}! We&apos;re hosting a small group gathering this week. Would you like to join us and get to know more people from our church?',
  },
  {
    daysAfter: 10,
    type: 'engagement',
    template: 'Hi {name}! We wanted to know how you&apos;re settling in. Is there anything we can help with or any way we can serve you better?',
  },
  {
    daysAfter: 20,
    type: 'pastoral',
    template: 'Hi {name}, we&apos;ve been thinking about you and wanted to check in. How can our church community support you and your family?',
  },
];

// Calculate scheduled date for a follow-up
export function calculateScheduledDate(visitDate: Date, daysAfter: number): Date {
  const date = new Date(visitDate);
  date.setDate(date.getDate() + daysAfter);
  return date;
}

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format date to YYYY-MM-DD for database
export function formatDateForDb(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parse date from YYYY-MM-DD string
export function parseDbDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00Z');
}

// Get status of follow-ups
export function getFollowUpStatus(
  scheduledDate: string,
  completed: boolean
): 'today' | 'overdue' | 'upcoming' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scheduled = new Date(scheduledDate);
  scheduled.setHours(0, 0, 0, 0);

  if (completed) return 'upcoming'; // Treat completed as handled
  if (scheduled.getTime() === today.getTime()) return 'today';
  if (scheduled.getTime() < today.getTime()) return 'overdue';
  return 'upcoming';
}

// Generate WhatsApp link with message
export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  // Clean phone number - remove all non-numeric characters except +
  const cleanedPhone = phoneNumber.replace(/[^\d+]/g, '');

  // Ensure it starts with country code if not already
  let finalPhone = cleanedPhone;
  if (!finalPhone.startsWith('+')) {
    // If it doesn't start with +, assume it needs one
    // For simplicity, just use the number as-is
    finalPhone = cleanedPhone;
  }

  // Encode message
  const encodedMessage = encodeURIComponent(message);

  // Return wa.me link
  return `https://wa.me/${finalPhone}?text=${encodedMessage}`;
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it has a +, keep it; otherwise just return the cleaned version
  if (cleaned.includes('+')) {
    return cleaned;
  }
  
  // For display, show the number as-is
  return phone;
}

// Validate phone number (basic validation)
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/[^\d+]/g, '');
  // At least 10 digits for a phone number
  return cleaned.replace(/\D/g, '').length >= 10;
}

// Get days until follow-up
export function getDaysUntilFollowUp(scheduledDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scheduled = new Date(scheduledDate);
  scheduled.setHours(0, 0, 0, 0);

  const diffTime = scheduled.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
