import { Schema, model } from "mongoose";

const auditorSchema = new Schema({
  Nama: { type: String, required: true },
  Jabatan: String,
  Lembaga_Audit: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model("Auditor", auditorSchema);
