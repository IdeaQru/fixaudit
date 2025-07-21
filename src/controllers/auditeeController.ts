import { Request, Response } from "express";
import Auditee from "../models/Auditee";
import Perusahaan from "../models/Perusahaan";

export const createAuditee = async (req: Request, res: Response) => {
  try {
    const auditee = new Auditee(req.body);
    await auditee.save();
    res.status(201).json(auditee);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


export const getAuditee = async (req:Request, res:Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    // console.log(userId);
    if (!userId) {
      return res.status(401).json({ error: "User belum login" });
    }

    // Cari perusahaan milik user ini
    const perusahaan = await Perusahaan.findOne({ UserId: userId });
    if (!perusahaan) {
      return res.status(404).json({ error: "Perusahaan tidak ditemukan untuk user ini" });
    }

    // Cari auditee berdasarkan ID_Perusahaan
    const auditee = await Auditee.find({ ID_Perusahaan: perusahaan._id })
      .populate({
        path: "ID_Perusahaan",
        select: "Nama"
      })
      .populate({
        path: "ID_Auditor",
        select: "nama Nama username"
      });

    res.json(auditee);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};
// auditee.controller.js
export const getAuditeeByPerusahaan = async (req, res) => {
  try {
    const perusahaanId = req.query.perusahaanId;
    if (!perusahaanId) {
      return res.status(400).json({ error: "Parameter perusahaanId wajib diisi" });
    }
    const auditee = await Auditee.find({ ID_Perusahaan: perusahaanId });
    if (!auditee || auditee.length === 0) {
      return res.status(404).json({ error: "Auditee tidak ditemukan" });
    }
    res.json(auditee);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

// GET /api/auditee/by-auditor/:auditorId
export const getAuditeeByAuditor = async (req: Request, res: Response) => {
  try {
    const { auditorId } = req.params;
    if (!auditorId) {
      return res.status(400).json({ error: "ID Auditor wajib diisi" });
    }

    // Cari auditee yang memiliki ID_Auditor sesuai parameter
    const auditees = await Auditee.find({ ID_Auditor: auditorId })
      .populate({
        path: "ID_Perusahaan",
        select: "Nama"
      })
      .populate({
        path: "ID_Auditor",
        select: "nama Nama username"
      });

    res.json(auditees);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

// PUT /api/auditee/:id
export const updateAuditee = async (req: Request, res: Response) => {
  try {
    const auditee = await Auditee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!auditee) {
      return res.status(404).json({ error: "Auditee tidak ditemukan" });
    }
    res.json(auditee);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};
// DELETE /api/auditee/:id
export const deleteAuditee = async (req: Request, res: Response) => {
  try {
    const auditee = await Auditee.findByIdAndDelete(req.params.id);
    if (!auditee) {
      return res.status(404).json({ error: "Auditee tidak ditemukan" });
    }
    res.json({ message: "Auditee berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};
