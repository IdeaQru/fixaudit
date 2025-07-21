import { Schema, model, Document, Types } from "mongoose";

// TypeScript interface untuk NCR Form
export interface INcrForm extends Document {
  ID_Temuan?: Types.ObjectId;
  Deskripsi: string;
  Klasifikasi: string;
  Root_Cause: string;
  Rekomendasi: string;
  Batas_Waktu: string;
  Tanggapan: string;
  Tindak_Lanjut: string;
  Penanggung_Jawab: Types.ObjectId;
}

const ncrFormSchema = new Schema<INcrForm>({
  ID_Temuan: { type: Schema.Types.ObjectId, ref: "Temuan" },
  Deskripsi: { type: String, required: true },
  Klasifikasi: { type: String, required: true },
  Root_Cause: { type: String, required: true },
  Rekomendasi: { type: String, required: true },
  Batas_Waktu: { type: String, required: true },
  Tanggapan: { type: String, required: true },
  Tindak_Lanjut: { type: String, required: true },
  Penanggung_Jawab: { type: Schema.Types.ObjectId, ref: 'User', required: true}
}, { timestamps: true });

export default model<INcrForm>("NcrForm", ncrFormSchema);

