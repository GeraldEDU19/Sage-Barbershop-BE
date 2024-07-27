import { Router } from 'express';
import * as serviceController from '../controllers/serviceController';
import multer from 'multer';

const router = Router();

router.get('/', serviceController.get);
router.post('/', multer().single('file'), serviceController.create);
router.put('/', multer().single('file'), serviceController.update);
router.get('/getById', serviceController.getById);


export default router;
