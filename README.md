# e-TuitionBD — Frontend

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

Tuition marketplace for Bangladesh. Connects students with verified tutors across all curricula (Bangla, English, Cambridge, IB).

## Pages

### Public

| Route | Page | Features |
|-------|------|----------|
| `/` | **Home** | Hero with search, featured categories, popular tutors, animated stats, testimonials, FAQ accordion, newsletter signup, mission statement |
| `/tutors` | **Tutors** | Browse/search with advanced filters (subject, class, area, language, price), URL-synced state, infinite scroll, save tutors |
| `/tuitions` | **Tuitions** | Browse tuition posts with filters (class, location, subject, price), URL-synced state, save tuitions |
| `/tutor/:id` | **Tutor Details** | Full profile, qualifications, subjects, availability, reviews/ratings, booking |
| `/tuition/:id` | **Tuition Details** | Full post details, apply as tutor |
| `/search` | **Search** | Unified search across tutors/tuitions, autocomplete suggestions, keyboard nav, recent searches |
| `/about` | **About** | Platform mission, stats, values, coverage |
| `/contact` | **Contact** | Contact form, email/phone/location |
| `/blog` | **Blog** | Static blog posts |
| `/login` | **Login** | Email/password, Google login, demo credentials, role-based redirect |
| `/register` | **Register** | Two-step registration (role → form), Google register with role |
| `/become-tutor` | **Become Tutor** | Multi-step application (personal info, qualifications, subjects, availability, salary, location) |
| `/post-tuition` | **Post Tuition** | Tuition creation (subject, class, salary, medium, location, gender preference, days, description) |

### Authenticated

| Route | Page | Features |
|-------|------|----------|
| `/dashboard` | **Dashboard** | Role-aware hub (Student/Tutor/Admin) with sidebar, stats, recent activity |
| `/dashboard/profile` | **Profile** | Edit personal info, avatar, preferences |
| `/dashboard/my-profile` | **Tutor Profile** | Tutor-specific: subjects, qualifications, availability |
| `/dashboard/notifications` | **Notifications** | Full history, mark read, batch operations, real-time updates |
| `/dashboard/messages` | **Chat** | Full-page real-time messaging with Socket.IO |
| `/dashboard/verification` | **Verification** | Document upload (NID, certificates) via Firebase Storage, status tracking |
| `/dashboard/saved-tutors` | **Saved Tutors** | Bookmarked tutor profiles |
| `/dashboard/saved-tuitions` | **Saved Tuitions** | Bookmarked tuition posts |
| `/dashboard/sessions` | **Sessions** | View/manage tutoring sessions (tutor) |
| `/dashboard/users` | **Users** | User directory, role management, search (admin) |
| `/dashboard/analytics` | **Analytics** | Platform stats, charts via Recharts (admin) |
| `/dashboard/payments` | **Payments** | Transaction oversight, verification (admin) |
| `/dashboard/tuitions` | **Tuitions** | Approve/reject/manage posts (admin) |
| `/dashboard/verifications` | **Verifications** | Review tutor documents (admin) |
| `/dashboard/settings` | **Settings** | Platform settings (admin) |
| `/checkout/:id` | **Checkout** | Multi-method payment (bKash, Nagad, Rocket, Bank) — see payment.md |
| `/session/:id` | **Session Room** | WebRTC video/audio calls with simple-peer, text chat |
| `/payment-success` | **Payment Success** | Payment confirmation |

## Features

### Role-Based Dashboards

Three distinct dashboard experiences:

- **Student**: Post tuition requests, browse tutor applications, manage bookings, saved tutors/tuitions, payment history
- **Tutor**: Manage profile, set availability, track applications, manage sessions, verification documents
- **Admin**: User management, tuition approval workflow, payment verification, platform analytics (charts: user distribution, tuition status, revenue, search trends), platform settings

### Real-Time Chat

Socket.IO-powered messaging system:
- Conversation sidebar with last message preview
- Read receipts, typing indicators
- Emoji reactions (toggle on any message)
- Floating chat widget (Facebook Messenger style)
- Unread badges

### Search & Discovery

- **Global search**: Unified tutors + tuitions with autocomplete
- **Advanced filters**: Subject, class, location, language, price range, sort
- **URL-synced filters**: Shareable filter state
- **Keyboard navigation**: Cmd+K / `/` to focus search
- **Infinite scroll** on browse pages
- **Save search alerts**: Get notified when new matches appear

### Payment

- **bKash / Nagad / Rocket**: Manual transaction ID entry with admin verification
- **Bank Transfer**: Manual verification flow
- **Admin verification queue**: Review, approve, or reject payments
- See `payment.md` for the full manual-payment flow

### Avatars

DiceBear pixel art avatars generated from user email/name as fallback when no photo URL is set. Gender-aware (male/female pixel art styles).

### Authentication

