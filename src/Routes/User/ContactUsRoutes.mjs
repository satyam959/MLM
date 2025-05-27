import express from "express";
import ContactUsController from '../../controllers/user/ContactUsController.mjs'
import authMiddleware from '../../middelware/authMiddleware.mjs';

const router = express.Router();

router.post("/createContact", authMiddleware, ContactUsController.create);
router.get("/getByTokenContact", authMiddleware, ContactUsController.getByToken);
router.get("/getSupport", ContactUsController.getAll);
router.put("/updateByUserId", authMiddleware, ContactUsController.updateByUserId);
router.delete("/deleteByUserId", authMiddleware, ContactUsController.deleteByUserId);

export default router;
