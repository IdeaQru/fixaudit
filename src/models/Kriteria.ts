import { Schema, model } from "mongoose";

const kriteriaSchema = new Schema({
  Kode: { type: String, required: true, unique: true }, // misal: "1.1.1"
  Deskripsi: String,
  Kategori: String,
  Referensi: String,
  Tingkat: { type: String, enum: ["Awal", "Transisi", "Lanjutan"] }, // opsional, untuk filter tingkat audit
});

export default model("Kriteria", kriteriaSchema);
