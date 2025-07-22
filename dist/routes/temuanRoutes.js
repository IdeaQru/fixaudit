"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const temuanController_1 = require("../controllers/temuanController");
const router = (0, express_1.Router)();
// ===== PROTECTED ROUTES =====
// Semua routes memerlukan authentication
// CREATE/UPDATE temuan - Hanya auditor dan admin
router.post("/", temuanController_1.createTemuan);
// GET all temuan dengan pagination dan filtering
router.get("/", temuanController_1.getTemuan);
// GET statistik temuan
router.get("/statistik", temuanController_1.getStatistikTemuan);
// GET temuan by audit ID
router.get("/by-audit/:auditId", temuanController_1.getTemuanByAudit);
// GET temuan by ID
router.get("/:id", temuanController_1.getTemuanById);
// UPDATE status penyelesaian temuan - Hanya auditor dan admin
router.patch("/:id/status", temuanController_1.updateStatusPenyelesaian);
// DELETE temuan by ID - Hanya admin
router.delete("/:id", temuanController_1.deleteTemuan);
// BULK update temuan - Hanya admin
router.patch("/bulk-update", temuanController_1.bulkUpdateTemuan);
exports.default = router;
