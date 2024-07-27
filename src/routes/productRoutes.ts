import { Router } from 'express';
import * as productController from '../controllers/productController';
import multer from 'multer';

const router = Router();

router.get('/', productController.get);
router.post('/', multer().single('file'), productController.create);
router.put('/', multer().single('file'), productController.update);
router.get('/getById', productController.getById);


export default router;
