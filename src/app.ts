import express from "express";
import dotenv from "dotenv";
import connectDB from "./database";
import perusahaanRoutes from "./routes/perusahaanRoutes";
import auditorRoutes from "./routes/auditorRoutes";
import auditeeRoutes from "./routes/auditeeRoutes";
import laporanSementaraRoutes from "./routes/laporanSementaraRoutes";
import kriteriaRoutes from "./routes/kriteriaRoutes";
import temuanRoutes from "./routes/temuanRoutes";
import ncrFormRoutes from "./routes/ncrFormRouutes";
import authRoutes from "./routes/authRoutes";
import { authMiddleware } from "./middleware/authMiddleware";
import cors from 'cors';
import prequalifikasiRoutes from "./routes/prequalifikasiRoutes";
import multer from 'multer';
import path from "path";

dotenv.config();
const app = express();

// Middleware dasar
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// ========== SERVE STATIC FILES ANGULAR (PENTING: SEBELUM AUTH MIDDLEWARE) ==========
// Serve static files dari folder dist/myapp
app.use(express.static(path.join(__dirname, '..', 'dist', 'myapp')));

// ========== API ROUTES YANG TIDAK PERLU AUTH ==========
app.use("/api/auth", authRoutes);

// Route upload file
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ filePath: req.file.path, fileName: req.file.filename });
});

// Route untuk akses file uploads
app.get('/api/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
  res.sendFile(filePath);
});

// Static route untuk uploads
app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ========== AUTH MIDDLEWARE (HANYA UNTUK API ROUTES) ==========
// Middleware auth hanya untuk routes yang dimulai dengan /api (kecuali yang sudah didefinisikan di atas)
app.use('/api', authMiddleware);

// ========== PROTECTED API ROUTES ==========
app.use("/api/perusahaan", perusahaanRoutes);
app.use("/api/auditor", auditorRoutes);
app.use("/api/auditee", auditeeRoutes);
app.use("/api/laporan-sementara", laporanSementaraRoutes);
app.use("/api/kriteria", kriteriaRoutes);
app.use("/api/temuan", temuanRoutes);
app.use("/api/ncr", ncrFormRoutes);
app.use("/api/prequalification", prequalifikasiRoutes);

// ========== CATCH-ALL HANDLER (PENTING: HARUS DI AKHIR) ==========
// Untuk Angular routing - redirect semua non-API routes ke index.html
app.get('/demn', (req, res) => {
  // Jangan redirect jika request adalah untuk API
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Redirect ke index.html untuk Angular routing
  res.sendFile(path.join(__dirname, '..', 'dist', 'myapp', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Angular app available at: http://localhost:${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api`);
});
