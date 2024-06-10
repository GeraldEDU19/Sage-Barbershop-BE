import { Router } from 'express';
import * as scheduleController from '../controllers/scheduleController';

const router = Router();

router.get('/', scheduleController.get);
router.post('/', scheduleController.create);
router.get('/:id', scheduleController.getById);
router.post('/update', scheduleController.update);

export default router;
