"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.changePassword = exports.getAllUsers = exports.deleteUser = exports.editUser = exports.createUser = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }
        const existingUser = await User_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }
        const user = await User_1.default.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password is incorrect" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const createUser = async (req, res, next) => {
    try {
        const { username, password, email, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ error: "Username, password, and role are required" });
        }
        const existing = await User_1.default.findOne({ username });
        if (existing) {
            return res.status(400).json({ error: "Username already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({
            username,
            password: hashedPassword,
            email,
            role
        });
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    }
    catch (err) {
        next(err);
    }
};
exports.createUser = createUser;
const editUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, email, role, password } = req.body;
        // Siapkan data yang akan diupdate
        const updateData = { username, email, role };
        if (password) {
            updateData.password = await bcryptjs_1.default.hash(password, 10);
        }
        const user = await User_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User updated", user });
    }
    catch (err) {
        next(err);
    }
};
exports.editUser = editUser;
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted" });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteUser = deleteUser;
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User_1.default.find({}, "-password"); // Jangan tampilkan password
        res.json(users);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllUsers = getAllUsers;
const changePassword = async (req, res, next) => {
    try {
        const userId = req.user.id; // dari JWT
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Old and new password are required" });
        }
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const isMatch = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatch)
            return res.status(401).json({ error: "Old password is incorrect" });
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password changed successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.changePassword = changePassword;
const resetPassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ error: "New password is required" });
        }
        const user = await User_1.default.findById(id);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password reset successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.resetPassword = resetPassword;
