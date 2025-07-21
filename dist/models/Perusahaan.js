"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const perusahaanSchema = new mongoose_1.Schema({
    Nama: { type: String, required: true },
    Alamat: String,
    Jenis_Usaha: String,
    Tanggal_Audit: String,
    UserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', unique: true }
});
exports.default = (0, mongoose_1.model)("Perusahaan", perusahaanSchema);
