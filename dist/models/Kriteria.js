"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const kriteriaSchema = new mongoose_1.Schema({
    Kode: { type: String, required: true, unique: true }, // misal: "1.1.1"
    Deskripsi: String,
    Kategori: String,
    Referensi: String,
    Tingkat: { type: String, enum: ["Awal", "Transisi", "Lanjutan"] }, // opsional, untuk filter tingkat audit
});
exports.default = (0, mongoose_1.model)("Kriteria", kriteriaSchema);
