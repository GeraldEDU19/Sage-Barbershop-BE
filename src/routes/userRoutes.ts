import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);

// Define otras rutas como GET /users/:id, PUT /users/:id, DELETE /users/:id

export default router;
