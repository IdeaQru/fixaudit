import { Router } from "express";
import { createTemuan, getTemuan, getTemuanByAudit } from "../controllers/temuanController";

const router = Router();

router.post("/", createTemuan);
router.get("/", getTemuan);
router.get('/by-audit/:auditId', getTemuanByAudit);

export default router;
