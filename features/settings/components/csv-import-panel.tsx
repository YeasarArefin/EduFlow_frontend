'use client';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { confirmCsvImport, downloadCsvTemplate, previewCsvImport } from '../api/csv-import';
import type { CsvImportKind, CsvImportPanelProps } from '@/types/settings';

export function CsvImportPanel({ workspaceId }: CsvImportPanelProps) {
  const [kind, setKind] = useState<CsvImportKind>('students');
  const [csv, setCsv] = useState('');
  const queryClient = useQueryClient();
  const preview = useMutation({ mutationFn: () => previewCsvImport(workspaceId, kind, csv) });
  const commit = useMutation({
    mutationFn: () => confirmCsvImport(workspaceId, kind, csv),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [kind] });
    },
  });
  const template = async () => {
    const text = await downloadCsvTemplate(workspaceId, kind);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
    link.download = `${kind}-template.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-heading text-xl font-medium">Import CSV</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Upload, validate, review, then explicitly import students or teachers.
      </p>
      <div className="mt-6 flex gap-2">
        <Button
          variant={kind === 'students' ? 'default' : 'outline'}
          onClick={() => setKind('students')}
        >
          Students
        </Button>
        <Button
          variant={kind === 'teachers' ? 'default' : 'outline'}
          onClick={() => setKind('teachers')}
        >
          Teachers
        </Button>
        <Button className="ml-auto" variant="outline" onClick={template}>
          <Download />
          Download template
        </Button>
      </div>
      <label className="mt-5 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        <Upload className="mb-2 size-5 text-primary" />
        Drop a CSV here or choose a file
        <input
          className="sr-only"
          type="file"
          accept=".csv,text/csv"
          onChange={async (event) => setCsv((await event.target.files?.[0]?.text()) ?? '')}
        />
      </label>
      <Button
        className="mt-5"
        disabled={!csv || preview.isPending}
        onClick={() => preview.mutate()}
      >
        Validate & preview
      </Button>
      {preview.data ? (
        <div className="mt-6">
          <p className="text-sm">
            {preview.data.total} rows · {preview.data.valid} valid · {preview.data.invalid} invalid
          </p>
          <div className="mt-3 max-h-64 overflow-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <tbody>
                {preview.data.rows.map((row) => (
                  <tr key={row.rowNumber} className="border-b border-border">
                    <td className="p-2">Row {row.rowNumber}</td>
                    <td className="p-2">
                      {row.errors.length
                        ? row.errors.map((error) => `${error.field}: ${error.reason}`).join(' ')
                        : 'Valid'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            className="mt-5"
            disabled={preview.data.valid === 0 || commit.isPending}
            onClick={() => commit.mutate()}
          >
            Confirm import {preview.data.valid} valid rows
          </Button>
        </div>
      ) : null}
      {commit.data ? (
        <p className="mt-4 text-sm text-primary">
          Imported {commit.data.imported} rows. Skipped {commit.data.skipped} invalid rows.
        </p>
      ) : null}
    </section>
  );
}
