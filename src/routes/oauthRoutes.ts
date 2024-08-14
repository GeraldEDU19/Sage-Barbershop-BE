import { Router } from "express";
import * as oauthController from "../controllers/oauthController";
import multer from "multer";

const router = Router();

router.post("/login", multer().any(), oauthController.login);
router.post("/register", multer().any(), oauthController.register);

export default router;
