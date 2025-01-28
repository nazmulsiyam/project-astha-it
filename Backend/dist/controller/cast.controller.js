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
exports.castController = void 0;
const religion_model_1 = require("../models/religion.model");
const cast_model_1 = require("../models/cast.model");
// Create a new Cast
const createCast = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, religionId } = req.body;
        // Validate that the religionId exists in the Religion collection
        const religion = yield religion_model_1.Religion.findById(religionId);
        if (!religion) {
            res.status(404).json({ message: 'Religion not found' });
            return;
        }
        const cast = new cast_model_1.Cast({ name, description, religionId });
        const newCast = yield cast.save();
        res.status(201).json({ message: 'Cast created successfully', data: newCast });
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating cast', error: err.message });
    }
});
// Get all Casts
const getCasts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const casts = yield cast_model_1.Cast.find().populate('religionId', 'name description'); // Populate religion details
        res.status(200).json(casts);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching casts', error: err.message });
    }
});
// Get Cast by ID
const getCastById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cast = yield cast_model_1.Cast.findById(req.params.id).populate('religionId', 'name description');
        if (!cast) {
            res.status(404).json({ message: 'Cast not found' });
            return;
        }
        res.status(200).json(cast);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching cast', error: err.message });
    }
});
// Get all Casts under a specific Religion
const getCastsByReligionId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: religionId } = req.params;
        // Check if the religion exists
        const religion = yield religion_model_1.Religion.findById(religionId);
        if (!religion) {
            res.status(404).json({ message: 'Religion not found' });
            return;
        }
        // Fetch casts related to the religionId
        const casts = yield cast_model_1.Cast.find({ religionId }).populate('religionId', 'name description');
        res.status(200).json({ message: 'Casts fetched successfully', data: casts });
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching casts', error: err.message });
    }
});
// Update a Cast
const updateCast = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { religionId } = req.body;
        // If religionId is provided, validate it
        if (religionId) {
            const religion = yield religion_model_1.Religion.findById(religionId);
            if (!religion) {
                res.status(404).json({ message: 'Religion not found' });
                return;
            }
        }
        const cast = yield cast_model_1.Cast.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!cast) {
            res.status(404).json({ message: 'Cast not found' });
            return;
        }
        res.status(200).json({ message: 'Cast updated successfully', data: cast });
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating cast', error: err.message });
    }
});
// Delete a Cast
const deleteCast = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cast = yield cast_model_1.Cast.findByIdAndDelete(req.params.id);
        if (!cast) {
            res.status(404).json({ message: 'Cast not found' });
            return;
        }
        res.status(200).json({ message: 'Cast deleted successfully', data: cast });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting cast', error: err.message });
    }
});
exports.castController = {
    createCast,
    getCasts,
    getCastById,
    updateCast,
    deleteCast,
    getCastsByReligionId
};
