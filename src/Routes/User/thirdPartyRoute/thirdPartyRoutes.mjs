import express from "express";

import thirdPartyService from "../../../thirdPartyAPI/ThirdPartyService.mjs";
import verifyToken from '../../../middelware/authMiddleware.mjs'
import multer from 'multer';

const router = express.Router();
const formDataWithMulter = multer();

router.get('/allProviderList', verifyToken, thirdPartyService.getProvider);
router.post('/providerValidation', verifyToken, thirdPartyService.providerValidation);
router.post('/billVerification', verifyToken, formDataWithMulter.none(), thirdPartyService.billVerification)
router.post('/payBill', verifyToken, formDataWithMulter.none(), thirdPartyService.payBill)
export default router;
