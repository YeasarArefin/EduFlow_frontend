'use client';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader, EmptyState, LoadingState } from '@/components/dashboard/dashboard-primitives';
import { createSmsTemplate, getSmsTemplates, updateSmsTemplate } from '../api/sms';
import {
  SMS_TEMPLATE_VARIABLES,
  type SmsTemplate,
  type SmsTemplateInput,
} from '@/types/communication';
const key = (w: string) => ['communication', 'templates', w] as const;
export function TemplatesPage({ workspaceId }: { workspaceId: string }) {
  const qc = useQueryClient(),
    q = useQuery({
      queryKey: key(workspaceId),
      queryFn: ({ signal }) => getSmsTemplates(workspaceId, signal),
    }),
    [open, setOpen] = useState(false),
    [editing, setEditing] = useState<SmsTemplate | null>(null);
  const m = useMutation({
    mutationFn: (v: SmsTemplateInput) =>
      editing ? updateSmsTemplate(workspaceId, editing.id, v) : createSmsTemplate(workspaceId, v),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: key(workspaceId) });
      setOpen(false);
    },
  });
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="SMS templates"
        description="Save reusable Bangla or English messages with safe variables."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus />
            Create template
          </Button>
        }
      />
      {q.isLoading ? (
        <LoadingState />
      ) : q.data?.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {q.data.map((t) => (
            <Card key={t.id}>
              <CardContent className="space-y-3 pt-5">
                <div className="flex justify-between gap-3">
                  <div>
                    <h2 className="font-medium">{t.name}</h2>
                    <p className="text-xs text-muted-foreground">{t.category}</p>
                  </div>
                  <Badge variant={t.isActive ? 'default' : 'outline'}>
                    {t.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
                  {t.body}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(t);
                    setOpen(true);
                  }}
                >
                  <Pencil />
                  Edit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No templates yet"
          description="Create a reusable SMS for common messages and reminders."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus />
              Create template
            </Button>
          }
        />
      )}
      <TemplateSheet
        open={open}
        onOpenChange={setOpen}
        template={editing}
        pending={m.isPending}
        onSave={(v) => m.mutate(v)}
      />
    </div>
  );
}
function TemplateSheet({
  open,
  onOpenChange,
  template,
  pending,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  template: SmsTemplate | null;
  pending: boolean;
  onSave: (v: SmsTemplateInput) => void;
}) {
  const [name, setName] = useState(''),
    [category, setCategory] = useState('general'),
    [body, setBody] = useState(''),
    [isActive, setIsActive] = useState(true);
  const bodyValue = template?.body ?? body;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{template ? 'Edit template' : 'Create template'}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-5">
          <div>
            <Label>Name</Label>
            <Input defaultValue={template?.name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Category</Label>
            <Input
              defaultValue={template?.category ?? category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <Label>Message body</Label>
            <Textarea value={bodyValue} onChange={(e) => setBody(e.target.value)} rows={8} />
            <div className="mt-2 flex flex-wrap gap-2">
              {SMS_TEMPLATE_VARIABLES.map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setBody(`${bodyValue}${bodyValue ? ' ' : ''}{{${v}}}`)}
                >{`{{${v}}}`}</Button>
              ))}
            </div>
            <p className="mt-3 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground whitespace-pre-wrap">
              {bodyValue || 'Live preview appears here.'}
            </p>
          </div>
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium">Active template</span>
            <Switch defaultChecked={template?.isActive ?? isActive} onCheckedChange={setIsActive} />
          </label>
          <Button
            className="w-full"
            disabled={pending}
            onClick={() =>
              onSave({ name: name || template?.name || '', category, body: bodyValue, isActive })
            }
          >
            {pending ? 'Saving…' : 'Save template'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
