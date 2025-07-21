"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTindakLanjut = exports.createTindakLanjut = void 0;
const TindakLanjut_1 = __importDefault(require("../models/TindakLanjut"));
const createTindakLanjut = async (req, res) => {
    try {
        const tindak = new TindakLanjut_1.default(req.body);
        await tindak.save();
        res.status(201).json(tindak);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.createTindakLanjut = createTindakLanjut;
const getTindakLanjut = async (req, res) => {
    try {
        const tindak = await TindakLanjut_1.default.find();
        res.json(tindak);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.getTindakLanjut = getTindakLanjut;
