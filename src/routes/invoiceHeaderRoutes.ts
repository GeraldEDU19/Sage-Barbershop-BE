import { Router } from "express";
import * as invoiceHeaderController from "../controllers/invoiceHeaderController";
import multer from "multer";

const router = Router();

router.put(
  "/status",
  multer().any(),
  invoiceHeaderController.updateStatusToTrue
);
router.get("/", invoiceHeaderController.get);
router.get("/getTopProducts", invoiceHeaderController.getTopProducts);
router.get("/getTopServices", invoiceHeaderController.getTopServices);
router.post("/", multer().any(), invoiceHeaderController.create);
router.get("/:id", invoiceHeaderController.getById);
router.put("/", multer().any(), invoiceHeaderController.update);
router.post("/detail", invoiceHeaderController.createDetail);
router.put("/detail/:id", invoiceHeaderController.updateDetail);

export default router;
