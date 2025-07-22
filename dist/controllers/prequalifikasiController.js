"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrequalification = exports.updatePrequalification = exports.getPrequalificationByAuditee = exports.getPrequalificationById = exports.getAllPrequalification = exports.getPrequalificationByPerusahaan = exports.createPrequalification = void 0;
// controllers/prequalification.controller.js
const Prequalifikasi_1 = __importDefault(require("../models/Prequalifikasi"));
const mongoose_1 = __importDefault(require("mongoose"));
const createPrequalification = async (req, res) => {
    try {
        const { Auditee, ID_Perusahaan, ID_Auditor, Jawaban, Status, Penanggung_Jawab, Tanggal_Pengisian } = req.body;
        // ✅ Filter berdasarkan Penanggung_Jawab (bukan kombinasi lain)
        const filter = {
            Penanggung_Jawab: new mongoose_1.default.Types.ObjectId(Penanggung_Jawab)
        };
        // Cek apakah sudah ada dokumen dengan Penanggung_Jawab yang sama
        let existingPrequal = await Prequalifikasi_1.default.findOne(filter);
        if (!existingPrequal) {
            // CREATE - Buat dokumen baru
            const newPrequal = new Prequalifikasi_1.default({
                Auditee,
                ID_Perusahaan,
                ID_Auditor,
                Penanggung_Jawab,
                Tanggal_Pengisian: Tanggal_Pengisian || new Date(),
                Status: Status || 'Draft',
                Jawaban: Array.isArray(Jawaban) ? Jawaban : [Jawaban]
            });
            const savedPrequal = await newPrequal.save();
            return res.status(201).json(savedPrequal);
        }
        else {
            // UPDATE/ADD - Push/update jawaban ke dokumen yang sudah ada
            const jawabanArr = Array.isArray(Jawaban) ? Jawaban : [Jawaban];
            for (const newJawaban of jawabanArr) {
                // Push jawaban baru ke array
                await Prequalifikasi_1.default.updateOne(filter, {
                    $push: { Jawaban: newJawaban }
                });
            }
            // Ambil data terbaru
            const updatedPrequal = await Prequalifikasi_1.default.findOne(filter);
            return res.status(200).json(updatedPrequal);
        }
    }
    catch (err) {
        console.error('Error in createPrequalification:', err);
        res.status(400).json({ error: err.message || err });
    }
};
exports.createPrequalification = createPrequalification;
const getPrequalificationByPerusahaan = async (req, res) => {
    try {
        const { perusahaanId } = req.query;
        const data = await Prequalifikasi_1.default.find({ ID_Perusahaan: perusahaanId })
            .populate('Auditee')
            .populate('ID_Perusahaan')
            .populate('ID_Auditor')
            .populate('Penanggung_Jawab')
            .populate('Jawaban.Kriteria');
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.getPrequalificationByPerusahaan = getPrequalificationByPerusahaan;
// GET all prequalifications (populate jawaban.kriteria)
const getAllPrequalification = async (req, res) => {
    try {
        const data = await Prequalifikasi_1.default.find()
            .populate('Auditee')
            .populate('ID_Perusahaan')
            .populate('ID_Auditor')
            .populate('Jawaban.Kriteria');
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.getAllPrequalification = getAllPrequalification;
// GET prequalification by ID
const getPrequalificationById = async (req, res) => {
    try {
        const prequal = await Prequalifikasi_1.default.findById(req.params.id)
            .populate('Auditee')
            .populate('ID_Perusahaan')
            .populate('ID_Auditor')
            .populate('Jawaban.Kriteria');
        if (!prequal)
            return res.status(404).json({ error: 'Not found' });
        res.json(prequal);
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.getPrequalificationById = getPrequalificationById;
// controllers/prequalification.controller.js
const getPrequalificationByAuditee = async (req, res) => {
    try {
        const { auditeeId, perusahaanId, auditorId } = req.query;
        if (!auditeeId) {
            return res.status(400).json({ error: 'auditeeId is required' });
        }
        const filter = { Auditee: new mongoose_1.default.Types.ObjectId(auditeeId) };
        if (perusahaanId)
            filter.ID_Perusahaan = new mongoose_1.default.Types.ObjectId(perusahaanId);
        if (auditorId)
            filter.ID_Auditor = new mongoose_1.default.Types.ObjectId(auditorId);
        const prequal = await Prequalifikasi_1.default.findOne(filter)
            .populate('Auditee')
            .populate('ID_Perusahaan')
            .populate('ID_Auditor')
            .populate('Jawaban.Kriteria');
        if (!prequal)
            return res.status(404).json({ error: 'Not found' });
        res.json(prequal);
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.getPrequalificationByAuditee = getPrequalificationByAuditee;
// UPDATE prequalification by ID
const updatePrequalification = async (req, res) => {
    try {
        const prequal = await Prequalifikasi_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!prequal)
            return res.status(404).json({ error: 'Not found' });
        res.json(prequal);
    }
    catch (err) {
        res.status(400).json({ error: err.message || err });
    }
};
exports.updatePrequalification = updatePrequalification;
// DELETE prequalification by ID
const deletePrequalification = async (req, res) => {
    try {
        const prequal = await Prequalifikasi_1.default.findByIdAndDelete(req.params.id);
        if (!prequal)
            return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.deletePrequalification = deletePrequalification;
