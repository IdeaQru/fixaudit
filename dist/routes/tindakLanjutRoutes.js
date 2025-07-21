"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tindakLanjutController_1 = require("../controllers/tindakLanjutController");
const router = (0, express_1.Router)();
router.post("/", tindakLanjutController_1.createTindakLanjut);
router.get("/", tindakLanjutController_1.getTindakLanjut);
exports.default = router;
