import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();

router.get("/", userController.get);
router.post("/", userController.create);
router.put("/", userController.update);
router.get("/employees", userController.getEmployees);
router.get("/getById", userController.getById);
router.get("/employeeswithoutbranch", userController.getEmployeesWithoutBranch);

export default router;
