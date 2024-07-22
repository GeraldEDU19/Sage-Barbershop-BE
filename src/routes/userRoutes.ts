import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();

router.get("/", userController.get);
router.get("/employeeswithoutbranch", userController.getEmployeesWithoutBranch);
router.post("/", userController.create);
router.get("/:id", userController.getById);
router.put("/:id", userController.update);

export default router;
