import { Router } from 'express';
import * as invoiceHeaderController from '../controllers/invoiceHeaderController';

const router = Router();

router.get('/', invoiceHeaderController.get);
router.post('/', invoiceHeaderController.create);
router.get('/:id', invoiceHeaderController.getById);
router.post('/update', invoiceHeaderController.update);

export default router;
