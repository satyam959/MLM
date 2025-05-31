import express from "express";
import WalletController from "../controllers/WalletController.mjs";
import AdminAuth from "../middelware/verifyAdminRole.mjs";      // ✅ Admin role middleware

const router = express.Router();

// Public or Authenticated Routes (as needed)
router.post("/createWallet", WalletController.create);
router.get("/getAll", WalletController.getAll);
router.get("/getById/:walletId", WalletController.getById);
router.put("/update/:walletId", WalletController.update);
router.delete("/delete/:walletId", WalletController.delete);

// Admin-only route, protected by token + admin role
router.get("/adminRevenue",AdminAuth.verifyAdminRole,WalletController.getAdminRevenue);
router.get('/dailyPayout',AdminAuth.verifyAdminRole, WalletController.getDailyPayout);
router.post('/userWalletRecharge',AdminAuth.verifyAdminRole, WalletController.adminRechargeUserWallet);

export default router;
