import { Request, Response } from "express";
import Kriteria from "../models/Kriteria";

export const createKriteria = async (req: Request, res: Response) => {
  try {
    const kriteria = new Kriteria(req.body);
    await kriteria.save();
    res.status(201).json(kriteria);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getKriteria = async (req: Request, res: Response) => {
  try {
    const kriteria = await Kriteria.find();
    res.json(kriteria);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
export const deleteKriteria = async (req: Request, res: Response) => {
  try {
    const kriteria = await Kriteria.findByIdAndDelete(req.params.id);
    if (!kriteria) {
      return res.status(404).json({ error: "Kriteria tidak ditemukan" });
    }
    res.json({ message: "Kriteria berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

export const updateKriteria = async (req: Request, res: Response) => {
  try {
    const kriteria = await Kriteria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!kriteria) {
      return res.status(404).json({ error: "Kriteria tidak ditemukan" });
    }
    res.json(kriteria);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};