"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNcrFormByUser = exports.getNcrForms = exports.updateNcrForm = exports.createNcrForm = void 0;
const NcrForm_1 = __importDefault(require("../models/NcrForm"));
// Create NCR Form
// Fungsi untuk CREATE NCR baru
const createNcrForm = async (req, res) => {
    try {
        const { Penanggung_Jawab, ID_Temuan } = req.body;
        // Validasi input wajib
        if (!Penanggung_Jawab || !ID_Temuan) {
            return res.status(400).json({
                error: 'Penanggung_Jawab dan ID_Temuan wajib diisi'
            });
        }
        // Cek apakah NCR untuk kombinasi ini sudah ada
        const existingNcr = await NcrForm_1.default.findOne({
            Penanggung_Jawab,
            ID_Temuan
        });
        if (existingNcr) {
            return res.status(409).json({
                error: 'NCR untuk temuan ini sudah ada',
                existing_ncr_id: existingNcr._id
            });
        }
        // Buat NCR baru
        const ncrform = new NcrForm_1.default(req.body);
        await ncrform.save();
        console.log(`NCR created for user: ${Penanggung_Jawab}, temuan: ${ID_Temuan}`);
        return res.status(201).json({
            message: 'NCR berhasil dibuat',
            data: ncrform
        });
    }
    catch (err) {
        console.error('Error in createNcrForm:', err);
        if (err.code === 11000) {
            return res.status(409).json({
                error: 'NCR untuk temuan ini sudah ada'
            });
        }
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({
                error: 'Validation Error',
                details: validationErrors
            });
        }
        res.status(500).json({
            error: 'Internal Server Error',
            message: err.message || err
        });
    }
};
exports.createNcrForm = createNcrForm;
// Fungsi untuk UPDATE NCR yang sudah ada
const updateNcrForm = async (req, res) => {
    try {
        const { id } = req.params; // NCR ID dari URL parameter
        const updateData = req.body;
        // Jangan izinkan mengubah ID_Temuan dan Penanggung_Jawab
        delete updateData.ID_Temuan;
        delete updateData.Penanggung_Jawab;
        const updatedNcr = await NcrForm_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedNcr) {
            return res.status(404).json({
                error: 'NCR tidak ditemukan'
            });
        }
        console.log(`NCR updated: ${id}`);
        return res.status(200).json({
            message: 'NCR berhasil diperbarui',
            data: updatedNcr
        });
    }
    catch (err) {
        console.error('Error in updateNcrForm:', err);
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({
                error: 'Validation Error',
                details: validationErrors
            });
        }
        res.status(500).json({
            error: 'Internal Server Error',
            message: err.message || err
        });
    }
};
exports.updateNcrForm = updateNcrForm;
// Get All NCR Forms
const getNcrForms = async (req, res) => {
    try {
        const ncrforms = await NcrForm_1.default.find()
            .populate('Penanggung_Jawab')
            .populate('ID_Temuan');
        res.json(ncrforms);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || err });
    }
};
exports.getNcrForms = getNcrForms;
// Get NCR Form by User (Penanggung_Jawab)
const getNcrFormByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        // ✅ PERBAIKAN: Gunakan find() bukan findOne()
        const ncrforms = await NcrForm_1.default.find({ Penanggung_Jawab: userId })
            .populate('Penanggung_Jawab')
            .populate('ID_Temuan')
            .sort({ createdAt: -1 }); // Urutkan berdasarkan tanggal terbaru
        // Kembalikan array kosong jika tidak ada data, bukan error 404
        if (!ncrforms || ncrforms.length === 0) {
            return res.status(200).json([]); // ✅ Return array kosong
        }
        console.log(`Found ${ncrforms.length} NCR(s) for user: ${userId}`);
        res.status(200).json(ncrforms); // ✅ Return array
    }
    catch (err) {
        console.error('Error in getNcrFormByUser:', err);
        res.status(500).json({
            error: 'Internal Server Error',
            message: err.message || err
        });
    }
};
exports.getNcrFormByUser = getNcrFormByUser;
