"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateTemuan = exports.updateStatusPenyelesaian = exports.getStatistikTemuan = exports.deleteTemuan = exports.getTemuanById = exports.getTemuanByAudit = exports.getTemuan = exports.createTemuan = void 0;
const Temuan_1 = __importDefault(require("../models/Temuan"));
const mongoose_1 = __importDefault(require("mongoose"));
// ===== CREATE/UPDATE TEMUAN =====
const createTemuan = async (req, res) => {
    try {
        const { _id, ID_Audit, ID_Kriteria, Deskripsi, Root_Cause, Rekomendasi, Tanggal_Temuan, Bukti, Tindak_Lanjut, Status_TL, Klasifikasi_Temuan, Auditor, Target_Penyelesaian, Catatan_Penyelesaian } = req.body;
        // Validasi required fields
        if (!ID_Audit || !ID_Kriteria || !Status_TL) {
            res.status(400).json({
                success: false,
                error: 'ID_Audit, ID_Kriteria, dan Status_TL wajib diisi'
            });
            return;
        }
        // Validasi ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(ID_Audit) || !mongoose_1.default.Types.ObjectId.isValid(ID_Kriteria)) {
            res.status(400).json({
                success: false,
                error: 'ID_Audit dan ID_Kriteria harus berupa ObjectId yang valid'
            });
            return;
        }
        // Data yang akan disimpan
        const temuanData = {
            ID_Audit: new mongoose_1.default.Types.ObjectId(ID_Audit),
            ID_Kriteria: new mongoose_1.default.Types.ObjectId(ID_Kriteria),
            Deskripsi: Deskripsi || '',
            Root_Cause: Root_Cause || '',
            Rekomendasi: Rekomendasi || '',
            Tanggal_Temuan: Tanggal_Temuan || new Date().toISOString().slice(0, 10),
            Bukti: Bukti || '',
            Tindak_Lanjut: Tindak_Lanjut || '',
            Status_TL,
            Klasifikasi_Temuan: Status_TL !== 'Diterima' ? Klasifikasi_Temuan : undefined,
            Auditor: Auditor ? new mongoose_1.default.Types.ObjectId(Auditor) : undefined,
            // Perbaikan: Gunakan Tanggal_Temuan sebagai base, bukan tanggal saat ini
            Tanggal_Penyelesaian: addDaysToDate(Tanggal_Temuan, 7), // tetap string
            Target_Penyelesaian: Target_Penyelesaian ? new Date(Target_Penyelesaian) : undefined,
            Catatan_Penyelesaian: Catatan_Penyelesaian || ''
        };
        let temuan;
        if (_id) {
            // UPDATE - Jika ada _id, update temuan yang sudah ada
            temuan = await Temuan_1.default.findByIdAndUpdate(_id, { $set: temuanData }, {
                new: true,
                runValidators: true,
                populate: {
                    path: 'ID_Kriteria',
                    select: 'Kode Deskripsi Kategori Referensi Tingkat'
                }
            });
            if (!temuan) {
                res.status(404).json({
                    success: false,
                    error: 'Temuan dengan ID tersebut tidak ditemukan'
                });
                return;
            }
        }
        else {
            // CREATE/UPDATE - Gunakan upsert berdasarkan ID_Audit dan ID_Kriteria
            temuan = await Temuan_1.default.findOneAndUpdate({
                ID_Audit: temuanData.ID_Audit,
                ID_Kriteria: temuanData.ID_Kriteria
            }, { $set: temuanData }, {
                new: true,
                upsert: true,
                runValidators: true,
                populate: {
                    path: 'ID_Kriteria',
                    select: 'Kode Deskripsi Kategori Referensi Tingkat'
                }
            });
        }
        res.status(200).json({
            success: true,
            message: 'Temuan berhasil disimpan',
            data: temuan
        });
    }
    catch (err) {
        console.error('Error in createTemuan:', err);
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map((e) => e.message);
            res.status(400).json({
                success: false,
                error: 'Validation Error',
                details: validationErrors
            });
            return;
        }
        // Handle duplicate key error
        if (err.code === 11000) {
            res.status(409).json({
                success: false,
                error: 'Temuan untuk kriteria ini pada audit yang sama sudah ada'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: err.message || 'Terjadi kesalahan pada server'
        });
    }
};
exports.createTemuan = createTemuan;
// ===== GET ALL TEMUAN =====
const getTemuan = async (req, res) => {
    try {
        const { page = '1', limit = '10', status, klasifikasi, auditor, sortBy = 'Tanggal_Temuan', sortOrder = 'desc' } = req.query;
        // Build filter
        const filter = {};
        if (status)
            filter.Status_TL = status;
        if (klasifikasi)
            filter.Klasifikasi_Temuan = klasifikasi;
        if (auditor)
            filter.Auditor = auditor;
        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [temuan, total] = await Promise.all([
            Temuan_1.default.find(filter)
                .populate({
                path: 'ID_Kriteria',
                select: 'Kode Deskripsi Kategori Referensi Tingkat'
            })
                .populate({
                path: 'ID_Audit',
                select: 'Status',
                populate: {
                    path: 'ID_Perusahaan',
                    select: 'Nama'
                }
            })
                .populate({
                path: 'Auditor',
                select: 'Name Email'
            })
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            Temuan_1.default.countDocuments(filter)
        ]);
        res.json({
            success: true,
            data: temuan,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    }
    catch (err) {
        console.error('Error in getTemuan:', err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: err.message
        });
    }
};
exports.getTemuan = getTemuan;
// ===== GET TEMUAN BY AUDIT =====
const getTemuanByAudit = async (req, res) => {
    try {
        const { auditId } = req.params;
        // Validasi ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(auditId)) {
            res.status(400).json({
                success: false,
                error: 'Audit ID tidak valid'
            });
            return;
        }
        const temuan = await Temuan_1.default.find({ ID_Audit: auditId })
            .populate({
            path: 'ID_Kriteria',
            select: 'Kode Deskripsi Kategori Referensi Tingkat'
        })
            .populate({
            path: 'Auditor',
            select: 'Name Email'
        })
            .sort({ Tanggal_Temuan: -1, createdAt: -1 });
        res.json({
            success: true,
            data: temuan,
            count: temuan.length
        });
    }
    catch (err) {
        console.error('Error in getTemuanByAudit:', err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: err.message
        });
    }
};
exports.getTemuanByAudit = getTemuanByAudit;
// ===== GET TEMUAN BY ID =====
const getTemuanById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                error: 'Temuan ID tidak valid'
            });
            return;
        }
        const temuan = await Temuan_1.default.findById(id)
            .populate({
            path: 'ID_Kriteria',
            select: 'Kode Deskripsi Kategori Referensi Tingkat'
        })
            .populate({
            path: 'ID_Audit',
            select: 'Status',
            populate: {
                path: 'ID_Perusahaan',
                select: 'Nama'
            }
        })
            .populate({
            path: 'Auditor',
            select: 'Name Email'
        });
        if (!temuan) {
            res.status(404).json({
                success: false,
                error: 'Temuan tidak ditemukan'
            });
            return;
        }
        res.json({
            success: true,
            data: temuan
        });
    }
    catch (err) {
        console.error('Error in getTemuanById:', err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: err.message
        });
    }
};
exports.getTemuanById = getTemuanById;
// ===== DELETE TEMUAN =====
const deleteTemuan = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                error: 'Temuan ID tidak valid'
            });
            return;
        }
        const temuan = await Temuan_1.default.findByIdAndDelete(id);
        if (!temuan) {
            res.status(404).json({
                success: false,
                error: 'Temuan tidak ditemukan'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Temuan berhasil dihapus',
            data: temuan
        });
    }
    catch (err) {
        console.error('Error in deleteTemuan:', err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: err.message
        });
    }
};
exports.deleteTemuan = deleteTemuan;
// ===== GET STATISTIK TEMUAN =====
const getStatistikTemuan = async (req, res) => {
    try {
        const { auditId, periode } = req.query;
        let matchStage = {};
        if (auditId) {
            if (!mongoose_1.default.Types.ObjectId.isValid(auditId)) {
                res.status(400).json({
                    success: false,
                    error: 'Audit ID tidak valid'
                });
                return;
            }
            matchStage.ID_Audit = new mongoose_1.default.Types.ObjectId(auditId);
        }
        // Filter berdasarkan periode
        if (periode) {
            const today = new Date();
            let startDate;
            switch (periode) {
                case '7days':
                    startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '30days':
                    startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                case '90days':
                    startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = new Date();
            }
            matchStage.createdAt = { $gte: startDate };
        }
        const statistik = await Temuan_1.default.aggregate([
            { $match: matchStage },
            {
                $facet: {
                    // Statistik berdasarkan status
                    statusStats: [
                        {
                            $group: {
                                _id: '$Status_TL',
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    // Statistik berdasarkan klasifikasi
                    klasifikasiStats: [
                        {
                            $match: { Klasifikasi_Temuan: { $exists: true } }
                        },
                        {
                            $group: {
                                _id: '$Klasifikasi_Temuan',
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    // Total temuan
                    total: [
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    // Trend per bulan (6 bulan terakhir)
                    trendBulanan: [
                        {
                            $group: {
                                _id: {
                                    year: { $year: '$createdAt' },
                                    month: { $month: '$createdAt' }
                                },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { '_id.year': -1, '_id.month': -1 } },
                        { $limit: 6 }
                    ]
                }
            }
        ]);
        const result = statistik[0];
        res.json({
            success: true,
            data: {
                total: result.total[0]?.count || 0,
                statusBreakdown: result.statusStats,
                klasifikasiBreakdown: result.klasifikasiStats,
                trendBulanan: result.trendBulanan
            }
        });
    }
    catch (err) {
        console.error('Error in getStatistikTemuan:', err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: err.message
        });
    }
};
exports.getStatistikTemuan = getStatistikTemuan;
// ===== UPDATE STATUS PENYELESAIAN =====
const updateStatusPenyelesaian = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, tanggalPenyelesaian, catatanPenyelesaian } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                error: 'Temuan ID tidak valid'
            });
            return;
        }
        const updateData = {
            Status_Penyelesaian: status
        };
        if (status === 'Closed') {
            updateData.Tanggal_Penyelesaian = tanggalPenyelesaian || new Date();
        }
        if (catatanPenyelesaian) {
            updateData.Catatan_Penyelesaian = catatanPenyelesaian;
        }
        const temuan = await Temuan_1.default.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).populate({
            path: 'ID_Kriteria',
            select: 'Kode Deskripsi Kategori Referensi Tingkat'
        });
        if (!temuan) {
            res.status(404).json({
                success: false,
                error: 'Temuan tidak ditemukan'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Status penyelesaian berhasil diupdate',
            data: temuan
        });
    }
    catch (err) {
        console.error('Error in updateStatusPenyelesaian:', err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: err.message
        });
    }
};
exports.updateStatusPenyelesaian = updateStatusPenyelesaian;
const bulkUpdateTemuan = async (req, res) => {
    try {
        const { temuanIds, updateData } = req.body;
        if (!Array.isArray(temuanIds) || temuanIds.length === 0) {
            res.status(400).json({
                success: false,
                error: 'temuanIds harus berupa array yang tidak kosong'
            });
            return;
        }
        // Validasi semua ObjectId
        for (const id of temuanIds) {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                res.status(400).json({
                    success: false,
                    error: `Invalid ObjectId: ${id}`
                });
                return;
            }
        }
        const result = await Temuan_1.default.updateMany({ _id: { $in: temuanIds } }, { $set: updateData }, { runValidators: true });
        res.json({
            success: true,
            message: `${result.modifiedCount} temuan berhasil diupdate`,
            data: {
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount
            }
        });
    }
    catch (err) {
        console.error('Error in bulkUpdateTemuan:', err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: err.message
        });
    }
};
exports.bulkUpdateTemuan = bulkUpdateTemuan;
function addDaysToDate(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
}
