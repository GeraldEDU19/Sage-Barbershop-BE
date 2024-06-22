import { Router } from 'express';
import * as productController from '../controllers/productController';

const router = Router();

router.get('/', productController.get);
router.post('/', productController.create);
router.get('/:id', productController.getById);
router.put('/:id', productController.update);

export default router;
