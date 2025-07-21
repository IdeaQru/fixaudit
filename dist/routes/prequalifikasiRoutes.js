"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/prequalification.routes.js
const express_1 = __importDefault(require("express"));
const prequalifikasiController_1 = require("../controllers/prequalifikasiController");
const router = express_1.default.Router();
router.post('/', prequalifikasiController_1.createPrequalification); // Create
router.get('/', prequalifikasiController_1.getAllPrequalification); // Get all
router.get('/by-perusahaan', prequalifikasiController_1.getPrequalificationByPerusahaan);
router.get('/by-auditee', prequalifikasiController_1.getPrequalificationByAuditee);
router.get('/:id', prequalifikasiController_1.getPrequalificationById); // Get by ID
router.put('/:id', prequalifikasiController_1.updatePrequalification); // Update by ID
router.delete('/:id', prequalifikasiController_1.deletePrequalification); // Delete by ID
exports.default = router;
