import { Request, Response } from "express";
import NcrForm, { INcrForm } from "../models/NcrForm";

// Create NCR Form
// Fungsi untuk CREATE NCR baru
export const createNcrForm = async (req: Request, res: Response) => {
  try {
    const { Penanggung_Jawab, ID_Temuan } = req.body;
    
    // Validasi input wajib
    if (!Penanggung_Jawab || !ID_Temuan) {
      return res.status(400).json({ 
        error: 'Penanggung_Jawab dan ID_Temuan wajib diisi' 
      });
    }
    
    // Cek apakah NCR untuk kombinasi ini sudah ada
    const existingNcr = await NcrForm.findOne({ 
      Penanggung_Jawab, 
      ID_Temuan 
    });
    
    if (existingNcr) {
      return res.status(409).json({ 
        error: 'NCR untuk temuan ini sudah ada',
        existing_ncr_id: existingNcr._id
      });
    }
    
    // Buat NCR baru
    const ncrform = new NcrForm(req.body);
    await ncrform.save();
    
    console.log(`NCR created for user: ${Penanggung_Jawab}, temuan: ${ID_Temuan}`);
    return res.status(201).json({
      message: 'NCR berhasil dibuat',
      data: ncrform
    });
    
  } catch (err: any) {
    console.error('Error in createNcrForm:', err);
    
    if (err.code === 11000) {
      return res.status(409).json({ 
        error: 'NCR untuk temuan ini sudah ada' 
      });
    }
    
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map((e: any) => e.message);
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: validationErrors 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message || err 
    });
  }
};

// Fungsi untuk UPDATE NCR yang sudah ada
export const updateNcrForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // NCR ID dari URL parameter
    const updateData = req.body;
    
    // Jangan izinkan mengubah ID_Temuan dan Penanggung_Jawab
    delete updateData.ID_Temuan;
    delete updateData.Penanggung_Jawab;
    
    const updatedNcr = await NcrForm.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedNcr) {
      return res.status(404).json({ 
        error: 'NCR tidak ditemukan' 
      });
    }
    
    console.log(`NCR updated: ${id}`);
    return res.status(200).json({
      message: 'NCR berhasil diperbarui',
      data: updatedNcr
    });
    
  } catch (err: any) {
    console.error('Error in updateNcrForm:', err);
    
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map((e: any) => e.message);
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: validationErrors 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message || err 
    });
  }
};



// Get All NCR Forms
export const getNcrForms = async (req: Request, res: Response) => {
  try {
    const ncrforms = await NcrForm.find()
      .populate('Penanggung_Jawab')
      .populate('ID_Temuan');
    res.json(ncrforms);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
};

// Get NCR Form by User (Penanggung_Jawab)
export const getNcrFormByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // ✅ PERBAIKAN: Gunakan find() bukan findOne()
    const ncrforms = await NcrForm.find({ Penanggung_Jawab: userId })
      .populate('Penanggung_Jawab')
      .populate('ID_Temuan')
      .sort({ createdAt: -1 }); // Urutkan berdasarkan tanggal terbaru
    
    // Kembalikan array kosong jika tidak ada data, bukan error 404
    if (!ncrforms || ncrforms.length === 0) {
      return res.status(200).json([]); // ✅ Return array kosong
    }
    
    console.log(`Found ${ncrforms.length} NCR(s) for user: ${userId}`);
    res.status(200).json(ncrforms); // ✅ Return array
    
  } catch (err: any) {
    console.error('Error in getNcrFormByUser:', err);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message || err 
    });
  }
};

