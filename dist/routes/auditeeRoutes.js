"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditeeController_1 = require("../controllers/auditeeController");
const router = (0, express_1.Router)();
router.post("/", auditeeController_1.createAuditee);
router.get("/", auditeeController_1.getAuditee);
router.get('/by-auditor/:auditorId', auditeeController_1.getAuditeeByAuditor);
router.get('/by-perusahaan', auditeeController_1.getAuditeeByPerusahaan);
// auditeeRouter.ts
router.put('/:id', auditeeController_1.updateAuditee);
router.delete('/:id', auditeeController_1.deleteAuditee);
exports.default = router;
