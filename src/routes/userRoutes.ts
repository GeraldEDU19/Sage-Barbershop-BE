import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();

router.get("/", userController.get);
router.post("/", userController.create);
router.get("/:id", userController.getById);
router.post("/update", userController.update);

export default router;
