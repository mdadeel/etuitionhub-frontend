# e-TuitionBD 🎓

> **A Modern Online Tuition Marketplace** connecting the best tutors with students in Bangladesh. Built with the **Antigravity Kit** (20+ Specialist Agents) for peak performance and design.

---

## 🚀 Overview

**e-TuitionBD** is a comprehensive full-stack platform designed to revolutionize the private tutoring landscape. Inspired by the marketplace dynamics of **Airbnb** and the professional precision of **Linear**, it offers a seamless experience for both tutors and students.

With a focus on trust, clarity, and ease of use, the platform features a robust tuition listing system, dual-mode payments (Stripe + Local), and a sophisticated backend for managing applications and bookings.

---

## ✨ Key Features

- **👤 Dual User Roles**: Dedicated flows for Tutors (profile management, applications) and Students (searching, booking).
- **📚 Tuition Marketplace**: Advanced filtering and search for tuitions and tutors.
- **💳 Integrated Payments**: 
  - **Stripe**: Instant card payments for global reach.
  - **Local (bKash/Nagad)**: Manual verification system for regional convenience.
- **📊 Real-time Dashboard**: Track applications, payments, and active bookings.
- **🛡️ Secure Auth**: JWT-based authentication with Firebase integration for storage and social auth.
- **🤖 Agent-Driven Dev**: Built using the **Antigravity Kit**, featuring 20+ specialist AI agents for code quality, security, and UI/UX excellence.
- **🎨 Modern UI/UX**: "Technical Emerald Minimalism" theme with full dark mode support, built with Tailwind CSS and Framer Motion.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **State & Logic**: React Hook Form, Axios, React Router Dom
- **Animations**: Framer Motion, AOS (Animate on Scroll)
- **Charts**: Recharts for analytics

### Backend
- **Runtime**: Node.js (Express)
- **Database**: MongoDB (Mongoose)
- **Security**: Helmet, Express Rate Limit, BcryptJS, JWT
- **Payments**: Stripe SDK
- **Logging**: Winston
- **Validation**: Joi

### The "Antigravity Kit" (Agent System)
- **20 Specialist Agents**: Orchestrator, Security Auditor, Frontend Specialist, etc.
- **36 Skills**: From `react-best-practices` to `vulnerability-scanner`.
- **Validation**: Automated core checks (`checklist.py`) and full suite verification (`verify_all.py`).

---

## 📂 Project Structure

```plaintext
.
├── backend-api/          # Express API (Auth, Payments, Logic)
├── frontend-client/      # React/Vite Frontend (UI/UX)
├── .agent/               # Antigravity Kit (Agents, Skills, Workflows)
├── awesome-design-md/    # Design system inspiration & tokens
├── DESIGN.md             # Project design philosophy
└── package.json          # Root workspace configuration
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Stripe Account (for payments)

### 1. Setup Backend
```bash
cd backend-api
npm install
cp .env.example .env
# Update .env with your MONGODB_URI and STRIPE_SECRET_KEY
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend-client
npm install
cp .env.example .env.local
# Update .env.local with:
# - VITE_FIREBASE_API_KEY (and other Firebase variables)
# - VITE_STRIPE_PUBLISHABLE_KEY
# - (Optional) VITE_API_URL if it's not defaulted to localhost:5000
npm run dev
```

### 3. (Optional) Run Agent Checks
```bash
# Core validation
python .agent/scripts/checklist.py .

# Full verification
python .agent/scripts/verify_all.py . --url http://localhost:5173
```

---

## 🎨 Design Philosophy

Our design system focuses on **Emerald Trust**. We avoid sharp edges (using 12-16px radius) and prioritize high-quality human-centric photography. 

- **Primary**: `#10b981` (Emerald 500)
- **Secondary**: `#ff5a5f` (Coral)
- **Typography**: Inter Variable for clarity, Geist Mono for technical meta-info.

---

## 📄 License

This project is licensed under the **ISC License**.

---

*Built with ❤️ by the e-TuitionBD Development Team and the Antigravity Agent Kit.*
