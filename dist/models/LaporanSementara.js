"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const laporanSementaraSchema = new mongoose_1.Schema({
    Nama_Perusahaan: String,
    Lingkup_Audit: String, // Diisi manual oleh auditor
    Pelaksanaan_Audit: String, // Bisa dari prequalification
    Tujuan_Audit: String, // Diisi manual oleh auditor
    ID_Audit: { type: mongoose_1.Schema.Types.ObjectId, ref: "Auditee" },
    Auditor: { type: mongoose_1.Schema.Types.ObjectId, ref: "Auditor" },
    Daftar_Temuan: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Temuan' }],
    Tingkat_Pencapaian: String,
    Ringkasan_Hasil: String,
});
exports.default = (0, mongoose_1.model)("LaporanSementara", laporanSementaraSchema);
