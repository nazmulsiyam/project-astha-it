"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cast_controller_1 = require("../controller/cast.controller");
const router = express_1.default.Router();
router.get("/", cast_controller_1.castController.getCasts);
router.get("/:id", cast_controller_1.castController.getCastById);
router.get('/religion/:id', cast_controller_1.castController.getCastsByReligionId);
router.post("/", cast_controller_1.castController.createCast);
router.put("/:id", cast_controller_1.castController.updateCast);
router.delete("/:id", cast_controller_1.castController.deleteCast);
exports.default = router;
