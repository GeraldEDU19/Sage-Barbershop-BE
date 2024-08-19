import { Router } from "express";
import * as userController from "../controllers/userController";
import multer from "multer";

const router = Router();

router.get("/", userController.get);
router.post("/", multer().any(), userController.create);
router.put("/", multer().any(), userController.update);
router.get("/employees", userController.getEmployees);
router.get("/getById", userController.getById);
router.get("/employeeswithoutbranch", userController.getEmployeesWithoutBranch);

export default router;
