import { Router } from 'express';
import * as branchController from '../controllers/branchController';
import multer from 'multer';

const router = Router();

router.get('/', branchController.get);
router.post('/', multer().any(), branchController.create);
router.put('/', multer().any(), branchController.update);
router.get('/getById', branchController.getById);


export default router;
