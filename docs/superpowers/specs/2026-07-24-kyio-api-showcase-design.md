# Spec Desain: KyioAPI Flagship Project Showcase Card

## Status
Disetujui (Approved)

## Ringkasan
Menambahkan seksi proyek unggulan (`components/Projects.tsx`) di situs portofolio yang mempromosikan **KyioAPI** (`https://api.kyio.web.id`). Komponen ini dirancang mengikuti bahasa desain utama portofolio (`font-jakarta`, `font-space`, dark theme `#050505`, aksen gradient neon) tanpa elemen AI slop.

## Desain & Struktur Komponen (`components/Projects.tsx`)

### 1. Layout & Header Seksi
- **Section ID**: `id="projects"`
- **Judul Seksi**: Large bold typography (`FLAGSHIP PROJECT`) selaras dengan seksi `CORE STACK`.
- **Sub-header/Tagline**: *"Enterprise-Grade REST API Gateway & Multi-Engine Ecosystem"*

### 2. Card Proyek Utama (KyioAPI)
- **Container**: `bg-[#0a0a0c] border border-white/10 rounded-3xl p-8 md:p-14 shadow-2xl relative`.
- **Header Card**:
  - Badge: `FLAGSHIP API PLATFORM`
  - Judul: `KyioAPI`
  - Deskripsi: Platform REST API performa tinggi untuk integrasi AI, multimedia downloader, scraping, dan bot otomasi.
- **Tech Stack Chips**: `Next.js`, `Docker`, `Node.js`, `API Gateway`, `PostgreSQL`.
- **Metrics Realis**:
  - `250+` Active Endpoints
  - `Multi-Engine` Architecture Protection
  - `Free & Premium` Access Tiers

### 3. Widget Preview Kode Interaktif
- **Tab Language Switcher**: `cURL`, `JavaScript`, `Python`
- **Tampilan Kode Terminal**: Box terminal gelap dengan sintaks panggil nyata ke `https://api.kyio.web.id`.
- **One-Click Copy**: Tombol copy snippet dengan indikator feedback.

### 4. Action Buttons (CTA Promosi)
- **Primary CTA**: Tombol `Kunjungi api.kyio.web.id` (`https://api.kyio.web.id`).
- **Secondary CTA**: Tombol `Dokumentasi API`.

### 5. Integrasi Sistem
- Tambahkan `<Projects />` di `App.tsx` di antara `<About />` dan `<Stack />`.
- Update link navigasi pada `Navbar.tsx` menjadi: `['About', 'Projects', 'Stack', 'Contact']`.

## Plan Verifikasi
1. `npm run build` untuk memverifikasi tidak ada error TypeScript.
2. Memastikan navigasi scroll `#projects` berfungsi lancar dari Navbar.
