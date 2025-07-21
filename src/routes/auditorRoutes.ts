import { Router } from "express";
import { createAuditor, getAllAuditor, getAuditorProfile } from "../controllers/auditorController";

const router = Router();

router.post("/", createAuditor);
router.get("/", getAuditorProfile);
router.get("/alldata", getAllAuditor);

export default router;
