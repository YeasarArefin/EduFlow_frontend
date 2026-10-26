# EduFlow — Frontend Web Application

<p align="left">
  <a href="https://eduflowe.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-eduflowe.vercel.app-bef264?style=for-the-badge&logo=vercel&logoColor=000" alt="Live Demo" /></a>
  <a href="https://github.com/YeasarArefin/EduFlow_backend"><img src="https://img.shields.io/badge/Backend%20API-EduFlow_backend-blue?style=for-the-badge&logo=github" alt="Backend Repo" /></a>
</p>

<p align="left">
  <img src="https://img.shields.io/badge/Next.js%2015-App%20Router-black?style=flat-square&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React%2019-RSC-61DAFB?style=flat-square&logo=react&logoColor=000" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/UI-shadcn%2Fui-black?style=flat-square" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/State-TanStack%20Query%20v5-FF4154?style=flat-square&logo=reactquery" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Auth-Better%20Auth-orange?style=flat-square" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Validation-Zod-3E67B1?style=flat-square&logo=zod" alt="Zod" />
</p>

EduFlow is a production-grade, multi-tenant coaching-center management platform tailored for educators, tutors, and academy operators in Bangladesh. Built with **Next.js 15 (App Router)**, **TypeScript**, **shadcn/ui**, and **TanStack Query**, it offers seamless operational oversight across student admissions, batch scheduling, fee ledgers, attendance tracking, and multi-channel communication.

---

## 🚀 Live Demo & Evaluator Credentials

Explore the platform directly without needing local setup:

