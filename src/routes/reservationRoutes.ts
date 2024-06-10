import { Router } from 'express';
import * as reservationController from '../controllers/reservationController';

const router = Router();

router.get('/', reservationController.get);
router.post('/', reservationController.create);
router.get('/:id', reservationController.getById);
router.post('/update', reservationController.update);

export default router;
