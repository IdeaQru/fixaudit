"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const temuanSchema = new mongoose_1.Schema({
    ID_Audit: { type: mongoose_1.Schema.Types.ObjectId, ref: "Auditee" },
    ID_Kriteria: { type: mongoose_1.Schema.Types.ObjectId, ref: "Kriteria" },
    Deskripsi: String,
    Tanggal_Temuan: String,
    Bukti: String,
    Tindak_Lanjut: String,
    Status_TL: String,
    Klasifikasi_Temuan: String
});
exports.default = (0, mongoose_1.model)("Temuan", temuanSchema);
