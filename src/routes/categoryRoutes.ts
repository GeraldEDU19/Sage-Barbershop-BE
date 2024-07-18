import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';

const router = Router();

router.get('/', categoryController.get);
router.post('/', categoryController.create);
router.get('/:id', categoryController.getById);
router.put('/:id', categoryController.update);

export default router;
