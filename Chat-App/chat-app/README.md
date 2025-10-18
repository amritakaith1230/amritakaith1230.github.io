# Professional Realtime Chat App

A production‑ready, realtime messaging platform built with Next.js 15 and React 19. It features authentication, rooms, message persistence, Socket.IO realtime transport, file sharing, emojis, typing indicators, delivery/read receipts, and push notifications.

This README will help you set up, run, and deploy the app.

---

## Features

- Realtime messaging with Socket.IO (rooms, typing indicators, read receipts)
- Modern UI with responsive layout (Dashboard, Sidebar, Chat area)
- Authentication (NextAuth)
- Message persistence (MongoDB/Mongoose)
- Rich text input with mentions and link support
- File sharing (images/documents) with size/type validation
- Emoji reactions and picker
- Voice message recording
- Search (Fuse.js) and virtualized message list (react-window)
- Theming (light/dark/system)
- Push notifications (Web Push, VAPID)
- Role‑based room permissions (admin/moderator/member)

---

## Tech Stack

- Framework: Next.js 15 (App Router), React 19
- Realtime: Socket.IO (client/server)
- Database: MongoDB via Mongoose
- Auth: NextAuth
- Styling: Tailwind CSS + shadcn/ui primitives
- Uploads: Multer + Sharp (image processing)
- Notifications: web-push
- Utilities: date-fns, fuse.js, react-window

---

## Prerequisites

- Node.js 18.18+ (recommended 20+)
- npm or pnpm
- MongoDB connection URL (Atlas or local)

---

## Installation

\`\`\`bash

# Navigate to the project directory:

cd chat-app

# install dependencies

npm install

\`\`\`

---

## Running Locally

This project can run with:

- Next.js dev server
- Dedicated Socket.IO server (server/index.js)

In two terminals:

\`\`\`bash

# Terminal 1 - Next.js dev

npm run dev

# Terminal 2 - Socket.IO server

npm run socket-server
\`\`\`

---

## Scripts

- dev: Start Next.js in development
- build: Build Next.js app
- start: Start Next.js in production
- socket-server: Start Socket.IO Node server at server/index.js
- db:seed: Seed database (if scripts/seed-db.js exists)

Refer to package.json for the exact definitions.

---
