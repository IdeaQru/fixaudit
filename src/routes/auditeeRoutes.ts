import { Router } from "express";
import { createAuditee, deleteAuditee, getAuditee, getAuditeeByAuditor, getAuditeeByPerusahaan, updateAuditee } from "../controllers/auditeeController";

const router = Router();

router.post("/", createAuditee);
router.get("/", getAuditee);
router.get('/by-auditor/:auditorId', getAuditeeByAuditor);
router.get('/by-perusahaan', getAuditeeByPerusahaan);
// auditeeRouter.ts
router.put('/:id', updateAuditee);
router.delete('/:id', deleteAuditee);

export default router;
