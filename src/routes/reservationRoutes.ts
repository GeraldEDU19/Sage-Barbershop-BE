import { Router } from "express";
import * as reservationController from "../controllers/reservationController";
import multer from "multer";

const router = Router();

router.get("/", reservationController.get);
router.post("/", multer().any(), reservationController.create);
router.put("/", multer().any(), reservationController.update);
router.get("/getByManager", reservationController.getByManager);
router.get("/getById", reservationController.getById);
router.get("/getByDateRange", reservationController.getByDateRange);
router.get("/getByClient", reservationController.getByClient);
router.get("/getTodayCountByBranch", reservationController.getTodayCountByBranch);
router.get("/getCountByStatus", reservationController.getCountByStatus);
router.get("/getByBranch", reservationController.getByBranchId);

export default router;
