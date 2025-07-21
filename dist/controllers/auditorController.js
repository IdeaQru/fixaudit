"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAuditor = exports.getAuditorProfile = exports.createAuditor = void 0;
const Auditor_1 = __importDefault(require("../models/Auditor"));
// Pastikan ada middleware autentikasi yang mengisi req.user
const createAuditor = async (req, res) => {
    try {
        // Pastikan user sudah login dan req.user tersedia
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        // Cek apakah user sudah pernah submit auditor
        const existing = await Auditor_1.default.findOne({ userId });
        if (existing) {
            return res.status(409).json({ error: "Akun ini sudah pernah submit data auditor." });
        }
        // Validasi field yang wajib (misal: nama)
        if (!req.body.Nama) {
            return res.status(400).json({ error: "Nama auditor wajib diisi." });
        }
        // Buat data auditor baru
        const auditor = new Auditor_1.default({ ...req.body, userId });
        await auditor.save();
        res.status(201).json(auditor);
    }
    catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan pada server." });
    }
};
exports.createAuditor = createAuditor;
const getAuditorProfile = async (req, res) => {
    const userId = req.user.id;
    const auditor = await Auditor_1.default.findOne({ userId });
    if (!auditor)
        return res.status(404).json({ error: "Belum ada data auditor" });
    res.json(auditor);
};
exports.getAuditorProfile = getAuditorProfile;
const getAllAuditor = async (req, res) => {
    const auditor = await Auditor_1.default.find();
    if (!auditor)
        return res.status(404).json({ error: "Belum ada data auditor" });
    res.json(auditor);
};
exports.getAllAuditor = getAllAuditor;
