import { Router } from "express";
import { createKriteria, deleteKriteria, getKriteria, updateKriteria } from "../controllers/kriteriaController";

const router = Router();

router.post("/", createKriteria);
router.get("/", getKriteria);
router.delete("/:id", deleteKriteria);
router.put("/:id", updateKriteria);

export default router;
