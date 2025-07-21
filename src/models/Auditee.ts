import { Schema, model } from "mongoose";

const auditeeSchema = new Schema({
  ID_Perusahaan: { type: Schema.Types.ObjectId, ref: "Perusahaan" },
  Tanggal_Audit: String,
  Tingkat_Audit: String,
  Status_Audit: String,
  ID_Auditor: { type: Schema.Types.ObjectId, ref: "Auditor" },

});

export default model("Auditee", auditeeSchema);
