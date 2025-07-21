"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAuditee = exports.updateAuditee = exports.getAuditeeByAuditor = exports.getAuditeeByPerusahaan = exports.getAuditee = exports.createAuditee = void 0;
const Auditee_1 = __importDefault(require("../models/Auditee"));
const Perusahaan_1 = __importDefault(require("../models/Perusahaan"));
const createAuditee = async (req, res) => {
    try {
        const auditee = new Auditee_1.default(req.body);
        await auditee.save();
        res.status(201).json(auditee);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.createAuditee = createAuditee;
const getAuditee = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        // console.log(userId);
        if (!userId) {
            return res.status(401).json({ error: "User belum login" });
        }
        // Cari perusahaan milik user ini
        const perusahaan = await Perusahaan_1.default.findOne({ UserId: userId });
        if (!perusahaan) {
            return res.status(404).json({ error: "Perusahaan tidak ditemukan untuk user ini" });
        }
        // Cari auditee berdasarkan ID_Perusahaan
        const auditee = await Auditee_1.default.find({ ID_Perusahaan: perusahaan._id })
            .populate({
            path: "ID_Perusahaan",
            select: "Nama"
        })
            .populate({
            path: "ID_Auditor",
            select: "nama Nama username"
        });
        res.json(auditee);
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.getAuditee = getAuditee;
// auditee.controller.js
const getAuditeeByPerusahaan = async (req, res) => {
    try {
        const perusahaanId = req.query.perusahaanId;
        if (!perusahaanId) {
            return res.status(400).json({ error: "Parameter perusahaanId wajib diisi" });
        }
        const auditee = await Auditee_1.default.find({ ID_Perusahaan: perusahaanId });
        if (!auditee || auditee.length === 0) {
            return res.status(404).json({ error: "Auditee tidak ditemukan" });
        }
        res.json(auditee);
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.getAuditeeByPerusahaan = getAuditeeByPerusahaan;
// GET /api/auditee/by-auditor/:auditorId
const getAuditeeByAuditor = async (req, res) => {
    try {
        const { auditorId } = req.params;
        if (!auditorId) {
            return res.status(400).json({ error: "ID Auditor wajib diisi" });
        }
        // Cari auditee yang memiliki ID_Auditor sesuai parameter
        const auditees = await Auditee_1.default.find({ ID_Auditor: auditorId })
            .populate({
            path: "ID_Perusahaan",
            select: "Nama"
        })
            .populate({
            path: "ID_Auditor",
            select: "nama Nama username"
        });
        res.json(auditees);
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.getAuditeeByAuditor = getAuditeeByAuditor;
// PUT /api/auditee/:id
const updateAuditee = async (req, res) => {
    try {
        const auditee = await Auditee_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!auditee) {
            return res.status(404).json({ error: "Auditee tidak ditemukan" });
        }
        res.json(auditee);
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.updateAuditee = updateAuditee;
// DELETE /api/auditee/:id
const deleteAuditee = async (req, res) => {
    try {
        const auditee = await Auditee_1.default.findByIdAndDelete(req.params.id);
        if (!auditee) {
            return res.status(404).json({ error: "Auditee tidak ditemukan" });
        }
        res.json({ message: "Auditee berhasil dihapus" });
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.deleteAuditee = deleteAuditee;
