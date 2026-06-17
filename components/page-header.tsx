'use client';

import ThemeToggle from './theme-toggle';

export default function PageHeader() {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-foreground">FoloUp</h1>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