- **Firebase Auth**: Email/password + Google OAuth
- **JWT tokens**: Backend session management with refresh token rotation
- **Role-based routing**: Redirect to appropriate dashboard on login
- **Demo credentials**: Quick access for admin/student testing

### Verification System

Tutors upload documents (NID, certificates) to Firebase Storage. Admin reviews and issues verification status: `unverified` → `pending_review` → `verified_basic` → `verified_premium`.

### Onboarding Tour

Guided 5-step `react-joyride` tour for first-time logged-in users. Highlights dashboard navigation, search, profile settings. Completion status persisted to backend.

### Video Sessions

WebRTC-based session room using `simple-peer` and Socket.IO signaling. Includes mic/video toggle, chat, booking verification, call timer.

### Notifications

Real-time notification system covering: bookings, payments, messages, reviews, applications, verification updates, admin broadcasts. Unread count in header, dropdown preview, full history page with batch operations.

### Internationalization

i18n foundation with English and Bengali translations (expandable via JSON locale files). Currently covers navigation.

### Design System

**"Technical Emerald Minimalism"** — Apple-inspired sharp-edged UI:
- **Fonts**: Inter (body), Space Grotesk (headings)
- **Colors**: Primary `#2563EB`, dark mode `#081225`, light mode `#F5F7FA`
- **Components**: Radix primitives + shadcn/ui customized with CSS custom properties
- **Dark mode**: Class-based toggle, persisted to localStorage, respects system preference
- **Animations**: Framer Motion, GSAP, AOS, react-countup
- **AppleUI**: Alternative sharp-edged design system (AppleCard, AppleButton, AppleBadge)

## Tech Stack

| Category | Libraries |
|----------|-----------|
| **Core** | React 19, React Router 7, react-helmet-async |
| **Build** | Vite 7, PostCSS |
| **Styling** | Tailwind 3, clsx, tailwind-merge, class-variance-authority, daisyui |
| **Components** | Radix UI (Select, Dialog, Avatar, Label, Slot, Separator), shadcn |
| **Icons** | lucide-react, react-icons |
| **Auth** | Firebase 12 (Auth + Storage), js-cookie |
| **Real-time** | socket.io-client |
| **Payments** | Manual bKash/Nagad (see payment.md) |
| **Video** | simple-peer (WebRTC) |
| **Animations** | framer-motion, GSAP, AOS, react-countup |
| **Forms** | react-hook-form |
| **Charts** | recharts |
| **Alerts** | react-hot-toast, sweetalert2 |
| **Tour** | react-joyride |
| **Ratings** | @smastrom/react-rating |
| **PWA** | vite-plugin-pwa (Workbox) |
| **i18n** | i18next, react-i18next |

## Setup

```bash
npm install

npm run dev    # Dev server
npm run build  # Production build
npm run lint   # Lint check
```

## Environment Variables

**The frontend has NO environment variables.** All configuration (Firebase
web config, Google Analytics ID, UI flags) lives in the **backend** `.env` and
is served to the browser via the public `GET /api/config` endpoint, which the
app fetches once at boot (`src/config/clientConfig.js`).

The only exception is the backend API base URL, hardcoded in
`src/config/api.js` (`http://localhost:5000` in dev, the Vercel backend URL in
production — change it there if your deployment domain differs).

Backend-side variables that feed `/api/config`:

| Backend variable | Purpose |
|------------------|---------|
| `FIREBASE_PROJECT_ID` | Firebase project (also used for ID-token verification) |
| `FIREBASE_WEB_API_KEY` | Firebase web API key (public by design) |
| `FIREBASE_WEB_AUTH_DOMAIN` | Firebase auth domain |
| `FIREBASE_WEB_STORAGE_BUCKET` | Firebase Storage bucket (document uploads) |
| `FIREBASE_WEB_MESSAGING_SENDER_ID` | Firebase sender id |
| `FIREBASE_WEB_APP_ID` | Firebase web app id |
| `GA_MEASUREMENT_ID` | Google Analytics 4 measurement id |

## Deployment

- **Vercel:** `etuitionhub-frontend` deploys from `master` via Vercel Git integration (push to master → auto-deploy). Each deployment gets a unique URL plus the stable alias `etuitionhub-frontend.vercel.app`.
- **API wiring:** the frontend hardcodes the backend URL in `src/config/api.js` (dev: `http://localhost:5000`, prod: `https://etuitionhub-backend.vercel.app`). If the backend domain changes, update that file and redeploy.

### Rollback

- **App revert:** `vercel rollback <deployment-url> --token=$VERCEL_TOKEN` (find the last READY
  deployment with `vercel ls`), or Vercel dashboard → Deployments → ⋯ → Rollback.
- **Env changes:** the frontend has no Vercel env vars (all config is served from `GET /api/config`). A rollback is a redeploy of the previous commit, not a data restore.
