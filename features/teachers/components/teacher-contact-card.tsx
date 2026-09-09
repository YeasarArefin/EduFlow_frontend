import { SectionCard } from '@/components/dashboard-primitives';
import { Mail, Phone } from 'lucide-react';
import type { Teacher } from '../api/teachers';

export function TeacherContactCard({ teacher }: { teacher: Teacher }) {
  return (
    <SectionCard title="Contact information">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Phone className="size-3.5" />
            <span>Phone</span>
          </span>
          {teacher.phone ? (
            <a
              href={`tel:${teacher.phone}`}
              className="font-medium text-accent-foreground hover:underline"
            >
              {teacher.phone}
            </a>
          ) : (
            <span className="text-muted-foreground">Not provided</span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Mail className="size-3.5" />
            <span>Email</span>
          </span>
          {teacher.email ? (
            <a
              href={`mailto:${teacher.email}`}
              className="font-medium text-accent-foreground hover:underline"
            >
              {teacher.email}
            </a>
          ) : (
            <span className="text-muted-foreground">Not provided</span>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
