# e-TuitionBD 🎓

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

**e-TuitionBD** is a high-fidelity, online tuition marketplace designed for the modern academic landscape in Bangladesh. It connects verified specialists with students who demand excellence through a precision-engineered interface.

---

## 🖼️ Homescreen Preview

![e-TuitionBD Homescreen](./docs/screenshots/homescreen.png)

*The new "Precision Learning" hero section featuring dynamic image shuffling and verified expert networking.*

---

## ✨ Key Features

- **👤 Dual-Node Ecosystem**: Specialized workflows for **Tutors** (profile optimization, lead tracking) and **Students** (specialist discovery, secure booking).
- **📚 Intelligent Marketplace**: Advanced filtering by subject, location, and class with real-time search integration.
- **💳 Multi-Channel Payments**: 
  - **Global**: Seamless Stripe integration for instant card transactions.
  - **Local**: Manual verification flow for bKash and Nagad payments.
- **📊 Unified Dashboard**: Comprehensive tracking for applications, active streams, and payment history.
- **🛡️ Enterprise-Grade Security**: JWT-based auth protocols, Firebase storage integration, and role-based access control (RBAC).
- **🤖 AI-Orchestrated Dev**: Engineered using the **Antigravity Kit**, leveraging 20+ specialist agents to ensure peak code quality and UX performance.

---

## 🛠️ Tech Stack

### Frontend Architecture
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) + [AOS](https://michalsnik.github.io/aos/)
- **State Management**: React Hook Form + Context API

### Backend Infrastructure
- **Runtime**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ORM)
- **Security**: Helmet, Rate Limiting, BcryptJS
- **Analytics**: Winston Logging + Recharts

---

## ⚙️ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/mdadeel/e-tuitionBD.git
npm install
```

### 2. Configure Environment
Create `.env` files in both `backend-api` and `frontend-client` (see `.env.example` in respective folders).

### 3. Launch Development
```bash
# Start Backend
cd etuitionhub--backend
npm run dev

# Start Frontend
cd etuitionhub-frontend
npm run dev
```

---

## 🎨 Design Philosophy: "Emerald Trust"

The platform adheres to a **Technical Minimalist** aesthetic, prioritizing clarity and trust signals. 

- **Border Radius**: 16px (Apple-inspired smoothness)
- **Primary Color**: `#10b981` (Emerald 500) — Represents growth and precision.
- **Typography**: `Inter Variable` for UI, `Geist Mono` for metadata.

---

## 📄 License

This project is licensed under the **ISC License**.

---

*Built with ❤️ by the e-TuitionBD Development Team.*
