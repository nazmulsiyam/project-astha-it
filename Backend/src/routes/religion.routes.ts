import express from 'express';
import { religionController } from '../controller/religion.controller';

const router = express.Router();

router.post('/', religionController.createReligion);
router.get('/', religionController.getReligions);
router.get('/:id', religionController.getReligionById);
router.put('/:id', religionController.updateReligion);
router.delete('/:id', religionController.deleteReligion);

export default router;
