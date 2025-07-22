"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const TemuanSchema = new mongoose_1.Schema({
    ID_Audit: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Prequalification',
        required: [true, 'ID Audit wajib diisi'],
        index: true
    },
    ID_Kriteria: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Kriteria',
        required: [true, 'ID Kriteria wajib diisi'],
        index: true
    },
    Deskripsi: {
        type: String,
        default: '',
        maxlength: [1000, 'Deskripsi maksimal 1000 karakter'],
        trim: true
    },
    Root_Cause: {
        type: String,
        default: '',
        maxlength: [1000, 'Root Cause maksimal 1000 karakter'],
        trim: true
    },
    Rekomendasi: {
        type: String,
        default: '',
        maxlength: [1000, 'Rekomendasi maksimal 1000 karakter'],
        trim: true
    },
    Tanggal_Temuan: {
        type: String, // Format: 'YYYY-MM-DD'
        default: () => new Date().toISOString().slice(0, 10)
    },
    Bukti: {
        type: String,
        default: '' // Path ke file bukti
    },
    Tindak_Lanjut: {
        type: String,
        default: '',
        maxlength: [1000, 'Tindak Lanjut maksimal 1000 karakter'],
        trim: true
    },
    Status_TL: {
        type: String,
        enum: {
            values: ['Diterima', 'Perlu Revisi', 'Ditolak'],
            message: 'Status TL harus salah satu dari: Diterima, Perlu Revisi, Ditolak'
        },
        required: [true, 'Status TL wajib diisi']
    },
    Klasifikasi_Temuan: {
        type: String,
        enum: {
            values: ['Major', 'Minor', 'Observasi'],
            message: 'Klasifikasi Temuan harus salah satu dari: Major, Minor, Observasi'
        },
        required: function () {
            return this.Status_TL !== 'Diterima';
        }
    },
    Auditor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    Status_Penyelesaian: {
        type: String,
        enum: {
            values: ['Open', 'In Progress', 'Closed'],
            message: 'Status Penyelesaian harus salah satu dari: Open, In Progress, Closed'
        },
        default: 'Open'
    },
    Target_Penyelesaian: {
        type: Date,
        required: false
    },
    Tanggal_Penyelesaian: {
        type: String, // Format: 'YYYY-MM-DD'
        default: () => new Date().toISOString().slice(0, 10)
    },
    Catatan_Penyelesaian: {
        type: String,
        maxlength: [1000, 'Catatan Penyelesaian maksimal 1000 karakter'],
        trim: true,
        default: ''
    }
}, {
    timestamps: true // Menambahkan createdAt dan updatedAt
});
// Compound index untuk optimasi query
TemuanSchema.index({ ID_Audit: 1, ID_Kriteria: 1 }, { unique: true });
TemuanSchema.index({ Status_TL: 1 });
TemuanSchema.index({ Klasifikasi_Temuan: 1 });
TemuanSchema.index({ Status_Penyelesaian: 1 });
TemuanSchema.index({ Tanggal_Temuan: -1 });
// Middleware untuk validasi sebelum save
TemuanSchema.pre('save', function (next) {
    // Jika status bukan "Diterima", maka Klasifikasi_Temuan wajib diisi
    if (this.Status_TL !== 'Diterima' && !this.Klasifikasi_Temuan) {
        const error = new Error('Klasifikasi Temuan wajib diisi jika status bukan "Diterima"');
        return next(error);
    }
    // Jika status "Diterima", hapus klasifikasi temuan
    if (this.Status_TL === 'Diterima') {
        this.Klasifikasi_Temuan = undefined;
    }
    next();
});
// Virtual untuk menghitung umur temuan
TemuanSchema.virtual('umurTemuan').get(function () {
    const tanggalTemuan = new Date(this.Tanggal_Temuan);
    const sekarang = new Date();
    const diffTime = Math.abs(sekarang.getTime() - tanggalTemuan.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});
// Method untuk menghitung prioritas
TemuanSchema.methods.getPrioritas = function () {
    if (this.Klasifikasi_Temuan === 'Major')
        return 'High';
    if (this.Klasifikasi_Temuan === 'Minor')
        return 'Medium';
    if (this.Klasifikasi_Temuan === 'Observasi')
        return 'Low';
    return 'Normal';
};
// Static method untuk statistik
TemuanSchema.statics.getStatistikByAudit = function (auditId) {
    return this.aggregate([
        { $match: { ID_Audit: new mongoose_1.default.Types.ObjectId(auditId) } },
        {
            $group: {
                _id: '$Status_TL',
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$count' },
                breakdown: {
                    $push: {
                        status: '$_id',
                        count: '$count'
                    }
                }
            }
        }
    ]);
};
exports.default = mongoose_1.default.model('Temuan', TemuanSchema);
