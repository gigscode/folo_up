# FoloUp - Church Visitor Follow-up System

FoloUp is a mobile-first web application designed to help churches manage visitor follow-ups using manual WhatsApp execution. The system prepares follow-up actions and makes it extremely easy for church workers to execute WhatsApp follow-ups manually.

## Features

### Dashboard
- **Today's Follow-ups**: View and execute follow-ups due today
- **Overdue Follow-ups**: See which follow-ups need urgent attention
- **Upcoming Follow-ups**: Preview scheduled follow-ups
- **Quick WhatsApp Integration**: Open WhatsApp with pre-filled messages in one click

### Visitor Management
- **Add Visitors**: Simple form to record new church visitors
- **Visitor Profiles**: View detailed visitor information and follow-up history
- **Contact Management**: Store phone numbers for easy WhatsApp access
- **Follow-up Timeline**: See the complete follow-up schedule for each visitor

### Automated Follow-up Schedule
The system automatically generates a follow-up schedule when a visitor is added:
- **Day 0**: Welcome message
- **Day 2**: Check-in
- **Day 5**: Invitation to events
- **Day 10**: Engagement follow-up
- **Day 20**: Pastoral care message

### Analytics
- **Visitor Count**: Track total visitors added
- **Follow-up Metrics**: Monitor completed vs pending follow-ups
- **Completion Rate**: See your follow-up execution rate
- **Type Breakdown**: Understand your follow-up distribution

### Mobile-First Design
- Optimized for church workers on mobile phones
- Large, easy-to-tap buttons
- Minimal clicks required (3 clicks max to send message)
- No clutter or unnecessary features

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Mobile-first styling
- **Supabase** - PostgreSQL database and API
- **WhatsApp Business API** - Deep linking for WhatsApp messages

## Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your Project URL and API keys

### 2. Create Database Schema
In your Supabase SQL Editor, run the SQL from `schema.sql` to create the required tables.

### 3. Configure Environment Variables
Add these to your `.env.local` file or project settings:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run the App
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to start using FoloUp.

## How It Works

### Adding a Visitor
1. Click "Add Visitor" button
2. Enter visitor name, phone number (with country code), and date visited
3. System automatically creates 5 follow-ups scheduled for Days 0, 2, 5, 10, and 20

### Managing Follow-ups
1. **Dashboard** shows follow-ups by status (Today, Overdue, Upcoming)
2. Click "Open WhatsApp" to open WhatsApp with the message pre-filled
3. Send the message manually in WhatsApp
4. Return to app and click "✓" to mark as complete (optional)

### Tracking Progress
- View individual visitor profiles with their complete follow-up timeline
- Check analytics for completion rates and metrics
- Identify overdue follow-ups that need attention

## Phone Number Format
Phone numbers should include the country code:
- **USA**: +1234567890
- **UK**: +441234567890
- **Australia**: +61234567890
- Other countries: Use the international format

## Important Notes

**No Automatic Messages**: FoloUp does NOT send WhatsApp messages automatically. It prepares messages and opens WhatsApp for manual sending. This keeps the system simple and compliant with WhatsApp's policies.

**Manual Execution**: Church workers manually send each message through WhatsApp, which:
- Builds personal relationships
- Avoids spam filters
- Keeps conversations authentic
- Complies with messaging guidelines

## Troubleshooting

### Setup Screen Still Showing?
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Verify environment variables are set correctly

### WhatsApp Links Not Working?
- Ensure phone numbers include country codes
- Check that WhatsApp is installed on the device
- Use the "Copy Message" button as a fallback

### Database Errors?
- Confirm Supabase project is created and tables exist
- Verify credentials are correct
- Check database is not full

## Project Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Setup/home screen
├── add-visitor/
│   └── page.tsx            # Add visitor form
├── visitor/[id]/
│   └── page.tsx            # Visitor profile page
├── visitors/
│   └── page.tsx            # All visitors list
├── analytics/
│   └── page.tsx            # Analytics dashboard
└── setup-guide/
    └── page.tsx            # Setup instructions

components/
├── dashboard.tsx           # Main dashboard
├── navigation.tsx          # Bottom navigation
├── followup-card.tsx       # Follow-up display card
├── today-followups.tsx     # Today's follow-ups
├── overdue-followups.tsx   # Overdue follow-ups
└── upcoming-followups.tsx  # Upcoming follow-ups

lib/
├── db.ts                   # Database functions
└── followup-engine.ts      # Follow-up logic

schema.sql                  # Database schema
```

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Design Philosophy

FoloUp is built with non-technical church workers in mind:
- **Simple**: 3 clicks maximum to send a message
- **Fast**: Instant WhatsApp opening
- **Clear**: No confusing options or settings
- **Effective**: Automated scheduling reduces manual work
- **Respectful**: Manual sending preserves personal touch

## Future Enhancements

Possible future features:
- Message templates customization
- Bulk visitor import
- Follow-up notes/responses
- SMS fallback for non-WhatsApp contacts
- Integration with church management systems

## License

MIT License - Feel free to use and modify for your church.

## Support

For setup help, see the Setup Guide in the app. For technical issues, check the troubleshooting section above.

---

Built with ❤️ for churches. Made simple. Made effective.
