import express from "express";

import thirdPartyService from "../../../thirdPartyAPI/ThirdPartyService.mjs";
//import verifyToken from '../../middelware/authMiddleware.mjs'
import multer from 'multer';

const router = express.Router();
const formDataWithMulter = multer();

router.get('/allProviderList', thirdPartyService.getProvider);
router.post('/providerValidation', thirdPartyService.providerValidation);
router.post('/billVerification', formDataWithMulter.none(), thirdPartyService.billVerification)

export default router;
