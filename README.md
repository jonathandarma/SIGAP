# SIGAP

Aplikasi web responsif untuk pemantauan lingkungan dan kesiapsiagaan darurat di Indonesia. Proyek ini mengikuti enam layar pada referensi: Pantau, Peta & Titik Api, Rencana Aman, SIGAP AI, Mode Siaga, dan Panduan Darurat.

## Fitur

- Enam rute aplikasi dan satu halaman pratinjau layar.
- Ringkasan kualitas udara, saran kesehatan, grafik risiko, dan indikasi titik panas dalam data demonstrasi.
- Peta skematis dengan filter, pilihan indikasi, dan kontrol zoom tanpa API key.
- Asisten aturan lokal dengan jawaban demonstrasi.
- Countdown lokal dengan kontrol jeda dan atur ulang.
- Langkah keselamatan, status aman sesi lokal, dan tombol berbagi jika browser mendukungnya.
- Layout desktop dan mobile dengan navigasi samping dan navigasi bawah.

## Stack dan struktur

React 19, TypeScript strict, Vite, React Router, Lucide React, Vitest, dan Testing Library.

```text
src/
  components/Layout.tsx
  data/mock.ts
  pages/Pages.tsx
  services/assistant.ts
  test/app.test.tsx
  test/setup.ts
  types.ts
  App.tsx
  main.tsx
  styles.css
eslint.config.js
netlify.toml
vercel.json
```

## Menjalankan lokal

Prasyarat: Node.js 20.19+ atau 22.12+ dan npm. Versi dependensi dikunci di `package-lock.json`.

```bash
npm ci
npm run dev
```

Vite menampilkan alamat lokal di terminal. Route awal `/` diarahkan ke `/pantau`.

Tidak ada variabel environment wajib. `.env.example` tersedia sebagai penanda bahwa versi demo tidak memerlukan API key. Jangan memasukkan secret frontend; integrasi privat berikutnya perlu dijalankan melalui backend.

## Perintah proyek

```bash
npm run typecheck
npm run lint
npm test
npm run format:check
npm run build
npm run preview
```

## Deploy

Build aplikasi dengan `npm run build`; hasil produksi ada di `dist/`. Deploy folder `dist` ke Vercel atau Netlify. `vercel.json` dan `netlify.toml` menyertakan rewrite agar route React Router tetap dapat dibuka langsung dan di-refresh.

## Data, status fitur, dan batasan

Seluruh kualitas udara, jarak indikasi panas, tanggal, dan perkiraan risiko pada versi ini adalah data simulasi deterministik. Data ini bukan pengukuran langsung, prakiraan resmi, atau konfirmasi kebakaran. Peta hanya ilustrasi skematis tanpa tile eksternal. Asisten menggunakan aturan lokal dan bukan LLM. Aplikasi tidak menghubungi layanan darurat, melaporkan insiden, mengirim lokasi, atau mengubah lock screen/Do Not Disturb. Tidak ada environment variable atau API key yang dibutuhkan. Font memakai font sistem sehingga tidak meminta font dari penyedia eksternal.

Adaptive alert, kanal laporan resmi, routing ke shelter terverifikasi, kontak darurat, layanan lokasi, serta feed lingkungan langsung belum terintegrasi. Tombol navigasi/laporan/kontak pada panduan menjelaskan keterbatasan demo; tidak ada klaim bahwa tindakan sudah dikirim. Countdown hanya berjalan di halaman selama sesi terbuka.

## Mengganti layanan simulasi

Data untuk UI dipusatkan di `src/data/mock.ts`; jawaban asisten di `src/services/assistant.ts`. Integrasi berikutnya dapat mengganti modul tersebut dengan service API typed, validasi respons, metadata sumber/waktu/status data, serta fallback offline. Tidak ada backend di release ini. Simpan kredensial hanya di backend tepercaya, bukan di bundle frontend.
