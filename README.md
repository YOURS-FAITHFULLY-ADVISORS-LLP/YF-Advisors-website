<div align="center">
  <img src="./public/readme-banner.png" alt="YF Advisors Banner" width="100%">
  
  # 🚀 YF Advisors – Strategic Advisory 2.0
  
  **Empowering businesses with strategic financial clarity and operational excellence through AI-driven Global Business Services (GBS).**

  [![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff69b4?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
</div>
 
---

## 📌 Project Overview

**YF Advisors** is a global strategic advisory and professional services firm helping organizations scale efficiently by transforming back-office operations into a competitive advantage. With **15+ years of trusted excellence**, YF Advisors partners with businesses across **India, USA, and Dubai**, delivering measurable results through advisory, outsourcing, and digital solutions.

> **"Grow your business — not your back office"**

### 📊 Proven Impact
| Metric | Achievement |
| :--- | :--- |
| **Man Hours Served** | 100K+ |
| **Client Savings** | $150M |
| **Efficiency Increase** | 23% |
| **Client Retention** | 98% |

-

## 🛠️ Tech Stack

This project is built with a modern, high-performance web stack:

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Styled Components](https://styled-components.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [OGL](https://github.com/o-g-l/ogl)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Backend/Integrations**: [Nodemailer](https://nodemailer.com/) (Contact Forms)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## ✨ Key Features

- **Dynamic Interactive UI**: Smooth transitions and micro-animations using Framer Motion.
- **Service Explorer**: Interactive cards for exploring strategic advisory services.
- **Product Showcases**: Dedicated sections for flagship products like **AuditVeda** and **PayVeda**.
- **Responsive Leadership Section**: Clean presentation of the expert team.
- **Global Presence Visualization**: Highlighting operations in India, USA, and Dubai.
- **Optimized Performance**: Built on Next.js for lightning-fast load times and SEO.

---

## 📁 Project Structure

```bash
yfa-website/
├── docs/               # API documentation (api_endpoint.md)
├── public/             # Static assets (logos, banners, icons)
├── src/
│   ├── app/            # Next.js App Router (Pages, Layouts & API Routes)
│   ├── components/     # Reusable UI components
│   ├── data/           # Static content & mock data
│   ├── lib/            # Utilities (auth, prisma, api-handler, pagination)
│   └── validations/    # Zod validation schemas
├── .env                # Environment variables
├── next.config.ts      # Next.js configuration
└── tailwind.config.ts  # Tailwind CSS configuration
```

---

## 📡 API Endpoints Summary

For complete, detailed technical documentation (including request bodies, validation schemas, expected output responses, and status codes), see [docs/api_endpoint.md](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/docs/api_endpoint.md).

### 🔑 Authentication API
| Method | Endpoint | Auth | Purpose |
| :---: | :--- | :---: | :--- |
| `POST` | `/api/admin/auth/login` | Public | Admin login authentication (JWT & Cookie) |
| `GET` | `/api/admin/auth/me` | Admin | Get current active admin session / token details |
| `POST` | `/api/admin/auth/logout` | Admin | Logout admin session (clears session cookie) |

### 📨 Public Lead / Contact API
| Method | Endpoint | Auth | Purpose |
| :---: | :--- | :---: | :--- |
| `POST` | `/api/contact` | Public | Submit contact form inquiry (rate limited, emails via SMTP) |

### 📝 CMS & Content Management API
| Method | Endpoint | Auth | Purpose |
| :---: | :--- | :---: | :--- |
| `GET` / `PATCH` | `/api/admin/about` | Admin | Fetch / Update About Us content & stats |
| `GET` / `PATCH` | `/api/admin/contact` | Admin | Fetch / Update office contact details |
| `GET` / `PATCH` | `/api/admin/homepage` | Admin | Fetch / Update Homepage hero section |
| `GET` / `PATCH` | `/api/admin/settings` | Admin | Fetch / Update global branding & SEO settings |

### 👥 Team Members API
| Method | Endpoint | Auth | Purpose |
| :---: | :--- | :---: | :--- |
| `GET` / `POST` | `/api/admin/team` | Admin | List team members (paginated) / Create new team member |
| `GET` / `PATCH` / `DELETE` | `/api/admin/team/:id` | Admin | Fetch / Update / Delete single team member |
| `PATCH` | `/api/admin/team/:id/status` | Admin | Toggle team member status (`DRAFT` / `PUBLISHED`) |

### ⭐ Testimonials API
| Method | Endpoint | Auth | Purpose |
| :---: | :--- | :---: | :--- |
| `GET` / `POST` | `/api/admin/testimonials` | Admin | List testimonials (paginated) / Create testimonial |
| `GET` / `PATCH` / `DELETE` | `/api/admin/testimonials/:id` | Admin | Fetch / Update / Delete single testimonial |
| `PATCH` | `/api/admin/testimonials/:id/status` | Admin | Toggle testimonial status (`DRAFT` / `PUBLISHED`) |

### 📰 Blogs API
| Method | Endpoint | Auth | Purpose |
| :---: | :--- | :---: | :--- |
| `GET` / `POST` | `/api/admin/blogs` | Admin | List blogs (paginated, searchable) / Create blog |
| `GET` / `PATCH` / `DELETE` | `/api/admin/blogs/:id` | Admin | Fetch / Update / Delete single blog post |
| `PATCH` | `/api/admin/blogs/:id/status` | Admin | Toggle blog status (`DRAFT` / `PUBLISHED`) |

### 🛠️ Services API
| Method | Endpoint | Auth | Purpose |
| :---: | :--- | :---: | :--- |
| `PATCH` | `/api/admin/services/:id/status` | Admin | Toggle service publishing status |

---


## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Innovox-Software-Solutions/YFA-Website.git
   cd YFA-Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file and add necessary keys (e.g., Nodemailer credentials).

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏗️ flagship Products

### [AuditVeda] ⭐ 4.8/5
**Audit Management Simplified.** A comprehensive web solution to streamline audit processes with real-time tracking, digital checklists, and instant report generation.

### [PayVeda] ⭐ 4.8/5
**Payroll in Your Pocket.** A modern web-based payroll and HR management platform for view/downloading payslips, leave management, and compliance alerts.

---

## 👥 Leadership Team

Our powerhouse team of **10+ partners and 50+ experts** includes CAs, CSs, and Legal Professionals.

| Name | Role | Specialization |
| :--- | :--- | :--- |
| **Vishal Aggarwal** | Founder & Partner | BPR & Advisory |
| **Kirti Aggarwal** | Co-Founder & Partner | Finance & Legal Operations |
| **Saket Drona** | Partner | International Offshoring |
| **Shiv Mittal** | Partner | Strategic Financial Management |
| **And more...** | Experts | Operations, IT, Talent Management |

---

## 📬 Contact Us

Ready to scale your business? We’re here to help.

- **📍 Address**: 207, 2nd Floor, Millennium Business Park, Navi Mumbai – 400710
- **📞 Phone**: +91 80805 06185
- **📧 Email**: [info@yfadvisors.com](mailto:info@yfadvisors.com)
- **🌐 Website**: [www.yfadvisors.com](https://www.yfadvisors.com)

---

<div align="center">
  <p>© 2026 YF Advisors LLP. All rights reserved.</p>
  <p>
    <a href="#">Privacy Policy</a> • 
    <a href="#">Terms of Service</a>
  </p>
</div>
