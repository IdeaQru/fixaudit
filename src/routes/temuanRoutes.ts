import { Router } from "express";
import { 
  createTemuan, 
  getTemuan, 
  getTemuanByAudit, 
  getTemuanById,
  deleteTemuan,
  getStatistikTemuan,
  updateStatusPenyelesaian,
  bulkUpdateTemuan
} from "../controllers/temuanController";

const router = Router();

// ===== PROTECTED ROUTES =====
// Semua routes memerlukan authentication

// CREATE/UPDATE temuan - Hanya auditor dan admin
router.post("/", 
  createTemuan
);

// GET all temuan dengan pagination dan filtering
router.get("/", getTemuan);

// GET statistik temuan
router.get("/statistik", getStatistikTemuan);

// GET temuan by audit ID
router.get("/by-audit/:auditId", getTemuanByAudit);

// GET temuan by ID
router.get("/:id", getTemuanById);

// UPDATE status penyelesaian temuan - Hanya auditor dan admin
router.patch("/:id/status", 
  updateStatusPenyelesaian
);

// DELETE temuan by ID - Hanya admin
router.delete("/:id", 
  deleteTemuan
);

// BULK update temuan - Hanya admin
router.patch("/bulk-update", 
  bulkUpdateTemuan
);

export default router;
