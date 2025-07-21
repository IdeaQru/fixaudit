"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ncrFormSchema = new mongoose_1.Schema({
    ID_Temuan: { type: mongoose_1.Schema.Types.ObjectId, ref: "Temuan" },
    Deskripsi: { type: String, required: true },
    Klasifikasi: { type: String, required: true },
    Root_Cause: { type: String, required: true },
    Rekomendasi: { type: String, required: true },
    Batas_Waktu: { type: String, required: true },
    Tanggapan: { type: String, required: true },
    Tindak_Lanjut: { type: String, required: true },
    Penanggung_Jawab: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("NcrForm", ncrFormSchema);
