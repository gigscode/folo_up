# FoloUp - Features Update

## Latest Enhancements

### 1. Call Button Feature
**Replaced Copy Message Button with Direct Call Capability**

- **Location**: Every follow-up card on the dashboard
- **Functionality**: Click "Call" button to initiate a phone call using the device's native dialer
- **Phone Handling**: Automatically formats phone numbers for tel: protocol
  - Removes spaces, dashes, parentheses
  - Works with international formats (+234, etc.)

**Example Usage:**
```
Phone: +234 903 7121 917
Formatted for call: +234903712191​7
Triggers: tel:+234903712191​7
```

**Button Layout (Updated):**
- WhatsApp button (primary) - Opens WhatsApp with prefilled message
- Call button (secondary) - Initiates phone call
- Mark Complete (✓) - Records follow-up completion

---

### 2. Message Template Management (Admin Only)
**Admin Can Now Customize All Follow-up Messages**

**Location**: Admin Dashboard → Message Templates Tab

**Features:**

#### Edit Messages
- Click "Edit" button on any message
- Message appears in editable textarea
- Save Changes button confirms edit
- Cancel button discards changes
- Confirmation feedback on success

#### Delete Messages
- Click "Delete" button
- Confirmation dialog appears
- Message is removed from system
- All new follow-ups use updated message set

#### Add New Messages
- Scroll to "Add New Message Template" section
- Enter Message Key (e.g., "reminder-60days")
- Enter Message Text
- Click "Add Message Template"
- New message available for future use

**Current Message Types:**
1. **welcome** (Day 0)
   - "Welcome to our church! We are so glad you visited us. Looking forward to seeing you again."

2. **check-in** (Day 2)
   - "Hi, we hope you had a blessed time at our service last time. How are you doing?"

3. **invitation** (Day 5)
   - "You are invited to join us for a special event this weekend. We would love to see you there!"

4. **engagement** (Day 10)
   - "We wanted to check in and see how you are doing. Your presence at church means a lot to us."

5. **pastoral** (Day 20)
   - "We care about your spiritual journey. Is there anything we can pray for you about?"

---

## How Message Updates Work

### When Messages Are Applied
1. **Existing Follow-ups**: Use previously set messages (unchanged)
2. **New Visitors**: Automatically generated using current message templates
3. **Bulk Import**: CSV imports use current message set

### Message Update Flow
```
Admin → Message Templates Tab
       ↓
Select "Edit" on message
       ↓
Update text in textarea
       ↓
Click "Save Changes"
       ↓
Message stored immediately
       ↓
Next new visitor gets updated message
```

---

## Technical Implementation

### Database Layer
- Message templates stored as key-value pairs
- Keys: 'welcome', 'check-in', 'invitation', 'engagement', 'pastoral'
- Mock storage for development (localStorage-backed)
- Supabase-ready schema

### Functions Added
```typescript
// Get all message templates
getMessageTemplates()

// Update existing template
updateMessageTemplate(type: string, message: string)

// Add new template
addMessageTemplate(type: string, message: string)

// Delete template
deleteMessageTemplate(type: string)

// Get single template
getMessageTemplate(type: string)
```

### Component Updates
- **FollowUpCard**: Replaced "Copy Message" with "Call" button
- **Admin Dashboard**: Added "Message Templates" tab
- **MessageTemplateEditor**: New component for managing templates

### Phone Number Processing
```typescript
// Format phone for tel: link
const phoneForCall = '+234 903 7121 917'
  .replace(/[\s\-\(\)]/g, '');
// Result: +234903712191​7

// Usage in HTML
window.location.href = `tel:${phoneForCall}`;
```

---

## Admin-Only Access

Message template management is restricted to the super admin:
- **Email**: gigsdev007@gmail.com
- **Access**: Admin Dashboard → Message Templates Tab
- **Other Staff**: Cannot access message editor (read-only)

---

## User Interface Changes

### Public Dashboard (Staff View)
**Before:**
- WhatsApp button
- Copy Message button
- Mark Complete (✓)

**After:**
- WhatsApp button (primary)
- Call button (secondary)
- Mark Complete (✓)

### Admin Dashboard (gigsdev007@gmail.com)
**New Tab Added: Message Templates**
- Edit Message Card:
  - Shows message type and key
  - Display message preview
  - Edit/Delete buttons
  
- Add New Message Section:
  - Message Key input
  - Message Text textarea
  - Add Message Template button

---

## Testing Completed

✓ Call button generates correct tel: links
✓ Phone numbers formatted for international dialing
✓ Message editor load all 5 default templates
✓ Edit message functionality works
✓ Delete message with confirmation
✓ Add new message template
✓ Feedback messages display (success/error)
✓ Admin access control enforced
✓ New visitors use updated messages
✓ Existing follow-ups use original messages
✓ Mobile responsive for all new features

---

## Future Enhancements (Optional)

- SMS integration (instead of just WhatsApp)
- Message scheduling (delay before sending)
- Template variables (e.g., {{visitor_name}})
- Message preview before send
- Message translation support
- A/B testing different messages

---

## Quick Reference

### Call Button
- Initiates native phone dialer on mobile
- Works on desktop with VoIP apps
- Phone number formatted automatically

### Message Management
- Edit anytime - takes effect for new visitors
- Delete permanently removes from templates
- Add custom messages for specific needs
- 5 default messages included

### Admin Dashboard
- Login: gigsdev007@gmail.com
- Tab: Message Templates
- Action: Edit, Delete, Add messages
