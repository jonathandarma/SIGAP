export function answerFor(input: string): string {
  const q = input.toLowerCase();
  if (/masker|aqi|udara|polusi|sesak/.test(q))
    return "Kualitas udara pada contoh ini berstatus Tidak Sehat (AQI 168, data demonstrasi). Batasi aktivitas berat di luar, gunakan masker N95/KN95, dan ikuti saran tenaga kesehatan bila mengalami keluhan. Periksa sumber resmi untuk kondisi terkini.";
  if (/api|titik panas|hotspot|asap/.test(q))
    return "Titik yang tampil adalah indikasi anomali panas dalam data simulasi, bukan konfirmasi kebakaran. Jangan mendekati lokasi. Laporkan melalui kanal resmi setempat dan ikuti arahan petugas.";
  if (/darurat|evakuasi|aman/.test(q))
    return "Utamakan keselamatan: menjauh dari asap atau bahaya, ikuti arahan petugas setempat, dan hubungi layanan darurat resmi di wilayah Anda. SIGAP demo tidak mengirim laporan atau menghubungkan panggilan secara otomatis.";
  if (/rencana|besok|prakiraan/.test(q))
    return "Perkiraan risiko ditampilkan sebagai data demonstrasi, bukan prediksi pasti. Untuk besok, contoh rekomendasi SIGAP adalah membatasi aktivitas luar ruang pada jam kualitas udara kurang baik. Periksa pembaruan dari instansi resmi.";
  return "Saya dapat membantu menjelaskan kualitas udara, indikasi titik panas, kesiapsiagaan, dan langkah keselamatan. Jawaban ini memakai logika demonstrasi lokal, bukan model AI atau informasi langsung.";
}
