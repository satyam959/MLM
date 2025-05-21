import express from "express";

import providerService from "../../../thirdPartyAPI/ThirdPartyService.mjs";
//import verifyToken from '../../middelware/authMiddleware.mjs'


const router = express.Router();

router.get('/allProviderList', providerService.getProvider);
router.post('/providerValidation', providerService.providerValidation);


export default router;
