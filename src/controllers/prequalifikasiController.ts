// controllers/prequalification.controller.js
import Prequalification from '../models/Prequalifikasi';
import { Request, Response } from "express";
import Auditee from "../models/Auditee";
import mongoose from 'mongoose';


export const createPrequalification = async (req: Request, res: Response) => {
  try {
    const { 
      Auditee, 
      ID_Perusahaan, 
      ID_Auditor, 
      Jawaban, 
      Status, 
      Penanggung_Jawab, 
      Tanggal_Pengisian 
    } = req.body;

    // ✅ Filter berdasarkan Penanggung_Jawab (bukan kombinasi lain)
    const filter = {
      Penanggung_Jawab: new mongoose.Types.ObjectId(Penanggung_Jawab)
    };

    // Cek apakah sudah ada dokumen dengan Penanggung_Jawab yang sama
    let existingPrequal = await Prequalification.findOne(filter);

    if (!existingPrequal) {
      // CREATE - Buat dokumen baru
      const newPrequal = new Prequalification({
        Auditee,
        ID_Perusahaan,
        ID_Auditor,
        Penanggung_Jawab,
        Tanggal_Pengisian: Tanggal_Pengisian || new Date(),
        Status: Status || 'Draft',
        Jawaban: Array.isArray(Jawaban) ? Jawaban : [Jawaban]
      });
      
      const savedPrequal = await newPrequal.save();
      return res.status(201).json(savedPrequal);
    } else {
      // UPDATE/ADD - Push/update jawaban ke dokumen yang sudah ada
      const jawabanArr = Array.isArray(Jawaban) ? Jawaban : [Jawaban];
      
      for (const newJawaban of jawabanArr) {
        // Push jawaban baru ke array
        await Prequalification.updateOne(
          filter,
          { 
            $push: { Jawaban: newJawaban }
          }
        );
      }

      // Ambil data terbaru
      const updatedPrequal = await Prequalification.findOne(filter);
      return res.status(200).json(updatedPrequal);
    }

  } catch (err) {
    console.error('Error in createPrequalification:', err);
    res.status(400).json({ error: err.message || err });
  }
};


export const getPrequalificationByPerusahaan = async (req, res) => {
  try {
    const { perusahaanId } = req.query;
    const data = await Prequalification.find({ ID_Perusahaan: perusahaanId })
      .populate('Auditee')
      .populate('ID_Perusahaan')
      .populate('ID_Auditor')
      .populate('Penanggung_Jawab')
      .populate('Jawaban.Kriteria');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

// GET all prequalifications (populate jawaban.kriteria)
export const getAllPrequalification = async (req: Request, res: Response) => {
  try {
    const data = await Prequalification.find()
      .populate('Auditee')
      .populate('ID_Perusahaan')
      .populate('ID_Auditor')
      .populate('Jawaban.Kriteria');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

// GET prequalification by ID
export const getPrequalificationById = async (req: Request, res: Response) => {
  try {
    const prequal = await Prequalification.findById(req.params.id)
      .populate('Auditee')
      .populate('ID_Perusahaan')
      .populate('ID_Auditor')
      .populate('Jawaban.Kriteria');
    if (!prequal) return res.status(404).json({ error: 'Not found' });
    res.json(prequal);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};
// controllers/prequalification.controller.js


export const getPrequalificationByAuditee = async (req:Request, res:Response) => {
  try {
    const { auditeeId, perusahaanId, auditorId } = req.query;
    

    if (!auditeeId) {
      return res.status(400).json({ error: 'auditeeId is required' });
    }

    const filter = { Auditee: new mongoose.Types.ObjectId(auditeeId) };
    if (perusahaanId) filter.ID_Perusahaan = new mongoose.Types.ObjectId(perusahaanId);
    if (auditorId) filter.ID_Auditor = new mongoose.Types.ObjectId(auditorId);

    const prequal = await Prequalification.findOne(filter)
      .populate('Auditee')
      .populate('ID_Perusahaan')
      .populate('ID_Auditor')
      .populate('Jawaban.Kriteria');

    if (!prequal) return res.status(404).json({ error: 'Not found' });
    res.json(prequal);
  } catch (err:any) {
    res.status(500).json({ error: err.message || err });
  }
};


// UPDATE prequalification by ID
export const updatePrequalification = async (req: Request, res: Response) => {
  try {
    const prequal = await Prequalification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!prequal) return res.status(404).json({ error: 'Not found' });
    res.json(prequal);
  } catch (err) {
    res.status(400).json({ error: err.message || err });
  }
};

// DELETE prequalification by ID
export const deletePrequalification = async (req: Request, res: Response) => {
  try {
    const prequal = await Prequalification.findByIdAndDelete(req.params.id);
    if (!prequal) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};
