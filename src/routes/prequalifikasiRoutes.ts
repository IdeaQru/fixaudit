// routes/prequalification.routes.js
import express from 'express';
import {
  createPrequalification,
  getAllPrequalification,
  getPrequalificationById,
  updatePrequalification,
  deletePrequalification,
  getPrequalificationByAuditee,
  getPrequalificationByPerusahaan
} from '../controllers/prequalifikasiController';

const router = express.Router();

router.post('/', createPrequalification); // Create
router.get('/', getAllPrequalification); // Get all
router.get('/by-perusahaan', getPrequalificationByPerusahaan);
router.get('/by-auditee', getPrequalificationByAuditee);
router.get('/:id', getPrequalificationById); // Get by ID
router.put('/:id', updatePrequalification); // Update by ID
router.delete('/:id', deletePrequalification); // Delete by ID
export default router;
