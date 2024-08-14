import { Router } from "express";
import * as scheduleController from "../controllers/scheduleController";
import multer from "multer";

const router = Router();

router.get("/", scheduleController.get);
router.get("/getByBranch", scheduleController.getByBranchId);
router.get("/getByBranchAndDate", scheduleController.getByBranchAndDate);
router.post("/", multer().any(), scheduleController.create);
router.put("/", multer().any(), scheduleController.update);
router.get("/getById", scheduleController.getById);

export default router;
