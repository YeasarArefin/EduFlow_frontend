<p align="center">
  <img src="public/logo.png" alt="EduFlow Logo" width="120" />
</p>

<h1 align="center">EduFlow — Coaching Center Management SaaS</h1>

<p align="center">
  <strong>A production-ready, multi-tenant SaaS platform for individual tutors and coaching centers.</strong><br/>
  Manage students, batches, teachers, fees, attendance, communication, and subscriptions — all in one workspace.
</p>

<p align="center">
  <a href="https://github.com/YeasarArefin/EduFlow_frontend"><img src="https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=nextdotjs" alt="Next.js" /></a>
  <a href="https://github.com/YeasarArefin/EduFlow_backend"><img src="https://img.shields.io/badge/Backend-Express%20%2B%20TypeScript-blue?logo=nodedotjs" alt="Node.js" /></a>
  <img src="https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Drizzle-336791?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Auth-Better%20Auth-orange" alt="Better Auth" />
  <img src="https://img.shields.io/badge/UI-shadcn%2Fui%20%2B%20Tailwind-06B6D4?logo=tailwindcss" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-000?logo=vercel" alt="Deployment" />
</p>

---

> **This is the frontend repository.** The backend lives at [EduFlow_backend](https://github.com/YeasarArefin/EduFlow_backend).

---

## Table of Contents

- [What is EduFlow?](#what-is-eduflow)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Frontend Structure](#frontend-structure)
- [Design System — ORBIT](#design-system--orbit)
- [Getting Started (Local Dev)](#getting-started-local-dev)
- [Environment Variables](#environment-variables)
- [Key Engineering Decisions](#key-engineering-decisions)

---

## What is EduFlow?

EduFlow is a **full-stack, multi-tenant SaaS** built for individual tutors and small-to-medium coaching centers in Bangladesh. It replaces scattered spreadsheets, WhatsApp groups, and paper ledgers with a single, role-controlled workspace.

**Who uses it:**

| Role | What they do |
|---|---|
| **Platform Owner** | Manages the SaaS itself — plans, payments, workspace lifecycle, entitlements, revenue |
| **Workspace Owner** | Runs their coaching center — students, teachers, fees, attendance, communication |
| **Admin / Teacher / Staff** | Day-to-day academic, financial, or communication work — access gated by fine-grained permissions |

**Key design goals:**
- Every coaching center is a **fully isolated workspace** — data never crosses tenant boundaries
- **Entitlements** (platform plan limits) and **permissions** (workspace role access) are completely separate systems
- Financial history is **immutable** — audit trails are first-class citizens
- Bangladesh-first: BDT currency, `+880` phone validation, `Asia/Dhaka` time, bKash/Nagad payment methods

---

## Core Features

### 🏫 Workspace Operations
- **Student Management** — profile, guardian info, tags, status (active / inactive / archived), enrollment & fee history, bulk CSV import with quota + duplicate checks
- **Batch Management** — create batches with schedules, assign teachers, enroll students with fee overrides/discounts, history preserved even after removal
- **Teacher Management** — profiles, salary info, batch assignments, specialties, notes
- **Schedule Management** — recurring class schedules per batch + teacher, feeds into attendance

### 💰 Financial Management
- **Student Fee Ledger** — monthly expected/paid/due tracking, partial payments, discounts, scholarships, grace periods, statuses (Unpaid / Partially Paid / Paid / Overpaid / Waived / Overdue)
- **Payment Receipts** — auto-generated on every payment with workspace prefix, printable/downloadable
- **Teacher Salary Ledger** — monthly salary tracking, partial pay, yearly totals, notes
- **Expense Management** — categorized expense records with reversal/audit history

### 📋 Attendance
- Per-session recording (Present / Absent / Late / Excused) with smart calendar (auto-selects latest class day, adapts to batch schedule)
- Draft → Finalize workflow with immutability after finalization
- Batch attendance reports, attendance %, low-attendance flags
- Async absence notifications to guardians/students via RabbitMQ worker

### 📣 Communication & Notices
- **Workspace Notices** — workspace-wide, batch-specific, or targeted; triggers optional email/SMS delivery
- **SMS Wallet** — per-workspace credit balance with ledger transactions; bulk SMS with balance checks
- **SMS Templates** — reusable Bangla/English templates with safe variable substitution
- **Email Delivery** — React Email + Nodemailer, templated with the ORBIT design system

### 🔐 Security & Sessions
- **Session Device Limit** — max 2 active sessions per user; 3rd login triggers a `DeviceLimitDialog` showing active devices with takeover flow
- **Individual Session Revocation** — Settings → Security shows all active sessions, allows per-device logout
- **Password Management** — change password, forgot/reset with time-limited tokens, 5-attempt throttling
- **Role-Based Permissions** — 8 permission modules (`students`, `teachers`, `batches`, `attendance`, `fees`, `salaries`, `members`, `settings`) with per-member overrides

### 🏢 Platform Administration
- **Plan Management** — create/edit plans with student/teacher/batch/SMS limits, feature flags, durations
- **Payment Review** — manual bKash payment verification queue with approve/reject workflow
- **Workspace Lifecycle** — activate, suspend, scheduled deletion with recovery actions
- **Revenue & Analytics** — platform-wide subscription monitoring, revenue overview, deletion queue

### 📊 Dashboards
- **Workspace Dashboard** — active students/batches, fees collected/due, upcoming classes, attendance overview, financial charts (6-month trend)
- **Platform Dashboard** — active/trial/expired tenants, pending payments, revenue distribution, subscription lifecycle

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, React Server Components) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4 + shadcn/ui component library |
| **State — Server** | TanStack Query v5 (all server data fetching, caching, mutation) |
| **State — Client** | Zustand (UI-only state, never server data) |
| **Forms** | React Hook Form + Zod validation |
| **Auth** | Better Auth client (`@better-auth/client`) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Notifications** | Sonner toasts |
| **Deployment** | Vercel |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Next.js Frontend (Vercel)                              │
│  App Router · RSC · TanStack Query · shadcn/ui          │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS /api/v1/*
┌────────────────────────▼────────────────────────────────┐
│  Express API (Render)                                   │
│  Auth → Workspace → Entitlement → Permission →          │
│  Controller → Service → Drizzle → PostgreSQL            │
└──────┬─────────────────┬───────────────────────────────┘
       │                 │
  Supabase          RabbitMQ
  PostgreSQL  ──▶   Worker (Render)
  + RLS            ├─▶ Nodemailer / Gmail
  + Storage        └─▶ SMS Provider
```

**Multi-tenancy is enforced at three layers:**
1. Application-level `workspace_id` resolution from authenticated session (never from client input)
2. Drizzle query scoping — every query filters by `workspace_id`
3. PostgreSQL Row-Level Security — enforced at the database level

---

## Frontend Structure

```
frontend/
├── app/                  # Next.js App Router — pages, layouts, routes
├── features/             # Feature-owned modules
│   ├── auth/             # Sign-in, sign-up, device-limit dialog
│   ├── students/         # Student directory, profile, fees, enrollment
│   ├── teachers/         # Teacher directory, profiles, salary
│   ├── batches/          # Batch management, schedules, enrollment
│   ├── attendance/       # Session management, roster, history
│   ├── fees/             # Fee collection, receipts, ledger
│   ├── salaries/         # Teacher salary management
│   ├── notices/          # Notice creation, delivery, queue
│   ├── settings/         # Workspace settings, security, CSV import
│   ├── staff/            # Member management, roles, permissions
│   ├── platform/         # Platform Owner administration
│   └── dashboard/        # Workspace + platform dashboards
├── components/
│   ├── ui/               # shadcn primitives
│   ├── app-shell/        # Collapsible sidebar, header
│   ├── dashboard/        # Shared dashboard display primitives
│   └── dialogs/          # Shared dialogs/alerts
├── types/                # Central TypeScript types (never local to features)
├── utils/                # Shared formatting helpers (money, dates, status)
├── lib/                  # Auth client, API client, configuration
└── public/               # Static assets
```

Each feature follows a strict 4-layer convention:

```
features/<name>/
├── api/          # Raw fetch functions — no React hooks
├── queries/      # TanStack Query read hooks (useQuery)
├── mutations/    # TanStack Query write hooks (useMutation + invalidation)
└── components/   # UI components — one component per file
```

---

## Design System — ORBIT

EduFlow uses the **ORBIT** design system — a dark-mode-first premium SaaS visual language with a full light-mode counterpart.

| Token | Value |
|---|---|
| Primary accent | Electric lime `#bef264` |
| Dark canvas | Near-black green `#020402` |
| Light canvas | Warm off-white `#f6f8f3` |
| Typography | Manrope (geometric sans) |
| Surfaces | Translucent glass with backdrop blur |
| Geometry | Oversized rounded corners (`rounded-2xl` / `rounded-full`) |
| Motion | Restrained ambient transitions, reduced-motion aware |

The system supports **dark / light / system** themes, persisted in localStorage. Components consume semantic CSS tokens — no per-theme markup duplication.

---

## Getting Started (Local Dev)

### Prerequisites

- Node.js 20+
- The backend running at `http://localhost:4000` — see [EduFlow_backend](https://github.com/YeasarArefin/EduFlow_backend)

### Install & Run

```bash
# Clone
git clone https://github.com/YeasarArefin/EduFlow_frontend.git
cd EduFlow_frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local — see Environment Variables below

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create `.env.local` in the project root:

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# Better Auth base URL
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:4000

# Next.js public app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> For production, set `NEXT_PUBLIC_API_URL` to your Render backend URL and `NEXT_PUBLIC_APP_URL` to your Vercel frontend URL.

---

## Key Engineering Decisions

### Server Components First
Pages default to React Server Components. Client components are introduced only at interaction boundaries — data-fetching, form state, real-time UI. This keeps bundles small and pages fast.

### TanStack Query for All Server State
Every piece of server-fetched data lives in TanStack Query with intentional `staleTime` and `gcTime`. Mutations invalidate only the relevant query keys — no broad cache busts. Zustand is reserved for pure client UI state (modal open/close, selected tab).

### Strict Feature Ownership
Code used by one feature lives inside `features/<name>/` and is never imported by other features. Shared code lives in `components/`, `utils/`, or `types/`. This prevents the "big ball of mud" problem as the codebase grows.

### Central Types Only
All TypeScript interfaces and types live in `frontend/types/`. Features never declare their own types — only local implementation details may be defined locally.

### Zod on Both Ends
Every form validates with Zod on the frontend. The same schema shapes are mirrored on the backend (`backend/src/validation/`). No silent type drift between layers.

### Session Security
- Sessions limited to 2 active devices per user (flat limit, enforced by Better Auth hook + PostgreSQL trigger)
- Device takeover flow: verify credentials server-side → revoke all sessions → issue fresh session with `Set-Cookie`
- Session tokens never exposed to the frontend; all revocation is server-side

---

## Related Repositories

| Repository | Description |
|---|---|
| [EduFlow_backend](https://github.com/YeasarArefin/EduFlow_backend) | Express + TypeScript API, Drizzle ORM, PostgreSQL, Better Auth, RabbitMQ |

---

<p align="center">Built with ❤️ by <a href="https://github.com/YeasarArefin">Yeasar Arefin</a></p>
