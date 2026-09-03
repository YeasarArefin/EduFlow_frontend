"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";

const faqs = [
  {
    question: "Can I manage multiple batches and schedules?",
    answer: "Yes. You can create unlimited morning, evening, and weekend batches. Each batch can have designated classrooms, assigned teachers, recurring weekly timetables, and maximum student capacity limits.",
  },
  {
    question: "Can teachers record attendance from their own devices?",
    answer: "Yes. Teachers get their own role-scoped login where they can view their assigned batch rosters and mark roll calls in 1-click on mobile or tablet, without gaining access to financial or administrative data.",
  },
  {
    question: "Can I track unpaid student fees and partial dues?",
    answer: "Yes. EduFlow tracks monthly fees, partial payments, scholarship discounts, and overdue dues in an automated ledger. You can generate instant digital receipts and send 1-click payment reminders to guardians.",
  },
  {
    question: "Can I send notices and SMS alerts to students or guardians?",
    answer: "Yes. You can dispatch automated or broadcast bilingual (Bangla & English) SMS and web notices for absence notifications, exam routines, fee receipts, and urgent class cancellations.",
  },
  {
    question: "Can staff members have limited access?",
    answer: "Yes. Role-based access control allows front-desk staff to register students and log payments without viewing confidential financial profit summaries or staff payroll records.",
  },
  {
    question: "Can I start with a smaller plan and upgrade later?",
    answer: "Yes. Start with our full-featured 14-day free trial on any plan. As your student enrollments and batch counts grow, you can upgrade your plan seamlessly with zero downtime or data loss.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="border-b border-border py-20 sm:py-28 lg:py-32 bg-background" id="faq">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.20em] text-accent-foreground">
            Frequently Asked Questions
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Everything you need to know about EduFlow.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg font-light">
            Clear answers about batch management, staff roles, fee ledgers, and guardian SMS communication.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="mx-auto mt-14 max-w-3xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-accent-border bg-accent/20 shadow-[0_0_20px_rgba(190,242,100,0.05)]"
                    : "border-border bg-card hover:border-border-strong"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-foreground font-heading cursor-pointer transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 text-base">{faq.question}</span>
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-200 ${
                      isOpen
                        ? "border-primary bg-primary text-primary-foreground rotate-180"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    <ChevronDown className="size-4" />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground font-light leading-relaxed border-t border-border">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PublicContainer>
    </section>
  );
}
