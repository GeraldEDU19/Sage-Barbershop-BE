import { Router } from 'express';
import * as fileController from '../controllers/fileController';

const router = Router();

router.post("/upload", fileController.upload);
router.get("/files", fileController.getListFiles);
router.get("/files/:name", fileController.download);

export default router;
