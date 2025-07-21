import { Schema, model } from "mongoose";

const laporanSementaraSchema = new Schema({
  Nama_Perusahaan: String,
  Lingkup_Audit: String,         // Diisi manual oleh auditor
  Pelaksanaan_Audit: String,     // Bisa dari prequalification
  Tujuan_Audit: String,          // Diisi manual oleh auditor
  ID_Audit: { type: Schema.Types.ObjectId, ref: "Auditee" },
  Auditor: { type: Schema.Types.ObjectId, ref: "Auditor" },
  Daftar_Temuan: [{ type: Schema.Types.ObjectId, ref: 'Temuan' }],
  Tingkat_Pencapaian: String,
  Ringkasan_Hasil: String,
});

export default model("LaporanSementara", laporanSementaraSchema);
