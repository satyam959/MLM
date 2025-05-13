import express from "express";
import ServiceController from "../controllers/ServicesController.mjs";
import { getUploadMiddleware } from "../middelware/UploadImage.mjs";

const router = express.Router();

// Use the same custom upload middleware for consistency
router.post(
  "/createService",
  getUploadMiddleware("serviceIcon", "service"),
  ServiceController.createService
);

router.get("/getAllServices", ServiceController.getAllServices);
router.get("/services/:id", ServiceController.getServiceById);

router.put(
  "/updateService/:serviceId",
  getUploadMiddleware("serviceIcon", "service"),
  ServiceController.updateService
);

router.delete("/deleteService/:serviceId", ServiceController.deleteService);

export default router;
