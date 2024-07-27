import { Router } from 'express';
import * as oauthController from '../controllers/oauthController';

const router = Router();

router.post('/login', oauthController.login);
router.post('/register', oauthController.register);

export default router;
