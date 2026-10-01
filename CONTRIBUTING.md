# Panduan Kontribusi

Terima kasih mau berkontribusi ke **MotionKey**! 🎉 Panduan ini singkat — cukup untuk mulai.

## Mulai Cepat

```bash
git clone https://github.com/ngaarch/motionkey.git
cd motionkey
bun install
bun run dev
```

Buka `http://localhost:4321`. Butuh [Bun](https://bun.sh) v1.1+.

## Alur Kontribusi

1. **Fork & branch** — buat branch dari `main` dengan nama jelas:
   ```bash
   git checkout -b feat/nama-fitur   # atau fix/nama-bug
   ```
2. **Commit kecil & fokus** — satu commit = satu maksud. Ikuti gaya pesan commit yang sudah ada (subjek ringkas, penjelasan menjawab "kenapa").
3. **Cek sebelum push:**
   ```bash
   bun run typecheck   # harus 0 error
   bun run build       # harus sukses
   ```
4. **Push & Pull Request** ke `main`. Jelaskan *kenapa* perubahannya, bukan hanya *apa*.

> CI-nya sederhana: push ke `main` langsung auto-deploy ke Vercel. Makanya PR dulu, jangan push langsung ke `main` (kecuali maintainer).

## Gaya Kode

- **TypeScript strict** — tanpa `any` implisit; tipe eksplisit untuk data yang lewat batas modul.
- **Ikuti pola yang ada** — komponen Astro + `<script>` per komponen, util di `src/lib/`, konten di `src/data/`.
- **Ikon** — pakai komponen `<Icon name="…" />`; daftar ikon di `src/components/Icon.astro`. Ikon baru = import dari `lucide-static` dengan ekstensi `.mjs` + daftarkan di map.
- **CSS** — design token di `src/styles/global.css` (CSS variables + `@utility`). Hindari style inline selain utilitas Tailwind.
- **Teks UI** — bahasa Indonesia yang ramah; pesan error selalu disertai saran tindakan.
- **localStorage** — selalu bungkus `try/catch`, key dengan prefiks `mk:` (lihat tabel di README).

## Konvensi Penting

| Hal | Aturan |
| --- | --- |
| Storage key | Prefiks `mk:` — jangan ganti nama key yang sudah rilis tanpa rencana migrasi |
| Service worker | Bump `VERSION` di `public/sw.js` jika mengubah aset yang di-precache |
| Aset gambar | Edit SVG sumber, lalu regenerate PNG (perintah di README) |
| Changelog | Setiap perubahan user-facing masuk `src/pages/changelog.astro` (rilis baru di atas) |
| Domain/URL | Canonical, OG, dan sitemap harus konsisten — lihat "Ganti domain" di README |

## Melaporkan Bug

Buka [Issue](https://github.com/ngaarch/motionkey/issues) dengan:

- Langkah reproduksi (dari URL apa, klik apa)
- Yang diharapkan vs yang terjadi
- Browser + OS
- Screenshot/record kalau visual

## Ide Fitur

Proposal fitur juga lewat Issue — jelaskan masalah yang mau diselesaikan dulu, baru solusinya. Fitur yang menyentuh API Zelora sebaiknya didiskusikan dulu sebelum dikerjakan.

## Catatan

- Proyek ini tidak berafiliasi dengan Alight Motion — jangan tambahkan klaim afiliasi atau konten yang menyalahi itu.
- Jangan commit `.env.local` atau data pribadi siapa pun.
