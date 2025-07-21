"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateKriteria = exports.deleteKriteria = exports.getKriteria = exports.createKriteria = void 0;
const Kriteria_1 = __importDefault(require("../models/Kriteria"));
const createKriteria = async (req, res) => {
    try {
        const kriteria = new Kriteria_1.default(req.body);
        await kriteria.save();
        res.status(201).json(kriteria);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.createKriteria = createKriteria;
const getKriteria = async (req, res) => {
    try {
        const kriteria = await Kriteria_1.default.find();
        res.json(kriteria);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.getKriteria = getKriteria;
const deleteKriteria = async (req, res) => {
    try {
        const kriteria = await Kriteria_1.default.findByIdAndDelete(req.params.id);
        if (!kriteria) {
            return res.status(404).json({ error: "Kriteria tidak ditemukan" });
        }
        res.json({ message: "Kriteria berhasil dihapus" });
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.deleteKriteria = deleteKriteria;
const updateKriteria = async (req, res) => {
    try {
        const kriteria = await Kriteria_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!kriteria) {
            return res.status(404).json({ error: "Kriteria tidak ditemukan" });
        }
        res.json(kriteria);
    }
    catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};
exports.updateKriteria = updateKriteria;
