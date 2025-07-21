"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const perusahaanController_1 = require("../controllers/perusahaanController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/", perusahaanController_1.createPerusahaan);
router.get("/", authMiddleware_1.authMiddleware, perusahaanController_1.getPerusahaan);
router.get('/by-auditor/:auditorId', perusahaanController_1.getPerusahaanByAuditor);
// perusahaanRouter.ts
router.put('/:id', perusahaanController_1.updatePerusahaan);
router.delete('/:id', perusahaanController_1.deletePerusahaan);
router.get('/by-userId', perusahaanController_1.getPerusahaanByUserID);
exports.default = router;
