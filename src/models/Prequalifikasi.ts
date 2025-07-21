import mongoose, { Schema } from 'mongoose';

const PrequalificationSchema = new Schema({
  Auditee: { type: Schema.Types.ObjectId, ref: 'Auditee', required: true },
  ID_Perusahaan: { type: Schema.Types.ObjectId, ref: 'Perusahaan', required: true },
  ID_Auditor: { type: Schema.Types.ObjectId, ref: 'Auditor', required: true },
  Penanggung_Jawab: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
  Tanggal_Pengisian: { type: Date, default: Date.now },

  Jawaban: [
    {
      Kriteria: { type: Schema.Types.ObjectId, ref: 'Kriteria', required: true }, // Relasi ke koleksi Kriteria
      Pilihan: { type: String, enum: ['Ya', 'Tidak', 'Tidak Berlaku'], required: true },
      Keterangan: { type: String },
      File_Bukti: { type: String }
    }
  ],
  Status: { type: String, enum: ['Draft', 'Submitted', 'Verified'], default: 'Draft' }
});

export default mongoose.model('Prequalification', PrequalificationSchema);
