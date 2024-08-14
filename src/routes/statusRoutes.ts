import { Router } from "express";
import * as statusController from "../controllers/statusController";

const router = Router();

router.get("/", statusController.get);
router.post("/", statusController.create);
router.put("/", statusController.update);
router.get("/getById", statusController.getById);

export default router;
