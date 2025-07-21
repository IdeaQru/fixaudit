import { Request, Response } from "express";
import Temuan from "../models/Temuan";

export const createTemuan = async (req: Request, res: Response) => {
  try {
    const { ID_Audit, ID_Kriteria, Deskripsi, Tanggal_Temuan, Bukti, Tindak_Lanjut, Status_TL,
Klasifikasi_Temuan } = req.body;

    // Cari Temuan dengan ID_Audit & ID_Kriteria yang sama
    const updatedTemuan = await Temuan.findOneAndUpdate(
      { ID_Audit, ID_Kriteria },
      {
        $set: {
          Deskripsi,
          Tanggal_Temuan,
          Bukti,
          Tindak_Lanjut,
          Status_TL,
          Klasifikasi_Temuan
        }
      },
      { new: true, upsert: true } // upsert: true = create jika tidak ada
    );

    res.status(200).json(updatedTemuan);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

export const getTemuan = async (req: Request, res: Response) => {
  try {
    const temuan = await Temuan.find();
    res.json(temuan);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
// controllers/temuanController.ts
export const getTemuanByAudit = async (req: Request, res: Response) => {
  try {
    const { auditId } = req.params;
    
    const temuan = await Temuan.find({ ID_Audit: auditId })
      .populate({
        path: 'ID_Kriteria',
        select: 'Kode Deskripsi Kategori Referensi Tingkat'
      })
      .sort({ Tanggal_Temuan: -1 });
    
    res.json(temuan);
  } catch (err: any) {
    res.status(500).json({ error: err.message || err });
  }
};
