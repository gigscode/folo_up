'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getMessageTemplates, updateMessageTemplate, deleteMessageTemplate, addMessageTemplate } from '@/lib/db';

interface MessageTemplate {
  [key: string]: string;
}

const MESSAGE_TYPES = [
  { key: 'welcome', label: 'Welcome Message (Day 0)' },
  { key: 'check-in', label: 'Check-in Message (Day 2)' },
  { key: 'invitation', label: 'Invitation Message (Day 5)' },
  { key: 'engagement', label: 'Engagement Message (Day 10)' },
  { key: 'pastoral', label: 'Pastoral Care Message (Day 20)' },
];

export default function MessageTemplateEditor() {
  const [messages, setMessages] = useState<MessageTemplate>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [newMessageKey, setNewMessageKey] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const templates = await getMessageTemplates();
        setMessages(templates);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load messages:', err);
        setFeedback({ type: 'error', message: 'Failed to load messages' });
        setIsLoading(false);
      }
    };
    loadMessages();
  }, []);

  const handleStartEdit = (key: string) => {
    setEditingKey(key);
    setEditingText(messages[key]);
  };

  const handleSaveEdit = async () => {
    if (!editingKey || !editingText.trim()) {
      setFeedback({ type: 'error', message: 'Message cannot be empty' });
      return;
    }

    try {
      setIsSaving(true);
      await updateMessageTemplate(editingKey, editingText);
      setMessages({ ...messages, [editingKey]: editingText });
      setEditingKey(null);
      setEditingText('');
      setFeedback({ type: 'success', message: 'Message updated successfully' });
      setTimeout(() => setFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to update message:', err);
      setFeedback({ type: 'error', message: 'Failed to update message' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!window.confirm(`Delete "${MESSAGE_TYPES.find(t => t.key === key)?.label}" message?`)) {
      return;
    }

    try {
      setIsSaving(true);
      await deleteMessageTemplate(key);
      const newMessages = { ...messages };
      delete newMessages[key];
      setMessages(newMessages);
      setFeedback({ type: 'success', message: 'Message deleted successfully' });
      setTimeout(() => setFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to delete message:', err);
      setFeedback({ type: 'error', message: 'Failed to delete message' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNew = async () => {
    if (!newMessageKey.trim() || !newMessageText.trim()) {
      setFeedback({ type: 'error', message: 'Message key and text cannot be empty' });
      return;
    }

    if (messages[newMessageKey]) {
      setFeedback({ type: 'error', message: 'This message key already exists' });
      return;
    }

    try {
      setIsSaving(true);
      await addMessageTemplate(newMessageKey, newMessageText);
      setMessages({ ...messages, [newMessageKey]: newMessageText });
      setNewMessageKey('');
      setNewMessageText('');
      setFeedback({ type: 'success', message: 'Message added successfully' });
      setTimeout(() => setFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to add message:', err);
      setFeedback({ type: 'error', message: 'Failed to add message' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading messages...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Feedback Messages */}
      {feedback && (
        <div
          className={`p-4 rounded-lg ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Existing Messages */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Edit Message Templates</h2>

        {MESSAGE_TYPES.filter(t => messages[t.key]).map((msgType) => (
          <div key={msgType.key} className="border border-border rounded-lg p-4">
            <div className="mb-3">
              <h3 className="font-semibold text-foreground">{msgType.label}</h3>
              <p className="text-sm text-muted-foreground">Message Type: {msgType.key}</p>
            </div>

            {editingKey === msgType.key ? (
              <div className="space-y-3">
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground min-h-24 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter message text..."
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    onClick={() => setEditingKey(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-foreground bg-secondary/30 p-3 rounded mb-3 leading-relaxed">
                  {messages[msgType.key]}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleStartEdit(msgType.key)}
                    variant="outline"
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(msgType.key)}
                    variant="outline"
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Message */}
      <div className="border border-border rounded-lg p-4 bg-secondary/10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Add New Message Template</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Message Key (e.g., "reminder")</label>
            <input
              type="text"
              value={newMessageKey}
              onChange={(e) => setNewMessageKey(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., reminder-60days"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Message Text</label>
            <textarea
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground min-h-24 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your message template..."
            />
          </div>

          <Button
            onClick={handleAddNew}
            disabled={isSaving}
            className="w-full font-semibold"
            size="lg"
          >
            {isSaving ? 'Adding...' : 'Add Message Template'}
          </Button>
        </div>
      </div>
    </div>
  );
}
