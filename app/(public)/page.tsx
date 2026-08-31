import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Users, WalletCards } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  { label: "One clear workspace", detail: "Keep your center's day in one place" },
  { label: "Built for coaching centers", detail: "Workflows that match how you teach" },
  { label: "Less admin overhead", detail: "Give your team more time for students" },
];

const features = [
  { icon: Users, title: "Student records that stay useful", description: "Keep enrollment details, batches, attendance, and progress connected to each student." },
  { icon: CalendarDays, title: "Batches and schedules in sync", description: "See who belongs where and give your team a dependable view of the teaching day." },
  { icon: WalletCards, title: "Fee follow-up without the guesswork", description: "Track payment activity and keep the next action visible for every learner." },
];

const workflow = [
  { step: "01", title: "Set up your center", description: "Create your workspace once, then shape it around your programs, batches, and team." },
  { step: "02", title: "Run the teaching day", description: "Move from student questions to attendance and follow-up with less context switching." },
  { step: "03", title: "Know what needs attention", description: "Use a calm operational view to spot unfinished work before it becomes a surprise." },
];

function ProductPreview() {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <CardHeader className="flex-row items-center justify-between border-b bg-muted/30 py-4">
        <div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">EF</span><div><CardTitle className="text-sm">Illustrative workspace preview</CardTitle><CardDescription className="text-xs">Sample center overview</CardDescription></div></div>
        <span className="hidden rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground sm:inline-flex">Monday, 12 Aug</span>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-background p-4"><p className="text-xs text-muted-foreground">Active students</p><p className="mt-2 text-2xl font-medium tracking-tight">128</p><p className="mt-1 text-xs text-muted-foreground">Across 9 batches</p></div>
          <div className="rounded-lg border border-border bg-background p-4"><p className="text-xs text-muted-foreground">Today&apos;s classes</p><p className="mt-2 text-2xl font-medium tracking-tight">12</p><p className="mt-1 text-xs text-muted-foreground">Next starts at 4:00 PM</p></div>
          <div className="rounded-lg border border-border bg-background p-4"><p className="text-xs text-muted-foreground">Attendance to review</p><p className="mt-2 text-2xl font-medium tracking-tight">3</p><p className="mt-1 text-xs text-muted-foreground">Ready for a quick check</p></div>
        </div>
        <div className="mt-5 rounded-lg border border-border">
          <div className="flex items-center justify-between border-b px-4 py-3"><p className="text-sm font-medium">Today&apos;s focus</p><span className="text-xs text-muted-foreground">View all</span></div>
          <div className="divide-y divide-border">{["Review attendance for IELTS Evening", "Follow up on 4 pending fee records", "Prepare next week's batch schedule"].map((item, index) => <div key={item} className="flex items-center gap-3 px-4 py-3 text-sm"><span className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground"><Check /></span><span className="text-muted-foreground">{item}</span><span className="ml-auto text-xs text-muted-foreground">{index === 0 ? "Now" : index === 1 ? "Today" : "Tomorrow"}</span></div>)}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div>
      <section className="border-b border-border"><PublicContainer className="grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20 lg:py-32"><div><p className="mb-5 text-sm font-medium text-muted-foreground">The operating system for your coaching center</p><h1 className="max-w-3xl font-heading text-5xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-6xl">Run your center with more clarity.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">EduFlow brings students, batches, attendance, and fees into one calm workspace—so your team can spend less time coordinating and more time coaching.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button render={<Link href="/pricing" />} size="lg">See plans <ArrowRight data-icon="inline-end" /></Button><Button render={<Link href="/features" />} variant="outline" size="lg">Explore features</Button></div><p className="mt-5 text-xs text-muted-foreground">Designed for the real rhythm of coaching-center work.</p></div><div className="relative lg:pl-4"><div className="absolute -inset-6 -z-10 rounded-full bg-muted/60 blur-3xl" aria-hidden="true" /><ProductPreview /></div></PublicContainer></section>

      <section aria-label="EduFlow benefits" className="border-b border-border bg-muted/20"><PublicContainer className="grid gap-px divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">{benefits.map((benefit) => <div key={benefit.label} className="py-6 sm:px-7 sm:first:pl-0 sm:last:pr-0"><p className="text-sm font-medium">{benefit.label}</p><p className="mt-1 text-sm text-muted-foreground">{benefit.detail}</p></div>)}</PublicContainer></section>

      <section><PublicContainer className="py-24 sm:py-32"><div className="max-w-2xl"><h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">Everything your team needs to keep moving.</h2><p className="mt-4 text-base leading-7 text-muted-foreground">EduFlow turns scattered admin tasks into a shared rhythm your center can rely on.</p></div><div className="mt-12 grid gap-5 md:grid-cols-3">{features.map((feature) => { const Icon = feature.icon; return <Card key={feature.title} className="bg-background"><CardHeader><span className="mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-foreground"><Icon /></span><CardTitle>{feature.title}</CardTitle><CardDescription className="pt-1 leading-6">{feature.description}</CardDescription></CardHeader></Card>; })}</div></PublicContainer></section>

      <section className="border-y border-border bg-muted/20"><PublicContainer className="grid gap-12 py-24 sm:py-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24"><div><h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">A workflow that follows the way your center works.</h2><p className="mt-4 text-base leading-7 text-muted-foreground">From first enrollment to the end of a busy class day, keep the next step easy to see.</p><Link href="/features" className="mt-7 inline-flex items-center gap-2 text-sm font-medium underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">See the full workflow <ArrowRight /></Link></div><div className="flex flex-col gap-8">{workflow.map((item) => <div key={item.step} className="grid grid-cols-[48px_1fr] gap-5"><span className="font-mono text-sm text-muted-foreground">{item.step}</span><div><h3 className="text-lg font-medium">{item.title}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{item.description}</p></div></div>)}</div></PublicContainer></section>

      <section><PublicContainer className="py-24 sm:py-32"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-medium text-muted-foreground">One shared view</p><h2 className="mt-3 font-heading text-3xl font-medium tracking-tight sm:text-4xl">See the work. Know what&apos;s next.</h2><p className="mt-4 text-base leading-7 text-muted-foreground">A focused dashboard gives your team the context to act without another spreadsheet or status meeting.</p></div><div className="mx-auto mt-12 max-w-5xl"><ProductPreview /></div></PublicContainer></section>

      <section className="border-t border-border"><PublicContainer className="grid gap-10 py-24 sm:py-32 lg:grid-cols-[1fr_auto] lg:items-center"><div><h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">Start with a plan that fits your center.</h2><p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">Choose the right foundation for your team today, with room to grow as your programs do.</p></div><Button render={<Link href="/pricing" />} size="lg">Compare plans <ArrowRight data-icon="inline-end" /></Button></PublicContainer></section>

      <section className="bg-primary text-primary-foreground"><PublicContainer className="flex flex-col items-start gap-8 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20"><div><h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">Make the next day easier to run.</h2><p className="mt-3 max-w-xl text-base leading-7 text-primary-foreground/70">See how EduFlow can bring your coaching center into focus.</p></div><Button render={<Link href="/pricing" />} variant="secondary" size="lg">Get started <ArrowRight data-icon="inline-end" /></Button></PublicContainer></section>
    </div>
  );
}
