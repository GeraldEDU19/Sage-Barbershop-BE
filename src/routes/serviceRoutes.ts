import { Router } from 'express';
import * as serviceController from '../controllers/serviceController';

const router = Router();

router.get('/', serviceController.get);
router.post('/', serviceController.create);
router.get('/:id', serviceController.getById);
router.post('/update', serviceController.update);

export default router;
