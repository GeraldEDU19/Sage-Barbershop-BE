import { Router } from 'express';
import * as branchController from '../controllers/branchController';

const router = Router();

router.get('/', branchController.get);
router.post('/', branchController.create);
router.get('/:id', branchController.getById);
router.post('/update', branchController.update);

export default router;
