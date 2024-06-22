import { Router } from 'express';
import * as invoiceHeaderController from '../controllers/invoiceHeaderController';

const router = Router();

router.get('/', invoiceHeaderController.get);
router.post('/', invoiceHeaderController.create);
router.get('/:id', invoiceHeaderController.getById);
router.put('/:id', invoiceHeaderController.update);
router.post('/detail', invoiceHeaderController.createDetail);
router.put('/detail/:id', invoiceHeaderController.updateDetail);

export default router;
