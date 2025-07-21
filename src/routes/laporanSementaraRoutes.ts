import { Router } from "express";
import { createLaporanSementara, getLaporanSementara,syncTemuanLaporan, getLaporanSementaraByAudit, simpanLaporanSementara } from "../controllers/laporanSementaraController";

const router = Router();

router.post('/', simpanLaporanSementara);
router.put('/', simpanLaporanSementara); // Jika ingin support update via PUT
router.get('/by-audit/:auditId', getLaporanSementaraByAudit);
router.get("/", getLaporanSementara);
router.patch('/:id/sync-temuan', syncTemuanLaporan);

export default router;
