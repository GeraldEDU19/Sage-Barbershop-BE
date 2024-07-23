import { Router } from 'express';
import * as scheduleController from '../controllers/scheduleController';

const router = Router();

router.get('/', scheduleController.get);
router.get('/getByBranch', scheduleController.getByBranchId);
router.post('/', scheduleController.create);
router.get('/:id', scheduleController.getById);
router.put('/:id', scheduleController.update);

export default router;