🔗 **Production URL:** [https://eduflowe.vercel.app](https://eduflowe.vercel.app)

| Account Type | Email | Password | Access & Experience |
|---|---|---|---|
| **Platform Admin** | `admin@eduflow.app` | `12345678` | Global SaaS control plane: plan configuration, manual payment reviews, tenant lifecycle & revenue metrics. |
| **Workspace Owner** | `yeasararefin007@gmail.com` | `12345678` | Coaching Center Owner view: student rosters, batch schedules, fee collections, attendance, SMS wallet & staff roles. |

---

## 💡 Why EduFlow?

Managing an academy or coaching center usually entails juggling fragmented WhatsApp groups, disparate Google Sheets, and error-prone paper receipt books. EduFlow unifies academic, financial, administrative, and messaging operations into an isolated, secure workspace.

### Key Value Pillars
- **Strict Multi-Tenancy:** Each coaching center operates inside a completely siloed workspace. Data leakage between tenants is structurally impossible.
- **Auditable Financials:** Immutable student fee & teacher salary ledgers with auto-sequenced official money receipts.
- **Dual-Layer Authorization:** Distinct separation between **Platform Entitlements** (plan limits & quotas) and **Workspace Permissions** (granular role-based access).
- **Bangladesh-Native Design:** Built specifically for Bangladesh's ecosystem — BDT currency formatting, mobile phone validation (`+8801...`), bKash/Nagad manual payment flows, and `Asia/Dhaka` time synchronization.

---

## 🌟 Core Feature Suite

### 1. 🎓 Academic & Student Operations
- **Student Profiles & Directories:** Fast search, filtering, tags, guardian details, and full chronological academic/payment records.
- **Batch & Schedule Engine:** Custom recurring batch schedules (e.g. STT, MWF presets) integrated directly with attendance calendar sessions.
- **Teacher Directory & Compensation:** Teacher profiles, batch assignments, and salary payout ledgers.
- **Bulk CSV Import:** Dedicated onboarding pipeline with duplicate detection, row-level validation, and tenant quota checks.

### 2. 💳 Financials & Money Receipts
- **Monthly Fee Ledger:** Tracks expected, paid, and overdue balances. Supports partial collections, waivers, and discounts.
- **Instant Printable Receipts:** Auto-generates unique receipt numbers (`{WORKSPACE}-{YYYYMM}-{SEQ}`) with printable/downloadable vouchers.
- **Expense Book:** Categorized expense tracking with reversal records and aggregated net cash-flow graphs.

### 3. 📅 Attendance Tracking
- **Smart Class-Day Calendar:** Automatically detects scheduled batch class days to prevent accidental marking on off-days.
- **Draft & Finalize Workflow:** Allows staff to mark and review drafts before executing an immutable finalization lock.
- **Automated Absence Alerts:** Finalization triggers asynchronous notifications to parents via email and SMS.

### 4. 📲 Multi-Channel Communication
- **SMS Wallet & Ledger:** Real-time credit balance backed by an immutable transaction ledger.
- **Dynamic Templates:** Bilingual (Bangla & English) templates with safe variable interpolation and GSM-7 segment counters.
- **Notice Board:** Workspace-wide or batch-specific announcements rendered through React Email.

### 5. 🛡️ Session Security & Device Limiting
- **Strict 2-Device Limit:** Prevents account credential sharing by capping active sessions to 2 concurrent devices.
- **Device Takeover Dialog:** Attempting a 3rd login triggers a modal displaying all active sessions (device type, IP, last active) with a one-click session takeover.
- **Active Sessions Control:** Users can individually inspect and revoke other device sessions from `Settings → Security`.

---

## 🎨 Design System — ORBIT

EduFlow is built on **ORBIT**, a custom high-performance design language engineered for data-dense, mission-critical SaaS applications:

- **Aesthetic:** Dark-mode-first aesthetic with deep obsidian canvases (`#020402`), electric lime accents (`#bef264`), translucent glass surfaces, and hairline borders (`rgba(255,255,255,0.06)`).
- **Light Theme Support:** First-class light mode with warm off-white tones (`#f6f8f3`), crisp typography, and readable emerald/lime contrast.
- **Typography:** Set in **Manrope** — modern, geometric, and optimized for numeric readability.
- **Primitives:** Built on top of accessible Radix UI & shadcn primitives, with customized responsive Sheets, Popovers, and Dialogs.

---

## 🧱 Architectural Patterns & Best Practices

```text
frontend/
├── app/                  # Next.js App Router (RSC-first routes & layouts)
├── features/             # Business domains (strictly isolated)
│   └── <feature>/
│       ├── api/          # Pure asynchronous HTTP client requests
│       ├── queries/      # TanStack Query read hooks (useQuery)
│       ├── mutations/    # TanStack Query write hooks (useMutation + invalidations)
│       └── components/   # Feature-scoped UI components (one component per file)
├── components/           # Shared reusable cross-feature UI
│   ├── app-shell/        # Collapsible desktop sidebar & navigation
│   ├── ui/               # shadcn/ui primitives (Sheet, Dialog, Table, etc.)
│   └── dashboard/        # Generic metric cards & charts
├── types/                # Centralized TypeScript definitions (no loose feature types)
├── utils/                # Pure formatting helpers (currency, phone, dates)
└── lib/                  # Auth clients, API fetcher abstractions, theme providers
```

### Key Engineering Decisions
1. **Server Components Default:** App Router routes start as React Server Components to minimize initial client JavaScript payloads.
2. **Server-State vs Client-State Discipline:** All server data is exclusively managed via **TanStack Query v5**. Client state management (Zustand) is strictly quarantined to transient UI states (e.g. sidebar collapse, active modals).
3. **Strict Feature Boundaries:** Components in `features/students/` cannot directly import internal components from `features/teachers/`. Shared logic is elevated to global `components/` or `utils/`.
4. **Zero Frontend Trust for Tenant Identity:** The client never passes `workspaceId` as a trusted parameter. Tenant context is inferred server-side from the authenticated session.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 20+
- The backend running locally on port 4000 ([EduFlow_backend](https://github.com/YeasarArefin/EduFlow_backend))

### Installation

```bash
# 1. Clone repository
git clone https://github.com/YeasarArefin/EduFlow_frontend.git
cd EduFlow_frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Configuration (`.env.local`)

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# Better Auth Authentication Endpoint
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:4000

# Next.js Web Application Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 👨‍💻 Author & Engineering Contact

Built with dedication to clean code, robust architecture, and high-fidelity UX by **Yeasar Arefin**.

<table border="0">
  <tr>
    <td width="100" align="center" valign="middle">
      <img src="https://github.com/YeasarArefin.png" width="90" height="90" style="border-radius: 50%;" alt="Yeasar Arefin" />
    </td>
    <td>
      <strong>Yeasar Arefin</strong><br/>
      <em>Full-Stack & Systems Software Engineer</em><br/><br/>
      🌐 <strong>Portfolio:</strong> <a href="https://yeasararefin.vercel.app">yeasararefin.vercel.app</a><br/>
      📬 <strong>Direct Contact:</strong> <a href="mailto:yeasar.arefin.contact@gmail.com">yeasar.arefin.contact@gmail.com</a><br/>
      🐙 <strong>GitHub Profile:</strong> <a href="https://github.com/YeasarArefin">@YeasarArefin</a>
    </td>
  </tr>
</table>
