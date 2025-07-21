import { Router } from "express";
import { register, login, createUser, deleteUser, editUser, getAllUsers, changePassword, resetPassword } from "../controllers/authController";
import { adminOnly, authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/user', authMiddleware, adminOnly, createUser);      // CREATE user (oleh admin)
router.put('/user/:id', authMiddleware, adminOnly, editUser);     // UPDATE user (oleh admin)
router.delete('/user/:id', authMiddleware, adminOnly, deleteUser);// DELETE user (oleh admin)
router.get('/user', authMiddleware, adminOnly, getAllUsers);
// Hanya user yang sudah login (bisa untuk semua role)
router.put('/change-password', authMiddleware, changePassword);
// Hanya admin yang bisa reset password user lain
router.put('/user/:id/reset-password', authMiddleware, adminOnly, resetPassword);

export default router;
