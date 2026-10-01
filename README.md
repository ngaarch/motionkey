# MotionKey

<div align="center">

[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Bun](https://img.shields.io/badge/Bun-1.4-F472B6?logo=bun&logoColor=white)](https://bun.sh)
[![Deploy](https://img.shields.io/badge/deploy-Vercel-000000?logo=vercel&logoColor=white)](https://motionkey-hazel.vercel.app)

**Unlock Alight Motion Premium secara all-in-one — cepat, gratis, dan tanpa login.**

Website tools fungsional (bukan dokumentasi) yang mengintegrasikan [Zelora API](https://zelora-api.vercel.app) kategori **AM Prem** dalam satu alur wizard yang mulus.

🌐 **Live:** [motionkey-hazel.vercel.app](https://motionkey-hazel.vercel.app) · auto-deploy dari `main`

</div>

---

## Daftar Isi

- [Halaman](#halaman)
- [Fitur](#fitur)
- [Cara Kerja](#cara-kerja)
- [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
- [Skrip](#skrip)
- [Struktur Proyek](#struktur-proyek)
- [Storage Keys](#storage-keys)
- [Integrasi API](#integrasi-api)
- [Deploy](#deploy)
- [Maintenance](#maintenance)
- [Catatan](#catatan)

## Halaman

| Route | Deskripsi |
| --- | --- |
| `/` | Beranda: hero aurora spotlight, demo alur, bento grid fitur |
| `/unlock` | Wizard unlock 3 langkah + demo card "API live" + riwayat |
| `/guide` | Panduan visual 4 langkah dengan mock interaktif |
| `/faq` | FAQ dengan pencarian live + deep-link `#faq-N` |
| `/status` | Health check real-time kedua endpoint Zelora |
| `/changelog` | Riwayat rilis per versi |
| `/404` | Halaman error dengan pintu kembali ke tools utama |

## Fitur

- **Unlock Wizard 3 langkah** — masukkan email → kirim link verifikasi → unlock premium, dengan progress tracker interaktif (dibacakan screen reader), validasi real-time (Zod), state sukses ber-confetti, dan error handling ramah berbahasa Indonesia.
- **Deep-link wizard yang aman** — URL otomatis menyimpan `?email=…&step=…` agar proses bisa dilanjutkan kapan saja; deep-link hanya dihormati jika email valid, jadi tidak pernah ada tombol yang macet disabled tanpa penjelasan.
- **Cooldown kirim link** — tombol kirim verifikasi terkunci 30 detik setelah berhasil kirim (tersimpan di localStorage) untuk mencegah spam/rate limit; ada hint hitungan di label tombol.
- **Riwayat lokal (localStorage)** — maksimal 12 entri terakhir dengan filter per jenis aksi, copy, dan hapus per item (lewat confirm dialog).
- **Email terakhir dipakai ulang** — 3 email terakhir tersimpan sebagai chips yang bisa diklik sekali tap di Step 1 wizard.
- **Status API real-time** — health check dari browser ke kedua endpoint Zelora, sparkline tren latensi 8 cek terakhir, auto-refresh 60 detik (bisa dimatikan), pause saat tab tidak aktif, angka tabular-nums.
- **Tombol Bagikan** — Web Share API di header (desktop + mobile) dengan fallback salin link + toast.
- **Pencarian FAQ** — filter pertanyaan secara live dengan badge jumlah hasil, tombol clear, dan deep-link `#faq-N` langsung membuka item terkait.
- **Command palette (Ctrl/Cmd + K)** — navigasi cepat antar halaman dengan pencarian fuzzy (Fuse.js) + section "Terakhir dibuka".
- **Dark/Light mode** — persist di localStorage + ikut preferensi sistem, tanpa flash saat load.
- **Desain premium** — glassmorphism ringan, grain texture, aurora spotlight mengikuti kursor, teks scramble di hero, border gradient animasi, micro-interactions, smooth scroll (Lenis), animasi entrance (Motion), ikon Lucide inline.
- **Offline PWA** — service worker (`public/sw.js`) dengan network-first untuk halaman dan cache-first untuk aset, plus precache halaman utama agar situs tetap terbuka saat offline.
- **SEO & aksesibilitas** — meta OG/Twitter + gambar share PNG (`og.png`), JSON-LD `WebApplication` & `FAQPage`, canonical, sitemap, security headers di `vercel.json`, skip-link, `<noscript>` fallback di wizard, `aria-live` untuk progres & toast.

## Cara Kerja

```
┌──────────────────┐     ┌───────────────────────────┐     ┌────────────────────────┐
│  1. Masukkan     │     │  2. Kirim Link Verifikasi │     │  3. Unlock Premium     │
│  Email Kamu      │ ──▶ │  (Zelora /amprem/send-link)│ ──▶ │  paste link dari inbox │
│                  │     │                            │     │  (Zelora /amprem/unlock)│
└──────────────────┘     └───────────────────────────┘     └────────────────────────┘
```

## Menjalankan Secara Lokal

Butuh [Bun](https://bun.sh) v1.1+.

```bash
bun install
bun run dev
```

Buka `http://localhost:4321`.

Build produksi + preview:

```bash
bun run build
bun run preview
```

> ℹ️ `/sitemap-index.xml` akan 404 di dev server — itu normal, file hanya dihasilkan saat build.

## Skrip

| Perintah | Deskripsi |
| --- | --- |
| `bun run dev` | Dev server dengan HMR |
| `bun run build` | Build produksi |
| `bun run preview` | Preview hasil build |
| `bun run typecheck` | `astro check` (TypeScript + Astro diagnostics) |

## Struktur Proyek

```
src/
├── components/
│   ├── layout/        Logo, Header, Footer, ThemeToggle, PageHero
│   ├── unlock/        UnlockWizard, HistoryPanel
│   └── ui/            Button, Badge, CopyButton, Skeleton, ToastHost, CommandPalette, ConfirmModal
├── data/              Konten FAQ & panduan
├── layouts/           BaseLayout (SEO/OG, theme bootstrap, chrome global)
├── lib/               api.ts, storage.ts, toast.ts, confetti.ts, motion.ts, utils.ts
├── pages/             index, unlock, guide, faq, status, changelog, 404
├── scripts/           global.ts (theme, Lenis, reveal, copy, Cmd+K, scroll-progress, decode, tilt, prefetch)
├── styles/            global.css (design system)
└── types/             Tipe bersama + deklarasi modul ikon
```

## Storage Keys

Semua data user hanya di browser, dengan prefiks `mk:`:

| Key | Isi |
| --- | --- |
| `mk:history` | Riwayat aktivitas (maks 12, kind: `send-link` \| `unlock`) |
| `mk:last-email` | Email terakhir dipakai |
| `mk:recent-emails` | 3 email terakhir untuk chips wizard |
| `mk:cooldown-send` | Batas waktu cooldown kirim link (epoch ms) |
| `mk:recent-pages` | Halaman terakhir dibuka (command palette) |
| `mk:status-history` | Riwayat latensi health check |
| `mk:status-auto` | State toggle auto-refresh status |
| `mk:theme` | Tema (`dark` \| `light`) |

> ⚠️ Mengubah nama key apa pun di atas = bump `VERSION` di `sw.js` tidak cukup — user lama tetap membawa key lama sampai cache halaman baru masuk (network-first). Pertimbangkan migrasi jika pernah rilis publik.

## Integrasi API

| Endpoint | Fungsi |
| --- | --- |
| `GET https://zelora-api.vercel.app/amprem/send-link?email=…` | Kirim link verifikasi ke email |
| `GET https://zelora-api.vercel.app/amprem/unlock?email=…&link=…` | Verifikasi oobCode + promote ke premium |

Semua endpoint dipanggil langsung dari browser (Zelora API mengirim `access-control-allow-origin: *`).
Klien API di `src/lib/api.ts` menyediakan timeout 20 detik dan pemetaan error
(`INVALID_OOB_CODE`, `INVALID_IDENTIFIER`, dll.) menjadi pesan Indonesia yang ramah.

## Deploy

**Produksi:** https://motionkey-hazel.vercel.app (project `motionkey` di akun `ngaarch` / team `valo17`)

Setiap push ke `main` otomatis build & deploy via [Vercel Git Integration](https://vercel.com/docs/git) (repo: `ngaarch/motionkey`). Tidak perlu deploy manual.

Setup ulang dari nol (jika pindah akun/repo):

```bash
bun install
bunx vercel login
bunx vercel link --yes --project motionkey
bunx vercel --prod --yes                      # deploy manual pertama
bunx vercel git connect https://github.com/<user>/<repo>.git --yes
```

Build command: `bun run build` · Output: default Astro (adapter Vercel) · Tidak ada environment variables.
Security headers dan cache strategy (`/_astro/*` immutable 1 tahun, `sw.js` no-cache) sudah dikonfigurasi di `vercel.json`.

### Ganti domain

Jika memakai domain kustom, update tiga tempat agar canonical/OG/sitemap tetap konsisten:

1. `site` di `astro.config.mjs`
2. Fallback URL di `src/layouts/BaseLayout.astro` (`canonical` & `ogImage`)
3. URL sitemap di `public/robots.txt`

## Maintenance

### Menambah entri changelog

Edit `src/pages/changelog.astro` — tambahkan objek release **baru di atas** di array `releases`
(versi, tanggal, ringkasan, dan item per kategori: Baru / Ditingkatkan / Aksesibilitas / SEO).
Ikon yang tersedia terdaftar di `src/components/Icon.astro`; kalau butuh ikon baru, ikuti pola
import `.mjs` yang sudah ada.

### Regenerasi aset gambar

Jika mengubah `public/og.svg` atau `public/favicon.svg`, regenerate PNG-nya (butuh `rsvg-convert`):

```bash
rsvg-convert -w 1200 -h 630 public/og.svg -o public/og.png
rsvg-convert -w 180 -h 180 public/favicon.svg -o public/apple-touch-icon.png
rsvg-convert -w 192 -h 192 public/favicon.svg -o public/icon-192.png
rsvg-convert -w 512 -h 512 public/favicon.svg -o public/icon-512.png
```

Naikkan `VERSION` di `public/sw.js` setelah mengubah aset yang di-precache agar cache lama terhapus saat aktivasi.

### Checklist sebelum rilis

```bash
bun run typecheck   # 0 error
bun run build       # sukses, semua halaman terbangun
```

Lalu smoke test cepat: `/`, `/unlock`, `/guide`, `/faq`, `/status`, `/changelog` harus 200 —
dan commit + push (auto-deploy mengurus sisanya).

## Catatan

- Proyek ini tidak berafiliasi dengan Alight Motion. Semua merek dagang milik pemiliknya masing-masing.
- Riwayat aktivitas tersimpan murni di `localStorage` perangkat kamu (prefiks key `mk:`) — tidak ada backend yang mencatat data.
