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
        const filter = {
            Auditee: new mongoose_1.default.Types.ObjectId(Auditee),
            ID_Perusahaan: new mongoose_1.default.Types.ObjectId(ID_Perusahaan),
            ID_Auditor: new mongoose_1.default.Types.ObjectId(ID_Auditor)
        };
        // Cek apakah dokumen sudah ada
        const existingPrequal = await Prequalifikasi_1.default.findOne(filter);
        if (!existingPrequal) {
            // Buat baru jika belum ada
            const prequal = new Prequalifikasi_1.default({
                Auditee,
                ID_Perusahaan,
                ID_Auditor,
                Penanggung_Jawab,
                Jawaban: Array.isArray(Jawaban) ? Jawaban : [Jawaban],
                Status: Status || 'Draft',
                Tanggal_Pengisian: Tanggal_Pengisian || new Date()
            });
            await prequal.save();
            return res.status(201).json(prequal);
        }
        else {
            // Update hanya jawaban menggunakan MongoDB aggregation
            const jawabanArr = Array.isArray(Jawaban) ? Jawaban : [Jawaban];
            for (const jwb of jawabanArr) {
                const kriteria = jwb.Kriteria || jwb.Kode;
                // Update jika kriteria sudah ada, atau add jika belum ada
                await Prequalifikasi_1.default.updateOne({
                    ...filter,
                    "Jawaban.Kriteria": kriteria
                }, {
                    $set: { "Jawaban.$": jwb }
                });
                // Jika tidak ada yang terupdate, berarti kriteria belum ada, jadi add
                const updated = await Prequalifikasi_1.default.findOne({
                    ...filter,
                    "Jawaban.Kriteria": kriteria
                });
                if (!updated) {
                    await Prequalifikasi_1.default.updateOne(filter, { $push: { Jawaban: jwb } });
                }
            }
            // Ambil data terbaru untuk response
            const updatedPrequal = await Prequalifikasi_1.default.findOne(filter);
            return res.status(201).json(updatedPrequal);
        }
    }
    catch (err) {
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
