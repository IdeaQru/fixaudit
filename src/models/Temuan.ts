import { Schema, model } from "mongoose";

const temuanSchema = new Schema({
  ID_Audit: { type: Schema.Types.ObjectId, ref: "Auditee" },
  ID_Kriteria: { type: Schema.Types.ObjectId, ref: "Kriteria" },
  Deskripsi: String,
  Tanggal_Temuan: String,
  Bukti: String,
  Tindak_Lanjut: String,
  Status_TL: String,
  Klasifikasi_Temuan: String
});

export default model("Temuan", temuanSchema);
