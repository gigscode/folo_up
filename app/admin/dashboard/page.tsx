'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getAllVisitors, getAnalytics, deleteVisitor } from '@/lib/db';
import { Button } from '@/components/ui/button';
import BulkUploadCSV from '@/components/bulk-upload-csv';
import { Visitor } from '@/lib/db';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin, isLoading: authLoading, email, logout } = useAuth();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [analytics, setAnalytics] = useState({ totalVisitors: 0, completedFollowUps: 0, pendingFollowUps: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'manage'>('overview');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [authLoading, isAdmin, router]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [visitorList, analyticsData] = await Promise.all([getAllVisitors(), getAnalytics()]);
      setVisitors(visitorList);
      setAnalytics(analyticsData);
      setIsLoading(false);
    };

    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const handleDelete = async (visitorId: string) => {
    await deleteVisitor(visitorId);
    setVisitors(visitors.filter((v) => v.id !== visitorId));
    setDeleteConfirm(null);
    const analyticsData = await getAnalytics();
    setAnalytics(analyticsData);
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">FoloUp Admin</h1>
            <p className="text-sm text-muted-foreground">Logged in as {email}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          {(['overview', 'upload', 'manage'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'upload' && 'Bulk Upload'}
              {tab === 'manage' && 'Manage Visitors'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg border border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Visitors</p>
                <p className="text-4xl font-bold text-foreground">{analytics.totalVisitors}</p>
              </div>
              <div className="bg-card rounded-lg border border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Completed Follow-ups</p>
                <p className="text-4xl font-bold text-green-600">{analytics.completedFollowUps}</p>
              </div>
              <div className="bg-card rounded-lg border border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Pending Follow-ups</p>
                <p className="text-4xl font-bold text-orange-600">{analytics.pendingFollowUps}</p>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start">
                    View Public Dashboard
                  </Button>
                </Link>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="text-left px-4 py-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                >
                  <p className="font-semibold text-foreground">Bulk Upload Visitors</p>
                  <p className="text-sm text-muted-foreground">Import CSV file with multiple visitors</p>
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className="text-left px-4 py-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                >
                  <p className="font-semibold text-foreground">Manage All Visitors</p>
                  <p className="text-sm text-muted-foreground">Edit, delete, or view details</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="bg-card rounded-lg border border-border p-8">
            <BulkUploadCSV />
          </div>
        )}

        {/* Manage Visitors Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">All Visitors ({visitors.length})</h2>

            {isLoading ? (
              <p className="text-muted-foreground">Loading visitors...</p>
            ) : visitors.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <p className="text-muted-foreground">No visitors yet. Use Bulk Upload to add them.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="bg-card rounded-lg border border-border p-4 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{visitor.name}</h3>
                      <p className="text-sm text-muted-foreground">{visitor.phone_number}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Visited: {new Date(visitor.date_visited).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/visitor/${visitor.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      {deleteConfirm === visitor.id ? (
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(visitor.id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirm(visitor.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
