"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditorController_1 = require("../controllers/auditorController");
const router = (0, express_1.Router)();
router.post("/", auditorController_1.createAuditor);
router.get("/", auditorController_1.getAuditorProfile);
router.get("/alldata", auditorController_1.getAllAuditor);
exports.default = router;
