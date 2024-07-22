import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();

router.get("/", userController.get);
router.post("/", userController.create);
router.get("/employees", userController.getEmployees);
router.get("/:id", userController.getById);
router.put("/:id", userController.update);

export default router;
