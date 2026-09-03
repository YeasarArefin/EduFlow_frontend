import {
  AlertTriangle,
  Calendar,
  CreditCard,
  Megaphone,
  UserX,
} from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Card } from "@/components/ui/card";

const notifications = [
  {
    type: "Fee Due Reminder",
    category: "Financial",
    recipient: "Guardian SMS",
    icon: CreditCard,
    time: "3 days before due date",
    message: "Dear Guardian, HSC Physics Batch Alpha monthly fee of ৳3,500 for August is due on 10 Aug. Pay via bKash or front-desk to avoid late dues.",
    badge: "Auto-Scheduled",
    status: "Delivered",
  },
  {
    type: "Student Absence Notification",
    category: "Attendance",
    recipient: "Parent SMS",
    icon: UserX,
    time: "Instant on roll-call submit",
    message: "Dear Parent, Rafiqul Islam (Roll #104) was marked absent in today's HSC Chemistry class (4:30 PM). Please call 01712-345678 if this was unexpected.",
    badge: "Triggered on Roll Call",
    status: "Delivered",
  },
  {
    type: "Schedule Change",
    category: "Classroom",
    recipient: "Batch SMS & Notice Board",
    icon: Calendar,
    time: "1 day prior",
    message: "Attention Batch Beta: Thursday's Higher Math session has been shifted to 5:30 PM in Room 201 due to campus maintenance.",
    badge: "Batch Broadcast",
    status: "Delivered",
  },
  {
    type: "Class Cancellation & Makeup",
    category: "Operations",
    recipient: "Batch Students & Parents",
    icon: AlertTriangle,
    time: "Immediate alert",
    message: "Notice: Today's SSC Biology class with Dr. Salman is cancelled due to unavoidable reasons. Makeup class scheduled for Saturday 10:00 AM.",
    badge: "Emergency Alert",
    status: "Delivered",
  },
  {
    type: "General Announcement",
    category: "Academic",
    recipient: "All Active Batches",
    icon: Megaphone,
    time: "Published notice",
    message: "Apex Coaching Center will remain closed for National Holiday on 26 March. Regular classes resume Sunday as per weekly routine.",
    badge: "Notice Board",
    status: "Published",
  },
];

export function CommunicationAutomationSection() {
  return (
    <section className="border-b border-border py-20 sm:py-28 lg:py-32 bg-background-subtle" id="communication">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.20em] text-accent-foreground">
            Automated Communication
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Important updates reach the right people automatically.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg font-light">
            Keep students and guardians synchronized with reliable bilingual SMS alerts triggered by daily
            attendance, fee invoices, and schedule adjustments.
          </p>
        </div>

        {/* 5 Notification UI Cards Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notifications.map((item, index) => {
            const Icon = item.icon;
            const isFocal = index === 0;
            return (
              <Card
                key={item.type}
                className={`flex flex-col justify-between overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-all ${
                  isFocal
                    ? "border-accent-border bg-gradient-to-b from-accent/30 to-transparent shadow-[0_0_30px_rgba(190,242,100,0.08)]"
                    : "border-border bg-card hover:border-border-strong"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-accent-foreground border border-border">
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{item.type}</p>
                        <p className="text-[10px] text-muted-foreground/60">{item.recipient}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-muted border border-border px-2 py-0.5 text-[9px] font-mono text-muted-foreground">
                      {item.badge}
                    </span>
                  </div>

                  {/* Message Bubble Card */}
                  <div className="mt-4 rounded-xl border border-border bg-muted/60 p-3.5 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 mb-1.5 font-mono">
                      <span>SMS Payload</span>
                      <span className="text-accent-foreground font-medium">{item.status}</span>
                    </div>
                    <p className="text-foreground-soft font-mono text-[11px] leading-relaxed">
                      &ldquo;{item.message}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground/70 pt-3 border-t border-border">
                  <span>Trigger: {item.time}</span>
                  <span className="text-muted-foreground font-mono">Channel: SMS / Web</span>
                </div>
              </Card>
            );
          })}
        </div>
      </PublicContainer>
    </section>
  );
}
