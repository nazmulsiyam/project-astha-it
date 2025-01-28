"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.religionController = void 0;
const religion_model_1 = require("../models/religion.model");
const createReligion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, isActive, photo } = req.body;
        if (!name || !description || typeof isActive !== 'boolean') {
            res.status(400).json({ message: 'Invalid data. Name, description, and isActive are required.' });
            return;
        }
        const religion = new religion_model_1.Religion({ name, description, photo, isActive });
        const newReligion = yield religion.save();
        res.status(201).json({ message: 'Religion created successfully', data: newReligion });
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating religion', error: err.message });
    }
});
const getReligions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const religions = yield religion_model_1.Religion.find();
        res.status(200).json(religions);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching religions', error: err.message });
    }
});
const getReligionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const religion = yield religion_model_1.Religion.findById(req.params.id);
        if (!religion) {
            res.status(404).json({ message: 'Religion not found' });
            return;
        }
        res.status(200).json(religion);
    }
    catch (err) {
        next(err);
    }
});
const updateReligion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const religion = yield religion_model_1.Religion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!religion) {
            res.status(404).json({ message: 'Religion not found' });
            return;
        }
        res.status(200).json({ message: 'Religion updated successfully', data: religion });
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating religion', error: err.message });
    }
});
const deleteReligion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const religion = yield religion_model_1.Religion.findByIdAndDelete(req.params.id);
        if (!religion) {
            res.status(404).json({ message: 'Religion not found' });
            return;
        }
        res.status(200).json({ message: 'Religion deleted successfully', data: religion });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting religion', error: err.message });
    }
});
exports.religionController = {
    createReligion,
    getReligions,
    getReligionById,
    updateReligion,
    deleteReligion,
};
