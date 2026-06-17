# Visitor Notes Feature

## Overview
The visitor notes feature allows church staff to add, edit, and manage personal notes for each visitor in their profile. Notes help track important context about visitors' circumstances, interests, and follow-up needs.

## Features

### Add Notes
- Click the **"Add"** button in the Notes section on a visitor profile to create new notes
- Textarea with placeholder: "Add notes about this visitor..."
- Notes persist across sessions and are retrieved automatically when viewing the profile

### Edit Notes
- Click the **"Edit"** button to modify existing notes
- Full textarea for comprehensive note-taking
- **Save** button to persist changes
- **Cancel** button to discard without saving

### View Notes
- Notes display in a read-only format on the visitor profile page
- "No notes yet" message displays when a visitor has no notes
- Notes preview (first 2 lines) visible in the visitors list with line-clamp styling

## Technical Implementation

### Database Layer
- New `notes` field added to Visitor type (optional string)
- `updateVisitorNotes(id: string, notes: string)` function for saving notes
- Full CRUD support for both Supabase and mock data modes

### UI Components
- Visitor profile page (`/app/visitor/[id]/page.tsx`):
  - Edit/Add button conditional display
  - Editable textarea with Save/Cancel buttons
  - Read-only display mode with proper formatting
  
- Visitors list page (`/app/visitors/page.tsx`):
  - Note preview below visitor card
  - Truncated text with line-clamp-2
  - Subtle background styling to differentiate from main content

### State Management
- `isEditingNotes`: Tracks edit mode state
- `notesDraft`: Holds temporary note content during editing
- `isSavingNotes`: Loading state during save operation
- Error handling for failed save operations

## User Flow

### Adding Notes to New Visitor
1. Open visitor profile
2. Click **"Add"** button in Notes section
3. Type notes in textarea
4. Click **"Save"**
5. Notes now display in read-only format

### Editing Existing Notes
1. Open visitor profile
2. Click **"Edit"** button in Notes section
3. Modify text in textarea
4. Click **"Save"**
5. Updated notes display immediately

### Canceling Notes Edit
1. While editing, click **"Cancel"** button
2. Returns to read-only view without saving changes

## Data Persistence

### With Supabase
- Notes stored in visitors table with `updated_at` timestamp
- Changes tracked and synced to database
- Notes persist across sessions and devices

### With Mock Data (Development)
- Notes stored in-memory in mockVisitors array
- Changes persist during current session
- Notes reset on page reload

## Styling

### Note Display Area
- Background: Semi-transparent secondary color
- Padding: 12px (p-3)
- Border radius: 8px (rounded-lg)
- Minimum height: 48px (min-h-12)
- Text: Small (14px), relaxed line-height for readability

### Textarea Editor
- Full-width input with min-height of 96px (min-h-24)
- Border, focus ring, rounded corners
- Proper focus state with primary color ring

## Example Usage

```typescript
// Save new note
await updateVisitorNotes('visitor-1', 'Very engaged member. Interested in youth ministry.');

// Retrieve visitor with notes
const visitor = await getVisitor('visitor-1');
console.log(visitor.notes); // "Very engaged member. Interested in youth ministry."
```

## Future Enhancements

- Note timestamps showing when last updated
- Note history/changelog for tracking changes over time
- Rich text formatting (bold, italic, lists)
- Note search functionality
- Bulk note operations
- Note attachments or linked follow-up references

## Files Modified

- `lib/db.ts` - Added notes field and updateVisitorNotes function
- `app/visitor/[id]/page.tsx` - Added notes UI and editor
- `app/visitors/page.tsx` - Added notes preview in list view
