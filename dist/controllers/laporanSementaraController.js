"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncTemuanLaporan = exports.getLaporanSementara = exports.getLaporanSementaraByAudit = exports.simpanLaporanSementara = exports.createLaporanSementara = void 0;
const LaporanSementara_1 = __importDefault(require("../models/LaporanSementara"));
const Temuan_1 = __importDefault(require("../models/Temuan"));
const createLaporanSementara = async (req, res) => {
    try {
        const laporan = new LaporanSementara_1.default(req.body);
        await laporan.save();
        res.status(201).json(laporan);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.createLaporanSementara = createLaporanSementara;
// POST /api/laporan-sementara
const simpanLaporanSementara = async (req, res) => {
    try {
        const { Nama_Perusahaan, Lingkup_Audit, Pelaksanaan_Audit, Tujuan_Audit, ID_Audit, Auditor, Daftar_Temuan, Tingkat_Pencapaian, Ringkasan_Hasil } = req.body;
        // Pastikan Daftar_Temuan hanya array of ObjectId
        // Jika frontend kirim array of object, ambil _id-nya saja
        const daftarTemuanId = (Daftar_Temuan || []).map(t => {
            if (typeof t === 'string')
                return t;
            if (typeof t === 'object' && t !== null && t._id)
                return t._id;
            return t;
        });
        const laporan = await LaporanSementara_1.default.findOneAndUpdate({ ID_Audit }, {
            Nama_Perusahaan,
            Lingkup_Audit,
            Pelaksanaan_Audit,
            Tujuan_Audit,
            ID_Audit,
            Auditor,
            Daftar_Temuan: daftarTemuanId,
            Tingkat_Pencapaian,
            Ringkasan_Hasil
        }, { new: true, upsert: true });
        res.status(200).json(laporan);
    }
    catch (err) {
        console.error(err); // Untuk debugging error detail
        res.status(500).json({ error: err.message || err });
    }
};
exports.simpanLaporanSementara = simpanLaporanSementara;
// GET /api/laporan-sementara/by-audit/:auditId
const getLaporanSementaraByAudit = async (req, res) => {
    try {
        const auditId = req.params.auditId;
        const laporan = await LaporanSementara_1.default.findOne({ ID_Audit: auditId })
            .populate([
            // Populate daftar temuan (array of Temuan)
            {
                path: 'Daftar_Temuan',
                populate: [
                    { path: 'ID_Kriteria' }
                ]
            },
            // Populate audit utama di laporan
            {
                path: 'ID_Audit',
                populate: [
                    { path: 'ID_Perusahaan' },
                    { path: 'ID_Auditor' }
                ]
            },
            // Populate auditor utama di laporan
            { path: 'Auditor' }
        ]);
        res.json(laporan);
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.getLaporanSementaraByAudit = getLaporanSementaraByAudit;
const getLaporanSementara = async (req, res) => {
    try {
        const laporan = await LaporanSementara_1.default.find();
        res.json(laporan);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.getLaporanSementara = getLaporanSementara;
const syncTemuanLaporan = async (req, res) => {
    try {
        const { id: laporanId } = req.params;
        // 2. Cari laporan sementara yang ada
        const laporan = await LaporanSementara_1.default.findById(laporanId);
        if (!laporan) {
            return res.status(404).json({ message: 'Laporan Sementara tidak ditemukan.' });
        }
        // 3. Dapatkan ID Audit dari laporan tersebut
        const auditId = laporan.ID_Audit;
        // 4. Cari semua temuan yang AKTIF (status bukan "Diterima") untuk audit ini
        const activeTemuan = await Temuan_1.default.find({
            ID_Audit: auditId,
            Status_TL: { $ne: 'Diterima' } // $ne berarti "not equal"
        }).select('_id'); // .select('_id') hanya mengambil field _id, sangat efisien
        // 5. Ekstrak hanya ID-nya menjadi sebuah array string
        const activeTemuanIds = activeTemuan.map(t => t._id);
        // 6. Update field 'Daftar_Temuan' pada laporan dengan array ID yang baru
        laporan.Daftar_Temuan = activeTemuanIds;
        // 7. Simpan perubahan ke database
        const updatedLaporan = await laporan.save();
        // 8. Kirim kembali laporan yang sudah ter-update sebagai konfirmasi
        res.status(200).json(updatedLaporan);
    }
    catch (error) {
        console.error('Error saat sinkronisasi temuan:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};
exports.syncTemuanLaporan = syncTemuanLaporan;
