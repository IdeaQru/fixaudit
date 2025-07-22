import { Request, Response } from "express";
import Temuan, { ITemuan } from "../models/Temuan";
import mongoose from "mongoose";

// Types untuk request
interface CreateTemuanRequest extends Request {
  body: {
    _id?: string;
    ID_Audit: string;
    ID_Kriteria: string;
    Deskripsi?: string;
    Root_Cause?: string;
    Rekomendasi?: string;
    Tanggal_Temuan?: string;
    Bukti?: string;
    Tindak_Lanjut?: string;
    Status_TL: 'Diterima' | 'Perlu Revisi' | 'Ditolak';
    Klasifikasi_Temuan?: 'Major' | 'Minor' | 'Observasi';
    Auditor?: string;
    Target_Penyelesaian?: string;
    Catatan_Penyelesaian?: string;
  };
}

interface GetTemuanQuery {
  page?: string;
  limit?: string;
  status?: string;
  klasifikasi?: string;
  auditor?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

// ===== CREATE/UPDATE TEMUAN =====
export const createTemuan = async (req: CreateTemuanRequest, res: Response): Promise<void> => {
  try {
    const {
      _id,
      ID_Audit,
      ID_Kriteria,
      Deskripsi,
      Root_Cause,
      Rekomendasi,
      Tanggal_Temuan,
      Bukti,
      Tindak_Lanjut,
      Status_TL,
      Klasifikasi_Temuan,
      Auditor,
      Target_Penyelesaian,
      Catatan_Penyelesaian
    } = req.body;


    // Validasi required fields
    if (!ID_Audit || !ID_Kriteria || !Status_TL) {
      res.status(400).json({
        success: false,
        error: 'ID_Audit, ID_Kriteria, dan Status_TL wajib diisi'
      });
      return;
    }

    // Validasi ObjectId
    if (!mongoose.Types.ObjectId.isValid(ID_Audit) || !mongoose.Types.ObjectId.isValid(ID_Kriteria)) {
      res.status(400).json({
        success: false,
        error: 'ID_Audit dan ID_Kriteria harus berupa ObjectId yang valid'
      });
      return;
    }

    // Data yang akan disimpan
    const temuanData: Partial<ITemuan> = {
      ID_Audit: new mongoose.Types.ObjectId(ID_Audit),
      ID_Kriteria: new mongoose.Types.ObjectId(ID_Kriteria),
      Deskripsi: Deskripsi || '',
      Root_Cause: Root_Cause || '',
      Rekomendasi: Rekomendasi || '',
      Tanggal_Temuan: Tanggal_Temuan || new Date().toISOString().slice(0, 10) ,
      Bukti: Bukti || '',
      Tindak_Lanjut: Tindak_Lanjut || '',
      Status_TL,
      Klasifikasi_Temuan: Status_TL !== 'Diterima' ? Klasifikasi_Temuan : undefined,
      Auditor: Auditor ? new mongoose.Types.ObjectId(Auditor) : undefined,
      // Perbaikan: Gunakan Tanggal_Temuan sebagai base, bukan tanggal saat ini
    
      Tanggal_Penyelesaian: addDaysToDate(Tanggal_Temuan, 7), // tetap string
      Target_Penyelesaian: Target_Penyelesaian ? new Date(Target_Penyelesaian) : undefined,
      Catatan_Penyelesaian: Catatan_Penyelesaian || ''
    };


    let temuan: ITemuan | null;

    if (_id) {
      // UPDATE - Jika ada _id, update temuan yang sudah ada
      temuan = await Temuan.findByIdAndUpdate(
        _id,
        { $set: temuanData },
        {
          new: true,
          runValidators: true,
          populate: {
            path: 'ID_Kriteria',
            select: 'Kode Deskripsi Kategori Referensi Tingkat'
          }
        }
      );

      if (!temuan) {
        res.status(404).json({
          success: false,
          error: 'Temuan dengan ID tersebut tidak ditemukan'
        });
        return;
      }
    } else {
      // CREATE/UPDATE - Gunakan upsert berdasarkan ID_Audit dan ID_Kriteria
      temuan = await Temuan.findOneAndUpdate(
        {
          ID_Audit: temuanData.ID_Audit,
          ID_Kriteria: temuanData.ID_Kriteria
        },
        { $set: temuanData },
        {
          new: true,
          upsert: true,
          runValidators: true,
          populate: {
            path: 'ID_Kriteria',
            select: 'Kode Deskripsi Kategori Referensi Tingkat'
          }
        }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Temuan berhasil disimpan',
      data: temuan
    });

  } catch (err: any) {
    console.error('Error in createTemuan:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map((e: any) => e.message);
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

// ===== GET ALL TEMUAN =====
export const getTemuan = async (req: Request<{}, {}, {}, GetTemuanQuery>, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      klasifikasi,
      auditor,
      sortBy = 'Tanggal_Temuan',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter: any = {};
    if (status) filter.Status_TL = status;
    if (klasifikasi) filter.Klasifikasi_Temuan = klasifikasi;
    if (auditor) filter.Auditor = auditor;

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [temuan, total] = await Promise.all([
      Temuan.find(filter)
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

      Temuan.countDocuments(filter)
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

  } catch (err: any) {
    console.error('Error in getTemuan:', err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message
    });
  }
};

// ===== GET TEMUAN BY AUDIT =====
export const getTemuanByAudit = async (req: Request<{ auditId: string }>, res: Response): Promise<void> => {
  try {
    const { auditId } = req.params;

    // Validasi ObjectId
    if (!mongoose.Types.ObjectId.isValid(auditId)) {
      res.status(400).json({
        success: false,
        error: 'Audit ID tidak valid'
      });
      return;
    }

    const temuan = await Temuan.find({ ID_Audit: auditId })
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

  } catch (err: any) {
    console.error('Error in getTemuanByAudit:', err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message
    });
  }
};

// ===== GET TEMUAN BY ID =====
export const getTemuanById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Temuan ID tidak valid'
      });
      return;
    }

    const temuan = await Temuan.findById(id)
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

  } catch (err: any) {
    console.error('Error in getTemuanById:', err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message
    });
  }
};

