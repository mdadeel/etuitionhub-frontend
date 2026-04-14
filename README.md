# eTuitionBD

A complete tuition management platform connecting students with qualified tutors in Bangladesh.

## Live Demo

- **Live Site:** [https://e-tuitionhub.vercel.app](https://e-tuitionhub.vercel.app)
- **Backend API:** [https://e-tuitionbd-api.vercel.app](https://e-tuitionbd-api.vercel.app)

## Admin Credentials

- **Email:** admin@etuitionbd.com
- **Password:** Admin123#

## Project Purpose

eTuitionBD solves the real problem of finding qualified tutors and verified tuition opportunities. The platform:
- Reduces friction between students and tutors with automated workflows
- Enables digital tracking, transparent payments, and structured communication
- Helps admins monitor and regulate all platform activities

## Key Features

### For Students
- Post tuition requirements (class, subject, location, budget, schedule)
- View and manage posted tuitions
- Review tutor applications
- Accept tutors and make payments via Stripe
- View payment history

### For Tutors
- Browse available tuition posts
- Apply to suitable tuitions with qualifications
- Track application status
- View approved/ongoing tuitions
- See revenue and earnings history

### For Admin
- User management (view, update, delete, change roles)
- Tuition post moderation (approve/reject)
- Platform analytics and reports
- Transaction history monitoring

## Technologies Used

### Frontend
- React 18 with Vite
- Tailwind CSS + DaisyUI
- React Router DOM
- React Hook Form
- Firebase Authentication
- Framer Motion (animations)
- Axios
- React Hot Toast

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- Stripe Payment Integration
- Cookie Parser
- CORS

## Pages

- Home (Hero, Latest Tuitions, Latest Tutors, How It Works, Why Choose Us)
- Tuitions Listing (with search, filter, pagination)
- Tuition Details
- Tutors Listing
- Tutor Profile
- Login / Register
- Contact / About
- Dashboard (Student / Tutor / Admin)
- Payment History
- Profile Settings
- 404 Error Page

## Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Firebase project
- Stripe account

### Frontend Setup
```bash
cd frontend-client
npm install
cp .env.example .env.local
# Add your Firebase config to .env.local
npm run dev
```

### Backend Setup
```bash
cd backend-api
npm install
cp .env.example .env
# Add MongoDB URI, JWT Secret, Stripe keys to .env
npm run dev
```

## Environment Variables

### Frontend (.env.local)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```
MONGODB_URI=
JWT_SECRET=
STRIPE_SECRET_KEY=
NODE_ENV=development
PORT=5000
```

## GitHub Repositories

- **Client:** [Frontend Repository](https://github.com/mdadeel/etuitionhub-frontend)
- **Server:** [Backend Repository](https://github.com/mdadeel/etuitionhub--backend)

## Deployment

- Frontend deployed on Vercel
- Backend deployed on Vercel (Serverless Functions)
- Database on MongoDB Atlas

---

© 2024 eTuitionBD. All rights reserved.
