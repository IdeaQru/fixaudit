"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./database"));
const perusahaanRoutes_1 = __importDefault(require("./routes/perusahaanRoutes"));
const auditorRoutes_1 = __importDefault(require("./routes/auditorRoutes"));
const auditeeRoutes_1 = __importDefault(require("./routes/auditeeRoutes"));
const laporanSementaraRoutes_1 = __importDefault(require("./routes/laporanSementaraRoutes"));
const kriteriaRoutes_1 = __importDefault(require("./routes/kriteriaRoutes"));
const temuanRoutes_1 = __importDefault(require("./routes/temuanRoutes"));
const ncrFormRouutes_1 = __importDefault(require("./routes/ncrFormRouutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const cors_1 = __importDefault(require("cors"));
const prequalifikasiRoutes_1 = __importDefault(require("./routes/prequalifikasiRoutes"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware dasar
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Connect to database
(0, database_1.default)();
// Konfigurasi multer untuk upload file
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// ========== SERVE STATIC FILES ANGULAR (PENTING: SEBELUM AUTH MIDDLEWARE) ==========
// Serve static files dari folder dist/myapp
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'dist', 'myapp')));
// ========== API ROUTES YANG TIDAK PERLU AUTH ==========
app.use("/api/auth", authRoutes_1.default);
// Route upload file
app.post('/api/upload', upload.single('file'), (req, res) => {
    res.json({ filePath: req.file.path, fileName: req.file.filename });
});
// Route untuk akses file uploads
app.get('/api/uploads/:filename', (req, res) => {
    const filePath = path_1.default.join(__dirname, '..', 'uploads', req.params.filename);
    res.sendFile(filePath);
});
// Static route untuk uploads
app.use('/api/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
// ========== AUTH MIDDLEWARE (HANYA UNTUK API ROUTES) ==========
// Middleware auth hanya untuk routes yang dimulai dengan /api (kecuali yang sudah didefinisikan di atas)
app.use('/api', authMiddleware_1.authMiddleware);
// ========== PROTECTED API ROUTES ==========
app.use("/api/perusahaan", perusahaanRoutes_1.default);
app.use("/api/auditor", auditorRoutes_1.default);
app.use("/api/auditee", auditeeRoutes_1.default);
app.use("/api/laporan-sementara", laporanSementaraRoutes_1.default);
app.use("/api/kriteria", kriteriaRoutes_1.default);
app.use("/api/temuan", temuanRoutes_1.default);
app.use("/api/ncr", ncrFormRouutes_1.default);
app.use("/api/prequalification", prequalifikasiRoutes_1.default);
// ========== CATCH-ALL HANDLER (PENTING: HARUS DI AKHIR) ==========
// Untuk Angular routing - redirect semua non-API routes ke index.html
app.get('/demn', (req, res) => {
    // Jangan redirect jika request adalah untuk API
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    // Redirect ke index.html untuk Angular routing
    res.sendFile(path_1.default.join(__dirname, '..', 'dist', 'myapp', 'index.html'));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Angular app available at: http://localhost:${PORT}`);
    console.log(`API available at: http://localhost:${PORT}/api`);
});
