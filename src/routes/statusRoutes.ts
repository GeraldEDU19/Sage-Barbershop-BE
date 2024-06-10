import { Router } from 'express';
import * as statusController from '../controllers/statusController';

const router = Router();

router.get('/', statusController.get);
router.post('/', statusController.create);
router.get('/:id', statusController.getById);
router.post('/update', statusController.update);

export default router;
