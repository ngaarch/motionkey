export interface FaqItem {
  q: string;
  a: string;
}

export const faqs: FaqItem[] = [
  {
    q: "Apakah unlock ini benar-benar gratis?",
    a: "Ya. Seluruh alur — masukkan email, kirim link verifikasi, sampai aktivasi premium — memakai endpoint publik Zelora API yang gratis. Website ini tidak menyimpan email atau data kamu di server mana pun; semua riwayat tersimpan lokal di browser kamu (localStorage).",
  },
  {
    q: "Email apa yang bisa dipakai?",
    a: "Email aktif apa pun yang bisa kamu buka inbox-nya — Gmail, Outlook, Yahoo, dan sejenisnya. Pastikan penulisannya benar karena link verifikasi dikirim ke alamat tersebut. Email ini tidak harus terdaftar di Alight Motion sebelumnya.",
  },
  {
    q: "Saya tidak menerima email verifikasi, kenapa?",
    a: "Beberapa kemungkinan: (1) email typo atau formatnya salah, (2) server email sedang lambat — tunggu 30–60 detik dan cek folder spam juga, (3) rate limit API sedang aktif — tunggu beberapa menit lalu tekan 'Kirim Link Verifikasi' ulang setelah cooldown 30 detik selesai.",
  },
  {
    q: "Link verifikasi seperti apa yang harus ditempel di Step 3?",
    a: "Tempel link lengkap yang ada di email verifikasi — biasanya dimulai dengan https:// dan mengandung parameter oobCode. Kamu bisa menyalin seluruh link atau langsung pakai tombol 'Tempel dari clipboard'. Website ini otomatis membersihkan teks dan mengambil link di dalamnya.",
  },
  {
    q: "Kenapa muncul error 'Link verifikasi tidak valid atau sudah kedaluwarsa'?",
    a: "Kode verifikasi (oobCode) hanya dipakai sekali dan punya masa berlaku. Kalau link sudah pernah dipakai, kadaluarsa, atau kamu menyalin sebagian, server akan menolak. Solusinya: ulangi dari Step 2 untuk mengirim link baru, lalu paste link terbaru di Step 3.",
  },
  {
    q: "Apakah akun Alight Motion saya aman?",
    a: "Website ini tidak pernah meminta password, token, atau kredensial apa pun. Semua komunikasi langsung dari browser kamu ke API Zelora — kami tidak punya server yang menyimpan datamu. Tetap gunakan akun yang tidak berisi data sensitif untuk eksperimen seperti ini.",
  },
  {
    q: "Bisa dipakai di HP?",
    a: "Bisa. Seluruh alur dirancang mobile-first: tombol besar, input yang nyaman, dan step yang bisa dinavigasi maju-mundur. Kamu juga bisa switch aplikasi untuk cek inbox lalu kembali menempel link verifikasinya.",
  },
  {
    q: "Apakah unlock ini permanen?",
    a: "Tergantung mekanisme di sisi Zelora/Alight Motion — umumnya promo atau aktivasi semacam ini bisa hangus setelah periode tertentu atau saat aplikasi direset. Kalau status premium hilang, cukup jalankan ulang alur 3 langkah dari awal.",
  },
  {
    q: "Data riwayat saya disimpan di mana?",
    a: "Murni di localStorage browser kamu (maksimal 12 entri terakhir). Tidak ada backend, tidak ada database, tidak ada tracking. Menghapus riwayat di panel akan menghapusnya permanen dari perangkat.",
  },
  {
    q: "Website ini berafiliasi dengan Alight Motion?",
    a: "Tidak. MotionKey adalah tool komunitas yang memanfaatkan endpoint publik Zelora API. Semua merek dagang milik pemiliknya masing-masing.",
  },
];

export interface GuideStep {
  n: number;
  title: string;
  description: string;
  tips: string[];
}

export const guideSteps: GuideStep[] = [
  {
    n: 1,
    title: "Masukkan email kamu",
    description:
      "Buka halaman Unlock lalu tulis email aktif kamu di Step 1 — Gmail atau email biasa lainnya sudah cukup. Formatnya divalidasi otomatis, dan tombol lanjut baru aktif kalau emailnya valid.",
    tips: [
      "Email otomatis tersimpan sebagai 'email terakhir' dan terbawa ke step berikutnya.",
      "Deep-link ?email=&step= tetap berfungsi kalau kamu ingin membagikan posisi wizard.",
    ],
  },
  {
    n: 2,
    title: "Kirim link verifikasi",
    description:
      "Periksa email yang ditampilkan lalu tekan 'Kirim Link Verifikasi'. Zelora akan mengirim email berisi link verifikasi ke alamat tadi. Tunggu notifikasi sukses — biasanya kurang dari 3 detik.",
    tips: [
      "Cek badge hijau 'Link verifikasi terkirim!' sebagai konfirmasi.",
      "Ada jeda 30 detik antar pengiriman untuk mencegah spam — tombol akan menghitung mundur sendiri.",
    ],
  },
  {
    n: 3,
    title: "Buka email, salin link verifikasi",
    description:
      "Buka inbox email kamu, cari email dari Alight Motion/Firebase, lalu salin seluruh link verifikasi (yang mengandung oobCode). Di website, tekan 'Tempel dari clipboard' atau paste manual ke kolom link.",
    tips: [
      "Link selalu dimulai dengan https:// — kalau tidak, berarti kamu menyalin teks lain.",
      "Kolom link akan berubah hijau otomatis saat formatnya valid.",
    ],
  },
  {
    n: 4,
    title: "Tekan Unlock dan nikmati",
    description:
      "Terakhir, tekan 'Unlock Premium Sekarang'. Kalau berhasil kamu akan disambut animasi centang + confetti, dan akun kamu langsung dipromosikan ke premium. Buka Alight Motion dan cek fiturnya.",
    tips: [
      "Kalau muncul error INVALID_OOB_CODE, ulangi dari Step 2 — link mungkin sudah kadaluarsa.",
      "Setiap percobaan (sukses/gagal) tercatat di panel Riwayat untuk memudahkan debugging.",
    ],
  },
];
