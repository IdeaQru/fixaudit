import { Request, Response } from "express";
import Auditor from "../models/Auditor";


// Pastikan ada middleware autentikasi yang mengisi req.user
export const createAuditor = async (req: Request, res: Response) => {
  try {
    // Pastikan user sudah login dan req.user tersedia
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Cek apakah user sudah pernah submit auditor
    const existing = await Auditor.findOne({ userId });
    if (existing) {
      return res.status(409).json({ error: "Akun ini sudah pernah submit data auditor." });
    }

    // Validasi field yang wajib (misal: nama)
    if (!req.body.Nama) {
      return res.status(400).json({ error: "Nama auditor wajib diisi." });
    }

    // Buat data auditor baru
    const auditor = new Auditor({ ...req.body, userId });
    await auditor.save();

    res.status(201).json(auditor);
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};



export const getAuditorProfile = async (req, res) => {
  const userId = req.user.id;
  const auditor = await Auditor.findOne({ userId });
  if (!auditor) return res.status(404).json({ error: "Belum ada data auditor" });
  res.json(auditor);
};
export const getAllAuditor = async (req, res) => {
  const auditor = await Auditor.find();
  if (!auditor) return res.status(404).json({ error: "Belum ada data auditor" });
  res.json(auditor);
};
