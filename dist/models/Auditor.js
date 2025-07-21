"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const auditorSchema = new mongoose_1.Schema({
    Nama: { type: String, required: true },
    Jabatan: String,
    Lembaga_Audit: String,
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
});
exports.default = (0, mongoose_1.model)("Auditor", auditorSchema);
