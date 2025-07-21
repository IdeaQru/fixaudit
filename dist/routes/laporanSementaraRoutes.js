"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const laporanSementaraController_1 = require("../controllers/laporanSementaraController");
const router = (0, express_1.Router)();
router.post('/', laporanSementaraController_1.simpanLaporanSementara);
router.put('/', laporanSementaraController_1.simpanLaporanSementara); // Jika ingin support update via PUT
router.get('/by-audit/:auditId', laporanSementaraController_1.getLaporanSementaraByAudit);
router.get("/", laporanSementaraController_1.getLaporanSementara);
router.patch('/:id/sync-temuan', laporanSementaraController_1.syncTemuanLaporan);
exports.default = router;
