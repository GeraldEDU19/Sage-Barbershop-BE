import { Router } from "express";
import * as reservationController from "../controllers/reservationController";

const router = Router();

router.get("/", reservationController.get);
router.post("/", reservationController.create);
router.get("/manager/:id", reservationController.getByManager);
router.get("/:id", reservationController.getById);
router.put("/:id", reservationController.update);

export default router;
