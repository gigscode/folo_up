'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/navigation';
import { getAllVisitors, bulkDeleteVisitors } from '@/lib/db';
import { formatDate } from '@/lib/followup-engine';

interface Visitor {
  id: string;
  name: string;
  phone_number: string;
  date_visited: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectMode, setSelectMode] = useState(false);

  useEffect(() => { loadVisitors(); }, []);

  async function loadVisitors() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllVisitors();
      setVisitors(data);
    } catch (err) {
      console.error('Error loading visitors:', err);
      setError('Failed to load visitors');
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return visitors;
    return visitors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.phone_number.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
    );
  }, [visitors, search]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((v) => v.id)));
    }
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelected(new Set());
  }

  async function handleBulkDelete() {
    if (!selected.size) return;
    const confirmed = window.confirm(`Delete ${selected.size} visitor${selected.size > 1 ? 's' : ''}? This also removes their follow-ups.`);
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await bulkDeleteVisitors([...selected]);
      setVisitors((prev) => prev.filter((v) => !selected.has(v.id)));
      exitSelectMode();
    } catch (err) {
      console.error('Bulk delete error:', err);
      setError('Failed to delete visitors');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">All Visitors</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {filtered.length !== visitors.length
                  ? `${filtered.length} of ${visitors.length}`
                  : `${visitors.length} total`}
              </p>
            </div>
            <div className="flex gap-2">
              {!selectMode ? (
                <>
                  <Button size="lg" variant="outline" className="font-semibold" onClick={() => setSelectMode(true)}>
                    Select
                  </Button>
                  <Link href="/add-visitor">
                    <Button size="lg" className="font-semibold">+ Add</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button size="lg" variant="ghost" onClick={exitSelectMode}>Cancel</Button>
                  <Button
                    size="lg"
                    variant="destructive"
                    className="font-semibold"
                    disabled={selected.size === 0 || isDeleting}
                    onClick={handleBulkDelete}
                  >
                    {isDeleting ? 'Deleting...' : `Delete${selected.size > 0 ? ` (${selected.size})` : ''}`}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-3">
            <input
              type="search"
              placeholder="Search by name or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Select all row */}
          {selectMode && filtered.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <button onClick={toggleSelectAll} className="text-sm text-primary font-medium">
                {selected.size === filtered.length ? 'Deselect all' : 'Select all'}
              </button>
              {selected.size > 0 && (
                <span className="text-sm text-muted-foreground">· {selected.size} selected</span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6 text-destructive text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading visitors...</p>
          </div>
        ) : visitors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No visitors yet</p>
            <Link href="/add-visitor">
              <Button>Add Your First Visitor</Button>
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No visitors match "{search}"</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((visitor) => {
              const isSelected = selected.has(visitor.id);
              const card = (
                <div
                  key={visitor.id}
                  className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:bg-secondary/50'
                  }`}
                  onClick={selectMode ? () => toggleSelect(visitor.id) : undefined}
                >
                  <div className="flex items-center gap-3">
                    {selectMode && (
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`}>
                        {isSelected && <span className="text-white text-xs">✓</span>}
                      </div>
                    )}
                    <div className="flex items-center justify-between flex-1">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">{visitor.name}</h3>
                        <p className="text-sm text-muted-foreground">{visitor.phone_number}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Visited</p>
                        <p className="font-medium text-foreground">{formatDate(new Date(visitor.date_visited))}</p>
                      </div>
                    </div>
                  </div>
                  {visitor.notes && (
                    <p className="text-xs text-muted-foreground bg-secondary/30 rounded p-2 line-clamp-2 mt-2">
                      {visitor.notes}
                    </p>
                  )}
                </div>
              );

              return selectMode ? (
                <div key={visitor.id}>{card}</div>
              ) : (
                <Link key={visitor.id} href={`/visitor/${visitor.id}`}>{card}</Link>
              );
            })}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
