import { Schema, model } from "mongoose";
import User from "./User";

const perusahaanSchema = new Schema({
  Nama: { type: String, required: true },
  Alamat: String,
  Jenis_Usaha: String,
  Tanggal_Audit: String,
  UserId: { type: Schema.Types.ObjectId, ref: 'User', unique: true }

});

export default model("Perusahaan", perusahaanSchema);
