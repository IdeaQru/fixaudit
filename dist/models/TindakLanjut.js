"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tindakLanjutSchema = new mongoose_1.Schema({
    Deskripsi_TL: String,
    Tanggal_TL: String,
    Penanggung_Jawab: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', unique: true },
    Status_TL: String,
    ID_Temuan: { type: mongoose_1.Schema.Types.ObjectId, ref: "Temuan" },
});
exports.default = (0, mongoose_1.model)("TindakLanjut", tindakLanjutSchema);