// ===== DELETE TEMUAN =====
export const deleteTemuan = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Temuan ID tidak valid'
      });
      return;
    }

    const temuan = await Temuan.findByIdAndDelete(id);

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

  } catch (err: any) {
    console.error('Error in deleteTemuan:', err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message
    });
  }
};

// ===== GET STATISTIK TEMUAN =====
export const getStatistikTemuan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { auditId, periode } = req.query;

    let matchStage: any = {};

    if (auditId) {
      if (!mongoose.Types.ObjectId.isValid(auditId as string)) {
        res.status(400).json({
          success: false,
          error: 'Audit ID tidak valid'
        });
        return;
      }
      matchStage.ID_Audit = new mongoose.Types.ObjectId(auditId as string);
    }

    // Filter berdasarkan periode
    if (periode) {
      const today = new Date();
      let startDate: Date;

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

    const statistik = await Temuan.aggregate([
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

  } catch (err: any) {
    console.error('Error in getStatistikTemuan:', err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message
    });
  }
};

// ===== UPDATE STATUS PENYELESAIAN =====
export const updateStatusPenyelesaian = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, tanggalPenyelesaian, catatanPenyelesaian } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Temuan ID tidak valid'
      });
      return;
    }

    const updateData: any = {
      Status_Penyelesaian: status
    };

    if (status === 'Closed') {
      updateData.Tanggal_Penyelesaian = tanggalPenyelesaian || new Date();
    }

    if (catatanPenyelesaian) {
      updateData.Catatan_Penyelesaian = catatanPenyelesaian;
    }

    const temuan = await Temuan.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate({
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

  } catch (err: any) {
    console.error('Error in updateStatusPenyelesaian:', err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message
    });
  }
};

// ===== BULK OPERATIONS =====
interface BulkUpdateRequest extends Request {
  body: {
    temuanIds: string[];
    updateData: Partial<ITemuan>;
  };
}

export const bulkUpdateTemuan = async (req: BulkUpdateRequest, res: Response): Promise<void> => {
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
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: `Invalid ObjectId: ${id}`
        });
        return;
      }
    }

    const result = await Temuan.updateMany(
      { _id: { $in: temuanIds } },
      { $set: updateData },
      { runValidators: true }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} temuan berhasil diupdate`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });

  } catch (err: any) {
    console.error('Error in bulkUpdateTemuan:', err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message
    });
  }
};

function addDaysToDate(dateString: any, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

