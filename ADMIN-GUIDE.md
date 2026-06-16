# FoloUp Admin Guide

## Super Admin Access

Only **gigsdev007@gmail.com** has admin access to manage all first-time members and bulk upload visitor data.

### Admin Dashboard Access

1. From the public dashboard, click the **Admin** button (🔐) in the bottom navigation
2. You'll be redirected to `/admin/login`
3. Enter the admin email: **gigsdev007@gmail.com**
4. Click "Sign In"

### Admin Features

The admin dashboard has three main sections:

#### 1. Overview Tab
- **Total Visitors**: Count of all registered visitors
- **Completed Follow-ups**: Number of follow-ups marked as complete
- **Pending Follow-ups**: Number of pending follow-ups awaiting action
- **Quick Actions**: Links to all admin features

#### 2. Bulk Upload Tab
Upload multiple visitors at once using a CSV file.

**CSV Format Requirements:**
```
Name,Phone Number,Date Visited
John Okafor,+234 903 7121 917,2024-06-10
Grace Chimeze,+234 915 234 5678,2024-06-15
Ade Adeleke,+234 701 8643 642,2024-06-12
```

**Steps to Bulk Upload:**
1. Go to the "Bulk Upload" tab
2. Either drag and drop a CSV file or click "Choose File"
3. The system will process the file and show results
4. Successfully added visitors appear with a count
5. Any errors are displayed for you to review
6. Automatically generates 5 follow-ups for each new visitor

**Column Requirements:**
- **Name**: Visitor's full name
- **Phone Number**: Contact phone (supports any format)
- **Date Visited**: Date of visit (YYYY-MM-DD format recommended)

#### 3. Manage Visitors Tab
View, edit, and delete all registered visitors.

**Available Actions:**
- **View**: Click "View" to see the visitor's complete profile and follow-up timeline
- **Delete**: Click "Delete" to remove a visitor and all their follow-ups
- A confirmation is required before deletion

### How Bulk Upload Works

When you upload a CSV with visitor data:

1. The system parses the CSV file
2. For each valid visitor record:
   - Creates a new visitor entry
   - Automatically generates 5 follow-ups:
     - Day 0: Welcome message
     - Day 2: Check-in
     - Day 5: Invitation
     - Day 10: Engagement follow-up
     - Day 20: Pastoral care message

### Important Notes

- Admin email is hardcoded: Only **gigsdev007@gmail.com** has access
- Regular church staff can still access the public dashboard without login
- Bulk upload is fast and can process many visitors at once
- Each visitor automatically gets 5 pre-scheduled follow-ups
- Admin can delete visitors anytime, removing them and all their follow-ups
- All data is currently stored in mock storage (switches to Supabase when connected)

### Public Dashboard Access

Regular staff members can:
- View the public dashboard at `/` without logging in
- Add individual visitors manually
- See and execute follow-ups
- Mark follow-ups as complete
- View visitor profiles
- See analytics

They **cannot**:
- Bulk upload visitors
- Delete visitors
- Access admin dashboard

### Logging Out

Click the "Logout" button in the top right of the admin dashboard to sign out and return to the login page.

---

For questions about setting up a real database, see README.md for Supabase integration instructions.
