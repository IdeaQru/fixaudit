"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemuanByAudit = exports.getTemuan = exports.createTemuan = void 0;
const Temuan_1 = __importDefault(require("../models/Temuan"));
const createTemuan = async (req, res) => {
    try {
        const { ID_Audit, ID_Kriteria, Deskripsi, Tanggal_Temuan, Bukti, Tindak_Lanjut, Status_TL, Klasifikasi_Temuan } = req.body;
        // Cari Temuan dengan ID_Audit & ID_Kriteria yang sama
        const updatedTemuan = await Temuan_1.default.findOneAndUpdate({ ID_Audit, ID_Kriteria }, {
            $set: {
                Deskripsi,
                Tanggal_Temuan,
                Bukti,
                Tindak_Lanjut,
                Status_TL,
                Klasifikasi_Temuan
            }
        }, { new: true, upsert: true } // upsert: true = create jika tidak ada
        );
        res.status(200).json(updatedTemuan);
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.createTemuan = createTemuan;
const getTemuan = async (req, res) => {
    try {
        const temuan = await Temuan_1.default.find();
        res.json(temuan);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.getTemuan = getTemuan;
// controllers/temuanController.ts
const getTemuanByAudit = async (req, res) => {
    try {
        const { auditId } = req.params;
        const temuan = await Temuan_1.default.find({ ID_Audit: auditId })
            .populate({
            path: 'ID_Kriteria',
            select: 'Kode Deskripsi Kategori Referensi Tingkat'
        })
            .sort({ Tanggal_Temuan: -1 });
        res.json(temuan);
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.getTemuanByAudit = getTemuanByAudit;
