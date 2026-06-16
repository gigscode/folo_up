# FoloUp - Quick Start Guide

FoloUp is fully functional with mock data and ready to test. The app automatically creates follow-up schedules for visitors and makes WhatsApp execution simple.

## Current Status

✅ **Running in Mock Mode** - No Supabase required for testing
✅ **Pre-loaded Sample Data** including your test numbers:
- John Okafor: +234 903 7121 917
- Ade Adeleke: +234 701 8643 642

## What You Can Do Right Now

### 1. Dashboard
- View follow-ups sorted by status (Today, Overdue, Upcoming)
- Click "Open WhatsApp" to send messages immediately
- Click "Copy Message" to copy text for manual sending
- Mark follow-ups complete with the checkmark button

### 2. Add Visitors
- Go to "Add Visitor" page
- Fill in name, phone (with country code), and visit date
- System automatically generates 5 follow-ups:
  - Day 0: Welcome message
  - Day 2: Check-in
  - Day 5: Invitation
  - Day 10: Engagement follow-up
  - Day 20: Pastoral care message

### 3. View Profiles
- Click any visitor to see full profile
- View complete follow-up timeline
- Mark individual follow-ups complete
- Track completion rates

### 4. Track All Visitors
- "Visitors" page shows complete list
- Quick access to individual profiles
- Easy visitor management

### 5. Analytics
- View total visitors count
- Track follow-up completion rate
- See pending actions count
- Breakdown by follow-up type

## Testing the Complete Flow

### Test Case 1: Send WhatsApp Message
1. Go to Dashboard (default home page)
2. Click "Open WhatsApp" on any follow-up card
3. WhatsApp web opens with pre-filled message and phone number
4. Send the message

### Test Case 2: Add New Visitor & Schedule Follow-ups
1. Click "Add Visitor" button
2. Fill in:
   - Name: e.g., "Pastor Chidi"
   - Phone: +234 915 555 1234
   - Date Visited: Today's date
3. Click "Add Visitor"
4. System creates 5 follow-ups automatically
5. View timeline on profile page

### Test Case 3: Complete a Follow-up
1. Go to Dashboard
2. Find a follow-up in any tab (Today/Overdue/Upcoming)
3. Click the checkmark (✓) button
4. Follow-up marked complete
5. Count updates in analytics

### Test Case 4: Copy Message
1. Go to Dashboard
2. Click "Copy Message" on any follow-up
3. Message text is copied to clipboard
4. Paste it into WhatsApp or any messaging app manually

## Architecture

### Database (Mock/Ready for Supabase)
- **visitors**: name, phone, date_visited
- **follow_ups**: visitor_id, scheduled_date, message, status

### Follow-up Engine
- Auto-generates 5 follow-ups when visitor added
- Calculates dates relative to visit date
- Pre-written templates for each follow-up type
- Tracks completion status

### WhatsApp Integration
- Uses wa.me deep links (no API required)
- Phone number parsing and formatting
- Pre-filled message generation
- Copy-to-clipboard fallback for web/desktop

## Mobile Optimization

✅ Fully responsive on mobile devices
✅ Touch-friendly button sizes (48px+)
✅ Bottom navigation for easy thumb access
✅ Minimal scrolling required
✅ Designed for non-technical church workers

## Switching to Supabase (When Ready)

When you're ready to use real Supabase:

1. Create a Supabase project
2. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
3. Run the SQL schema from `schema.sql`
4. The app automatically switches to Supabase
5. Mock data can be migrated manually

No code changes needed - the database layer supports both modes.

## Key Features Implemented

- ✅ Visitor management (create, view, list)
- ✅ Automatic follow-up scheduling (5-step plan)
- ✅ WhatsApp deep linking (wa.me integration)
- ✅ Copy-to-clipboard message functionality
- ✅ Completion tracking
- ✅ Mobile-first responsive design
- ✅ Analytics dashboard
- ✅ Simple, non-technical UX
- ✅ Mark follow-ups complete
- ✅ View visitor profiles

## Navigation

- **📋 Dashboard**: Main hub showing today's, overdue, and upcoming follow-ups
- **➕ Add Visitor**: Create new visitor records
- **👥 Visitors**: Browse all visitors
- **📊 Analytics**: View performance metrics

## Tips for Church Workers

1. **Check Daily**: Start each day with the Dashboard to see today's follow-ups
2. **Overdue is Red**: Overdue follow-ups are highlighted - prioritize them first
3. **3 Clicks Max**: Every action is designed to take 3 clicks or less
4. **No Typing Messages**: All messages are pre-written - just send them
5. **Track Completion**: Mark messages complete when sent so you don't repeat them

## Troubleshooting

### WhatsApp Link Not Opening
- Ensure phone number includes country code (e.g., +234 for Nigeria)
- Format: +country_code followed by number
- Try Copy Message option instead

### Can't See Today's Follow-ups
- Check the date on your device is correct
- Follow-ups are calculated from visit date + scheduled days

### Mock Data Reset
- Refresh the page to reload mock data
- Add new visitors to create more test data

## Contact & Support

For questions about deployment or integration:
- See README.md for full documentation
- See SETUP.md for Supabase connection guide
