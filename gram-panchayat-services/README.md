# E‑Gram Panchayat Services

A full-stack Next.js app to digitize common Gram Panchayat services. Citizens can browse services and apply online; staff review and update statuses; admins manage services and users.

Easily deployable on Vercel with Firebase Auth and Firestore.

## Features

- Authentication using Firebase Auth (Email/Password)
- Role-based access: Citizen, Staff, Admin
- Services directory with search and filters
- Service details and dynamic application form
- Application submission with attachments
- Staff dashboard: review and update status
- Admin dashboard: services and applications management
- Real-time stats and recent activity
- Responsive UI with shadcn/ui and Tailwind CSS
- Loading UI and basic error handling
- Firestore security rules (example provided)

## Screens and Roles

- Citizen
  - Dashboard: applications overview, quick actions
  - Browse Services: `/user/services`
  - Service Details: `/user/services/[id]`
  - Apply for Service: `/user/services/[id]/apply`
  - My Applications: `/user/applications` and `/user/applications/[id]`
- Staff
  - Dashboard: `/dashboard/staff`
  - Services overview (with application counts): `/staff/services` and `/staff/services/[id]`
  - Applications list and details: `/staff/applications` and `/staff/applications/[id]`
  - Update status with remarks
- Admin
  - Dashboard: `/dashboard/admin`
  - Services CRUD: `/admin/services`, `/admin/services/create`, `/admin/services/[id]`, `/admin/services/[id]/edit`
  - Applications management: `/admin/applications` and `/admin/applications/[id]`
  - View everything (including staff-reviewed/approved applications)

## Tech Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Backend: Next.js Route Handlers and Server Actions
- Database: Firebase Firestore
- Auth: Firebase Authentication
- Deployment: Vercel (recommended)

## Requirements

- Node.js 18+ (LTS recommended)
- npm 9+ (or pnpm/yarn)
- A Firebase project with Firestore and Authentication enabled
- Vercel account (optional but recommended)

## Quick Start

1. Clone and install dependencies:
   \`\`\`bash
   cd gram-panchayat-services
   npm install
   \`\`\`

2. Start the dev server:
   \`\`\`bash
   npm run dev
   \`\`\`
   App will run at http://localhost:3000
