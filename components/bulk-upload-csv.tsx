'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { createVisitor } from '@/lib/db';

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

export default function BulkUploadCSV() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): Array<{ name: string; phone: string; date: string }> => {
    const lines = text.trim().split('\n');
    const headers = lines[0].toLowerCase().split(',').map((h) => h.trim());

    const nameIndex = headers.findIndex((h) => h.includes('name'));
    const phoneIndex = headers.findIndex((h) => h.includes('phone'));
    const dateIndex = headers.findIndex((h) => h.includes('date') || h.includes('visited'));

    if (nameIndex === -1 || phoneIndex === -1 || dateIndex === -1) {
      throw new Error('CSV must have columns: Name, Phone Number, Date Visited');
    }

    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(',').map((c) => c.trim());
      records.push({
        name: cols[nameIndex] || '',
        phone: cols[phoneIndex] || '',
        date: cols[dateIndex] || '',
      });
    }

    return records;
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setResult(null);

    try {
      const text = await file.text();
      const records = parseCSV(text);

      let success = 0;
      const errors: string[] = [];

      for (const record of records) {
        if (!record.name || !record.phone || !record.date) {
          errors.push(`Skipped: Missing data in "${record.name || 'unknown'}" row`);
          continue;
        }

        try {
          await createVisitor(record.name, record.phone, record.date);
          success++;
        } catch (error) {
          errors.push(`Failed to add ${record.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      setResult({
        success,
        failed: records.length - success,
        errors,
      });
    } catch (error) {
      setResult({
        success: 0,
        failed: 0,
        errors: [error instanceof Error ? error.message : 'Failed to process file'],
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'text/csv') {
      processFile(files[0]);
    } else {
      setResult({
        success: 0,
        failed: 0,
        errors: ['Please drop a CSV file'],
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Bulk Upload Visitors</h2>
        <p className="text-muted-foreground">
          Upload a CSV file with visitor details. Required columns: Name, Phone Number, Date Visited
        </p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border bg-background'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id="csv-input"
        />

        <label htmlFor="csv-input" className="cursor-pointer">
          <div className="space-y-3">
            <div className="text-4xl">📄</div>
            <div>
              <p className="text-foreground font-semibold">Drag and drop your CSV file</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? 'Processing...' : 'Choose File'}
            </Button>
          </div>
        </label>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Successfully Added</p>
                <p className="text-2xl font-bold text-foreground">{result.success}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className={`text-2xl font-bold ${result.failed > 0 ? 'text-destructive' : 'text-foreground'}`}>
                  {result.failed}
                </p>
              </div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <p className="font-semibold text-destructive mb-3">Issues:</p>
              <ul className="space-y-1">
                {result.errors.map((error, idx) => (
                  <li key={idx} className="text-sm text-destructive">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={() => setResult(null)} variant="outline" className="w-full">
            Upload Another File
          </Button>
        </div>
      )}

      <div className="bg-secondary/30 rounded-lg p-4 border border-border">
        <p className="text-sm font-semibold text-foreground mb-2">CSV Format Example:</p>
        <pre className="text-xs text-muted-foreground bg-background p-3 rounded border border-border overflow-x-auto">
          {`Name,Phone Number,Date Visited
John Okafor,+234 903 7121 917,2024-06-10
Grace Chimeze,+234 915 234 5678,2024-06-15
Ade Adeleke,+234 701 8643 642,2024-06-12`}
        </pre>
      </div>
    </div>
  );
}
