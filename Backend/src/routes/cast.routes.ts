import express from 'express';
import { castController } from '../controller/cast.controller';

const router = express.Router();

router.get("/", castController.getCasts);

router.get("/:id", castController.getCastById);

router.post("/", castController.createCast);

router.put("/:id", castController.updateCast);

router.delete("/:id", castController.deleteCast);

export default router;