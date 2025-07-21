"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const temuanController_1 = require("../controllers/temuanController");
const router = (0, express_1.Router)();
router.post("/", temuanController_1.createTemuan);
router.get("/", temuanController_1.getTemuan);
router.get('/by-audit/:auditId', temuanController_1.getTemuanByAudit);
exports.default = router;
