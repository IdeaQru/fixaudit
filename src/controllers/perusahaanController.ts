import { Request, Response } from "express";
import Perusahaan from "../models/Perusahaan";

import Auditee from '../models/Auditee';
import Auditor from "../models/Auditor";


export const getPerusahaanByAuditor = async (req: Request, res: Response) => {
  try {
    const auditorId = req.params.auditorId;
    // 1. Cari semua Auditor yang ID_Auditor = auditorId
    const auditor = await Auditor.findOne({ userId: auditorId });
    if (!auditor) {
      return res.status(404).json({ error: "Auditor tidak ditemukan untuk user ini" });
    }
    const auditorObjectId = auditor._id;
    const auditees = await Auditee.find({ ID_Auditor: auditorObjectId }).select('ID_Perusahaan');

    // 2. Ambil semua ID_Perusahaan unik
    const perusahaanIds = auditees.map(a => a.ID_Perusahaan).filter(Boolean);

    // 3. Ambil data Perusahaan yang _id-nya ada di perusahaanIds
    const perusahaan = await Perusahaan.find({ _id: { $in: perusahaanIds } });
    res.json(perusahaan);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

export const createPerusahaan = async (req: Request, res: Response) => {
  try {

    const { Nama, Alamat, Jenis_Usaha, Tanggal_Audit, UserId } = req.body;
    // console.log(req.body);
    if (!Nama) {
      return res.status(400).json({ error: "Nama perusahaan wajib diisi" });
    }
    let perusahaan = await Perusahaan.findOne({ UserId: UserId });
    if (perusahaan) {
      perusahaan.Nama = Nama;
      perusahaan.Alamat = Alamat;
      perusahaan.Jenis_Usaha = Jenis_Usaha;
      perusahaan.Tanggal_Audit = Tanggal_Audit;
      await perusahaan.save();
      return res.status(200).json(perusahaan);
    } else {
      perusahaan = new Perusahaan({
        UserId,
        Nama,
        Alamat,
        Jenis_Usaha,
        Tanggal_Audit
      });
      await perusahaan.save();
      return res.status(201).json(perusahaan);
    }
  } catch (err) {
    if (err.code === 11000) {
      // console.log(err);
      return res.status(400).json({ error: "User hanya boleh punya satu perusahaan" });

    }
    res.status(500).json({ error: err.message || err });
  }
};





export const getPerusahaan = async (req, res) => {
  try {
    // req.user diisi oleh middleware auth
    const user = req.user;
    // console.log(user);
    let perusahaan;
    if (user.role === 'auditor') {
      // Auditor: lihat semua perusahaan
      perusahaan = await Perusahaan.find();
    } else {
      // Auditee/user biasa: hanya perusahaan miliknya
      perusahaan = await Perusahaan.find({ UserId: user.id });
    }
    res.json(perusahaan);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};


// PUT /api/perusahaan/:id
export const updatePerusahaan = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil dari JWT/session (middleware auth)
    const perusahaan = await Perusahaan.findOneAndUpdate(
      { _id: req.params.id, UserId: userId }, // Pastikan hanya perusahaan milik user ini yang bisa diupdate
      req.body,
      { new: true }
    );
    if (!perusahaan) {
      return res.status(403).json({ error: "Anda tidak berhak mengedit perusahaan ini" });
    }
    res.json(perusahaan);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

// DELETE /api/perusahaan/:id// DELETE /api/perusahaan/:id
export const deletePerusahaan = async (req, res) => {
  try {
    // console.log(req.params.id);
    const perusahaan = await Perusahaan.findOneAndDelete({ _id: req.params.id }); // Pastikan hanya perusahaan milik user ini yang bisa dihapus
    if (!perusahaan) {
      return res.status(403).json({ error: "Anda tidak berhak menghapus perusahaan ini" });
    }
    res.json({ message: "Perusahaan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

// Untuk endpoint: /api/perusahaan/by-userId?userId=xxxx

export const getPerusahaanByUserID = async (req, res) => {
  try {
    const userId = req.query.userId; // Ambil dari query parameter
    if (!userId) {
      return res.status(400).json({ error: "Parameter userId wajib diisi" });
    }

    const perusahaan = await Perusahaan.findOne({ UserId: userId });
    if (!perusahaan) {
      return res.status(404).json({ error: "Perusahaan tidak ditemukan" });
    }
    res.json(perusahaan);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};
