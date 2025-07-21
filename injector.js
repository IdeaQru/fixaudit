import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://127.0.0.1:27017/auditdb';

const kriteriaSchema = new mongoose.Schema({
    Kode: { type: String, required: true, unique: true },
    Deskripsi: String,
    Kategori: String,
    Referensi: String,
    Tingkat: { type: String, enum: ['Awal', 'Transisi', 'Lanjutan'] },
});

const Kriteria = mongoose.model('Kriteria', kriteriaSchema);

const kriteriaData = [
  {
    "Kode": "7.2.1",
    "Deskripsi": "Pemantauan/pengukuran lingkungan kerja dilaksanakan secara teratur dan hasilnya didokumentasikan, dipelihara dan digunakan untuk penilaian dan pengendalian risiko.",
    "Kategori": "Pemantauan/Pengukuran Lingkungan Kerja",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "7.2.2",
    "Deskripsi": "Pemantauan/pengukuran lingkungan kerja meliputi faktor fisika, kimia, biologis, radiasi dan psikologis.",
    "Kategori": "Pemantauan/Pengukuran Lingkungan Kerja",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "7.2.3",
    "Deskripsi": "Pemantauan/pengukuran lingkungan kerja dilakukan oleh petugas atau pihak yang berkompeten dan berwenang dari dalam dan/atau luar perusahaan.",
    "Kategori": "Pemantauan/Pengukuran Lingkungan Kerja",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "7.3.1",
    "Deskripsi": "Terdapat prosedur yang terdokumentasi mengenai identifikasi, kalibrasi, pemeliharaan dan penyimpanan untuk alat pemeriksaan, ukur dan uji mengenai K3.",
    "Kategori": "Peralatan Pemeriksaan/Inspeksi, Pengukuran dan Pengujian",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "7.3.2",
    "Deskripsi": "Alat dipelihara dan dikalibrasi oleh petugas atau pihak yang kompeten dan berwenang dari dalam dan/atau luar perusahaan.",
    "Kategori": "Peralatan Pemeriksaan/Inspeksi, Pengukuran dan Pengujian",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "7.4.1",
    "Deskripsi": "Dilakukan pemantauan kesehatan tenaga kerja yang bekerja pada tempat kerja yang mengandung bahaya tinggi sesuai dengan dengan peraturan perundang-undangan.",
    "Kategori": "Pemantauan Kesehatan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "7.4.2",
    "Deskripsi": "Pengusaha atau pengurus telah melaksanakan identifikasi keadaan dimana pemeriksaan kesehatan tenaga kerja perlu dilakukan dan telah melaksanakan sistem untuk membantu pemeriksaan ini.",
    "Kategori": "Pemantauan Kesehatan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "7.4.3",
    "Deskripsi": "Pemeriksaan kesehatan tenaga kerja dilakukan oleh dokter pemeriksa yang ditunjuk sesuai peraturan perundang-undangan yang berlaku.",
    "Kategori": "Pemantauan Kesehatan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "7.4.4",
    "Deskripsi": "Perusahaan menyediakan pelayanan kesehatan kerja sesuai dengan peraturan perundang-undangan.",
    "Kategori": "Pemantauan Kesehatan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "7.4.5",
    "Deskripsi": "Catatan mengenai pemantauan kesehatan tenaga kerja dibuat sesuai dengan peraturan perundang-undangan.",
    "Kategori": "Pemantauan Kesehatan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "8.1.1",
    "Deskripsi": "Terdapat prosedur pelaporan bahaya yang berhubungan dengan K3 dan prosedur ini diketahui oleh tenaga kerja.",
    "Kategori": "Pelaporan Bahaya",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "8.2.1",
    "Deskripsi": "Terdapat prosedur terdokumentasi yang menjamin bahwa semua kecelakaan kerja, penyakit akibat kerja, kebakaran atau peledakan serta kejadian berbahaya lainnya di tempat kerja dicatat dan dilaporkan sesuai dengan peraturan perundang-undangan.",
    "Kategori": "Pelaporan Kecelakaan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "8.3.1",
    "Deskripsi": "Tempat kerja/perusahaan mempunyai prosedur pemeriksaan dan pengkajian kecelakaan kerja dan penyakit akibat kerja.",
    "Kategori": "Pemeriksaan dan Pengkajian Kecelakaan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "8.3.2",
    "Deskripsi": "Pemeriksaan dan pengkajian kecelakaan kerja dilakukan oleh petugas atau ahli K3 yang telah ditunjuk sesuai peraturan perundang-undangan atau pihak lain yang berkompeten dan berwenang.",
    "Kategori": "Pemeriksaan dan Pengkajian Kecelakaan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "8.3.3",
    "Deskripsi": "Laporan pemeriksaan dan pengkajian berisi tentang sebab dan akibat serta rekomendasi/saran dan jadwal waktu pelaksanaan usaha perbaikan.",
    "Kategori": "Pemeriksaan dan Pengkajian Kecelakaan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "8.3.4",
    "Deskripsi": "Penanggung jawab untuk melaksanakan tindakan perbaikan atas laporan pemeriksaan dan pengkajian telah ditetapkan.",
    "Kategori": "Pemeriksaan dan Pengkajian Kecelakaan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "8.3.5",
    "Deskripsi": "Tindakan perbaikan diinformasikan kepada tenaga kerja yang bekerja di tempat terjadinya kecelakaan.",
    "Kategori": "Pemeriksaan dan Pengkajian Kecelakaan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "8.3.6",
    "Deskripsi": "Pelaksanaan tindakan perbaikan dipantau, didokumentasikan dan atau diinformasikan ke seluruh tenaga kerja.",
    "Kategori": "Pemeriksaan dan Pengkajian Kecelakaan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "8.4.1",
    "Deskripsi": "Terdapat prosedur untuk menangani masalah K3 yang timbul dan sesuai dengan peraturan perundang-undangan yang berlaku.",
    "Kategori": "Penanganan Masalah",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "9.1.1",
    "Deskripsi": "Terdapat prosedur untuk identifikasi potensi bahaya dan menilai risiko yang berhubungan dengan penanganan material secara manual dan mekanis.",
    "Kategori": "Penanganan Material Manual dan Mekanis",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "9.1.2",
    "Deskripsi": "Identifikasi dan penilaian risiko dilaksanakan oleh petugas yang berkompeten dan berwenang.",
    "Kategori": "Penanganan Material Manual dan Mekanis",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "9.1.3",
    "Deskripsi": "Pengusaha atau pengurus menerapkan dan meninjau ulang cara pengendalian risiko yang berhubungan dengan penanganan secara manual dan mekanis.",
    "Kategori": "Penanganan Material Manual dan Mekanis",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "9.1.4",
    "Deskripsi": "Terdapat prosedur untuk penanganan bahan meliputi metode pencegahan terhadap kerusakan, tumpahan dan/atau kebocoran.",
    "Kategori": "Penanganan Material Manual dan Mekanis",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "9.2.1",
    "Deskripsi": "Terdapat prosedur yang menjamin bahwa bahan disimpan dan dipindahkan dengan cara yang aman sesuai dengan peraturan perundang-undangan yang berlaku.",
    "Kategori": "Sistem Pengangkutan, Penyimpanan dan Pembuangan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "9.2.2",
    "Deskripsi": "Terdapat prosedur yang menjelaskan persyaratan pengendalian bahan yang dapat rusak atau kadaluarsa.",
    "Kategori": "Sistem Pengangkutan, Penyimpanan dan Pembuangan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "9.2.3",
    "Deskripsi": "Terdapat prosedur yang menjamin bahwa bahan dibuang dengan cara yang aman sesuai dengan peraturan perundang-undangan.",
    "Kategori": "Sistem Pengangkutan, Penyimpanan dan Pembuangan",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "9.3.1",
    "Deskripsi": "Perusahaan telah mendokumentasikan dan menerapkan prosedur mengenai penyimpanan, penanganan dan pemindahan Bahan Kimia Berbahaya (BKB) sesuai dengan persyaratan peraturan perundang-undangan, standar dan pedoman teknis yang relevan.",
    "Kategori": "Pengendalian Bahan Kimia Berbahaya",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "9.3.2",
    "Deskripsi": "Terdapat Lembar Data Keselamatan (MSDS) meliputi keterangan mengenai keselamatan bahan sebagaimana diatur pada peraturan perundang-undangan dan dengan mudah dapat diperoleh.",
    "Kategori": "Pengendalian Bahan Kimia Berbahaya",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "9.3.3",
    "Deskripsi": "Terdapat sistem untuk mengidentifikasi dan pemberian label pada bahan kimia berbahaya.",
    "Kategori": "Pengendalian Bahan Kimia Berbahaya",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "9.3.4",
    "Deskripsi": "Rambu peringatan bahaya terpampang sesuai dengan persyaratan peraturan perundang-undangan dan/atau standard yang relevan.",
    "Kategori": "Pengendalian Bahan Kimia Berbahaya",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "9.3.5",
    "Deskripsi": "Penanganan BKB dilakukan oleh petugas yang kompeten dan berwenang.",
    "Kategori": "Pengendalian Bahan Kimia Berbahaya",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "10.1.1",
    "Deskripsi": "Pengusaha atau pengurus telah mendokumentasikan dan menerapkan prosedur pelaksanaan identifikasi, pengumpulan, pengarsipan, pemeliharaan, penyimpanan dan penggantian catatan K3.",
    "Kategori": "Catatan K3",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "10.1.2",
    "Deskripsi": "Peraturan perundang-undangan, standar dan pedoman teknis yang relevan dipelihara pada tempat yang mudah didapat.",
    "Kategori": "Catatan K3",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "10.1.3",
    "Deskripsi": "Terdapat prosedur yang menentukan persyaratan untuk menjaga kerahasiaan catatan.",
    "Kategori": "Catatan K3",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "10.1.4",
    "Deskripsi": "Catatan kompensasi kecelakaan kerja dan catatan rehabilitasi kesehatan tenaga kerja dipelihara.",
    "Kategori": "Catatan K3",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "10.2.1",
    "Deskripsi": "Data K3 yang terbaru dikumpulkan dan dianalisa.",
    "Kategori": "Data dan Laporan K3",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "10.2.2",
    "Deskripsi": "Laporan rutin kinerja K3 dibuat dan disebarluaskan di dalam tempat kerja.",
    "Kategori": "Data dan Laporan K3",
    "Tingkat": "Transisi"
  },
  {
    "Kode": "11.1.1",
    "Deskripsi": "Audit internal SMK3 yang terjadwal dilaksanakan untuk memeriksa kesesuaian kegiatan perencanaan dan untuk menentukan efektivitas kegiatan tersebut.",
    "Kategori": "Audit Internal SMK3",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "11.1.2",
    "Deskripsi": "Audit internal SMK3 dilakukan oleh petugas yang independen, kompeten dan berwenang.",
    "Kategori": "Audit Internal SMK3",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "11.1.3",
    "Deskripsi": "Laporan audit didistribusikan kepada pengusaha atau pengurus dan petugas lain yang berkepentingan dan dipantau untuk menjamin dilakukan tindakan perbaikan.",
    "Kategori": "Audit Internal SMK3",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.1.1",
    "Deskripsi": "Analisa kebutuhan pelatihan K3 sesuai persyaratan peraturan perundang-undangan telah dilakukan.",
    "Kategori": "Strategi Pelatihan",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.1.2",
    "Deskripsi": "Rencana pelatihan K3 bagi semua tingkatan telah disusun.",
    "Kategori": "Strategi Pelatihan",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.1.3",
    "Deskripsi": "Jenis pelatihan K3 yang harus dilakukan harus disesuaikan dengan kebutuhan untuk pengendalian potensi bahaya.",
    "Kategori": "Strategi Pelatihan",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.1.4",
    "Deskripsi": "Pelatihan dilakukan oleh orang atau badan yang berkompeten dan berwenang sesuai peraturan perundang-undangan.",
    "Kategori": "Strategi Pelatihan",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.1.5",
    "Deskripsi": "Terdapat fasilitas dan sumber daya memadai untuk pelaksanaan pelatihan yang efektif.",
    "Kategori": "Strategi Pelatihan",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.1.6",
    "Deskripsi": "Pengusaha atau pengurus mendokumentasikan dan menyimpan catatan seluruh pelatihan.",
    "Kategori": "Strategi Pelatihan",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.1.7",
    "Deskripsi": "Program pelatihan ditinjau secara teratur untuk menjamin agar tetap relevan dan efektif.",
    "Kategori": "Strategi Pelatihan",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.2.1",
    "Deskripsi": "Anggota manajemen eksekutif dan pengurus berperan serta dalam pelatihan yang mencakup penjelasan tentang kewajiban hukum dan prinsip-prinsip serta pelaksanaan K3.",
    "Kategori": "Pelatihan Bagi Manajemen dan Penyelia",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.2.2",
    "Deskripsi": "Manajer dan penyelia menerima pelatihan yang sesuai dengan peran dan tanggung jawab mereka.",
    "Kategori": "Pelatihan Bagi Manajemen dan Penyelia",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.3.1",
    "Deskripsi": "Pelatihan diberikan kepada semua tenaga kerja termasuk tenaga kerja baru dan yang dipindahkan agar mereka dapat melaksanakan tugasnya secara aman.",
    "Kategori": "Pelatihan Bagi Tenaga Kerja",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.3.2",
    "Deskripsi": "Pelatihan diberikan kepada tenaga kerja apabila di tempat kerjanya terjadi perubahan sarana produksi atau proses.",
    "Kategori": "Pelatihan Bagi Tenaga Kerja",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.3.3",
    "Deskripsi": "Pengusaha atau pengurus memberikan pelatihan penyegaran kepada semua tenaga kerja.",
    "Kategori": "Pelatihan Bagi Tenaga Kerja",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.4.1",
    "Deskripsi": "Terdapat prosedur yang menetapkan persyaratan untuk memberikan taklimat (briefing) kepada pengunjung dan mitra kerja guna menjamin K3.",
    "Kategori": "Pelatihan Untuk Pengunjung dan Kontraktor",
    "Tingkat": "Lanjutan"
  },
  {
    "Kode": "12.5.1",
    "Deskripsi": "Perusahaan mempunyai sistem untuk menjamin kepatuhan terhadap persyaratan lisensi atau kualifikasi sesuai dengan peraturan perundang-undangan untuk melaksanakan tugas khusus, melaksanakan pekerjaan atau mengoperasikan peralatan.",
    "Kategori": "Pelatihan Khusus",
    "Tingkat": "Lanjutan"
  }
]
;

async function injectData() {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        await Kriteria.insertMany(kriteriaData);
        console.log('Data berhasil di-inject ke MongoDB');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error saat meng-inject data:', error);
    }
}

injectData();
