"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/user', authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, authController_1.createUser); // CREATE user (oleh admin)
router.put('/user/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, authController_1.editUser); // UPDATE user (oleh admin)
router.delete('/user/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, authController_1.deleteUser); // DELETE user (oleh admin)
router.get('/user', authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, authController_1.getAllUsers);
// Hanya user yang sudah login (bisa untuk semua role)
router.put('/change-password', authMiddleware_1.authMiddleware, authController_1.changePassword);
// Hanya admin yang bisa reset password user lain
router.put('/user/:id/reset-password', authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, authController_1.resetPassword);
exports.default = router;
