# 🌍 ESG Compliance Tracker  

**ESG Compliance Tracker** adalah platform **web-based supply chain management** untuk memonitor dan mengelola kepatuhan ESG (*Environmental, Social, Governance*) vendor secara **real-time**. Platform ini dilengkapi dengan **AI compliance assistant**, manajemen regulasi, audit otomatis, dan reporting terintegrasi.  

![Node.js](https://img.shields.io/badge/Node.js-v18+-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)

## 🎯 Key Features  

### 1. Dashboard KPI Real-time  
- Monitoring emisi CO₂ supply chain  
- Tracking pengelolaan limbah  
- Analisis keselamatan kerja (safety incidents)  
- Visual compliance status vendor  

### 2. Manajemen Vendor  
- Database vendor + status compliance  
- Tracking lokasi, sektor, & rating kepatuhan  
- History audit & laporan ESG  
- Color-coded status: ✅ Compliant | ⚠️ Review | ❌ Non-compliant  

### 3. AI Chatbot Compliance Assistant  
- Konsultasi compliance berbasis AI  
- Query regulasi ESG (ISO 14001, ISO 45001, PROPER, SMK3)  
- Rekomendasi berbasis audit  
- Analisis dokumen compliance  

### 4. Audit Management  
- Penjadwalan audit vendor  
- Recording hasil audit dengan scoring  
- Findings & rekomendasi  
- Tracking auditor & timeline  

### 5. Regulations Library  
- Database standar ESG (ISO, Kementerian ESDM, dll)  
- Threshold & requirement jelas  
- Document management regulasi  

### 6. Report Generation  
- Export laporan (PDF/Excel)  
- Automated ESG reporting  
- Custom report builder  
- Data visualization charts  

---

## 🏢 Use Cases  

✅ **Manufaktur** → Monitoring vendor material, CO₂ emissions, audit safety  
✅ **Retail & E-commerce** → Ethical sourcing, sustainable supply chain  
✅ **Konstruksi** → Material/vendor compliance, safety, environmental impact  
✅ **Logistik** → Carbon footprint fleet, warehouse ESG standards  
✅ **F&B** → Food safety, ethical sourcing, waste management  
✅ **Procurement Dept.** → Risk assessment & centralized vendor compliance  

---

## 🛠️ Tech Stack  

### Frontend  
- [React 18.3.1](https://react.dev/) – UI framework  
- [TypeScript 5.8.3](https://www.typescriptlang.org/) – Type safety  
- [Vite 5.4.19](https://vitejs.dev/) – Build tool & dev server  
- [React Router DOM 6.30.1](https://reactrouter.com/) – SPA routing  

### UI Components  
- [shadcn/ui](https://ui.shadcn.com/) – Modern accessible components  
- [Radix UI](https://www.radix-ui.com/) – Headless UI primitives  
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS  
- [Lucide React](https://lucide.dev/) – Icon library  
- [Recharts](https://recharts.org/) – Data visualization  

### Backend & Database 
- Supabase (PostgreSQL, Auth, RLS)  
- Edge Functions (serverless AI logic)  
- Authentication (email/password, role-based)  

### State Management & Forms  
- [TanStack Query 5.83.0](https://tanstack.com/query) – Server state  
- [React Hook Form 7.61.1](https://react-hook-form.com/) – Form handling  
- [Zod 3.25.76](https://zod.dev/) – Schema validation  

### AI Integration  
- Lovable AI Gateway (no external API key needed)  
- Google Gemini 2.5 Flash (compliance chatbot)  

### Dev Tools  
- ESLint 9.32.0  
- PostCSS 8.5.6 + Autoprefixer 10.4.21  

---

## 📊 Database Schema  

**Tables:**  
- `profiles` – User roles (admin, auditor, viewer)  
- `vendors` – Vendor data & compliance status  
- `regulations` – ESG standards & requirements  
- `audits` – Audit records & findings  
- `esg_reports` – ESG metrics (emissions, waste, safety)  

**Security:**  
- Row Level Security (RLS) → Role-based access  
- Public read access → `regulations`  

---

## 🚀 Getting Started  

### Prerequisites  
- [Node.js v18+](https://nodejs.org/)  
- npm v9+  

### Installation  

```bash
# Clone repo
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install
```

### Environment Setup  
Lovable Cloud otomatis generate `.env` file dengan:  

```
VITE_SUPABASE_URL=<auto-configured>
VITE_SUPABASE_PUBLISHABLE_KEY=<auto-configured>
VITE_SUPABASE_PROJECT_ID=<auto-configured>
```

⚠️ **Jangan edit `.env` secara manual!**  

### Development  

```bash
npm run dev
# Akses di: http://localhost:8080
```

### Build Production  

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure  

```
├── src/
│   ├── components/        # Reusable React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── Sidebar.tsx
│   │   ├── DashboardView.tsx
│   │   ├── VendorsView.tsx
│   │   ├── ChatView.tsx
│   │   ├── AuditsView.tsx
│   │   └── RegulationsView.tsx
│   ├── pages/             # Route pages
│   │   ├── Index.tsx
│   │   ├── Auth.tsx
│   │   └── NotFound.tsx
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Backend integrations
│   ├── lib/               # Utility functions
│   └── main.tsx           # App entry point
├── supabase/
│   ├── functions/         # Edge functions (AI chatbot)
│   ├── migrations/        # DB migrations
│   └── config.toml
└── public/                # Static assets
```

---

## 🔐 Authentication  

- Email/password login  
- Auto-confirm (dev mode, no email verification)  
- Roles: `admin`, `auditor`, `viewer`  

---

## 🤖 AI Chatbot Queries (Example)  

- `"Tampilkan vendor yang gagal ISO 14001 bulan ini"`  
- `"Apa persyaratan untuk compliance ISO 45001?"`  
- `"Analisis trend emisi CO₂ vendor tekstil"`  
- `"Berikan rekomendasi untuk vendor dengan safety rating rendah"`  
- `"Jelaskan regulasi PROPER kategori biru"`  

---

## 📜 License  

MIT License © 2025 – ESG Compliance Tracker  
