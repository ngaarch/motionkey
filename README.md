# Zelora Unlock

<div align="center">

**Unlock Alight Motion Premium secara all-in-one — cepat, gratis, dan tanpa login.**

Website tools fungsional (bukan dokumentasi) yang mengintegrasikan [Zelora API](https://zelora-api.vercel.app) kategori **AM Prem** dalam satu alur wizard yang mulus.

`Astro` · `TypeScript strict` · `Tailwind CSS 4` · `Bun`

</div>

---

## Fitur

- **Unlock Wizard 3 langkah** — masukkan email → kirim link verifikasi → unlock premium, dengan progress tracker interaktif, validasi real-time (Zod), state sukses ber-confetti, dan error handling ramah berbahasa Indonesia.
- **Riwayat lokal (localStorage)** — maksimal 12 entri terakhir dengan filter per jenis aksi, copy, dan hapus per item.
- **Status API real-time** — health check dari browser ke kedua endpoint Zelora, sparkline tren latensi 8 cek terakhir, auto-refresh 60 detik (bisa dimatikan), pause saat tab tidak aktif.
- **Deep-link wizard** — URL otomatis menyimpan `?email=…&step=…` sehingga proses bisa dilanjutkan kapan saja; email terakhir juga di-restore otomatis.
- **Confirm dialog premium** — aksi destruktif (hapus riwayat) selalu melewati dialog konfirmasi.
- **Cooldown kirim link** — tombol kirim verifikasi punya cooldown 30 detik yang tersimpan di localStorage untuk mencegah spam/rate limit.
- **Command palette (Ctrl/Cmd + K)** — navigasi cepat antar halaman dengan pencarian fuzzy (Fuse.js).
- **Dark/Light mode** — persist di localStorage + ikut preferensi sistem, tanpa flash saat load.
- **Desain premium** — glassmorphism ringan, grain texture, border gradient animasi, micro-interactions, smooth scroll (Lenis), animasi entrance (Motion), ikon Lucide inline.
- **Email terakhir dipakai ulang** — 3 email terakhir tersimpan sebagai chips yang bisa diklik sekali tap di Step 1 wizard.
- **Pencarian FAQ** — filter pertanyaan secara live dengan badge jumlah hasil, tombol clear, dan deep-link `#faq-N` langsung membuka item terkait.
- **Offline PWA** — service worker (`public/sw.js`) dengan network-first untuk halaman dan cache-first untuk aset, plus precache halaman utama agar situs tetap terbuka saat offline.
- **SEO & PWA** — meta OG/Twitter + gambar share PNG (`og.png`), JSON-LD `WebApplication` & `FAQPage`, canonical, sitemap, web manifest dengan ikon 192/512 + maskable, apple-touch-icon, security headers di `vercel.json`.

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
│   └── ui/            Button, Badge, CopyButton, Skeleton, ToastHost, CommandPalette
├── data/              Konten FAQ & panduan
├── layouts/           BaseLayout (SEO/OG, theme bootstrap, chrome global)
├── lib/               api.ts, storage.ts, toast.ts, confetti.ts, motion.ts, utils.ts
├── pages/             index, unlock, guide, faq, status, 404
├── scripts/           global.ts (theme, Lenis, reveal, copy, Cmd+K, tilt)
├── styles/            global.css (design system)
└── types/             Tipe bersama + deklarasi modul ikon
```

## Integrasi API

| Endpoint | Fungsi |
| --- | --- |
| `GET https://zelora-api.vercel.app/amprem/send-link?email=…` | Kirim link verifikasi ke email |
| `GET https://zelora-api.vercel.app/amprem/unlock?email=…&link=…` | Verifikasi oobCode + promote ke premium |

Semua endpoint dipanggil langsung dari browser (Zelora API mengirim `access-control-allow-origin: *`).
Klien API di `src/lib/api.ts` menyediakan timeout 20 detik dan pemetaan error
(`INVALID_OOB_CODE`, `INVALID_IDENTIFIER`, dll.) menjadi pesan Indonesia yang ramah.

## Deploy ke Vercel

1. Push repo ini ke GitHub/GitLab.
2. Di [Vercel](https://vercel.com/new), import repo — framework **Astro** terdeteksi otomatis.
3. Build command: `bun run build` · Output: default Astro (adapter Vercel).
4. Deploy. Tidak perlu environment variables.

Security headers dan cache strategy (`/_astro/*` immutable 1 tahun, `sw.js` no-cache) sudah dikonfigurasi di `vercel.json`.

### Regenerasi aset gambar

Jika mengubah `public/og.svg` atau `public/favicon.svg`, regenerate PNG-nya (butuh `rsvg-convert`):

```bash
rsvg-convert -w 1200 -h 630 public/og.svg -o public/og.png
rsvg-convert -w 180 -h 180 public/favicon.svg -o public/apple-touch-icon.png
rsvg-convert -w 192 -h 192 public/favicon.svg -o public/icon-192.png
rsvg-convert -w 512 -h 512 public/favicon.svg -o public/icon-512.png
```

Naikkan `VERSION` di `public/sw.js` setelah mengubah aset yang di-precache agar cache lama terhapus saat aktivasi.

## Catatan

- Proyek ini tidak berafiliasi dengan Alight Motion. Semua merek dagang milik pemiliknya masing-masing.
- Riwayat aktivitas tersimpan murni di `localStorage` perangkat kamu — tidak ada backend yang mencatat data.
