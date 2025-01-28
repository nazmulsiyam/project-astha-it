"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const religion_controller_1 = require("../controller/religion.controller");
const router = express_1.default.Router();
router.post('/', religion_controller_1.religionController.createReligion);
router.get('/', religion_controller_1.religionController.getReligions);
router.get('/:id', religion_controller_1.religionController.getReligionById);
router.put('/:id', religion_controller_1.religionController.updateReligion);
router.delete('/:id', religion_controller_1.religionController.deleteReligion);
exports.default = router;
