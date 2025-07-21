"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const auditeeSchema = new mongoose_1.Schema({
    ID_Perusahaan: { type: mongoose_1.Schema.Types.ObjectId, ref: "Perusahaan" },
    Tanggal_Audit: String,
    Tingkat_Audit: String,
    Status_Audit: String,
    ID_Auditor: { type: mongoose_1.Schema.Types.ObjectId, ref: "Auditor" },
});
exports.default = (0, mongoose_1.model)("Auditee", auditeeSchema);
