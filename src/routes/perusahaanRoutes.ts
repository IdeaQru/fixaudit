import { Router } from "express";
import { createPerusahaan, deletePerusahaan, getPerusahaan, getPerusahaanByAuditor, getPerusahaanByUserID, updatePerusahaan } from "../controllers/perusahaanController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", createPerusahaan);
router.get("/", authMiddleware,getPerusahaan);
router.get('/by-auditor/:auditorId', getPerusahaanByAuditor);
// perusahaanRouter.ts
router.put('/:id', updatePerusahaan);
router.delete('/:id', deletePerusahaan);
router.get('/by-userId', getPerusahaanByUserID);
export default router;
