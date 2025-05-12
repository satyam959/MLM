import express from 'express';
import IncomeLevelController from '../controllers/IncomeLevelController.mjs';
import verifyToken from '../middelware/authMiddleware.mjs';
const router = express.Router();

// ✅ DO NOT use parentheses after controller methods
router.get('/all',verifyToken, IncomeLevelController.getAllIncome);
// s
router.post('/createIncomeLevel',verifyToken, IncomeLevelController.create);
router.put('/update/:incomeId', IncomeLevelController.update);
router.delete('/delete/:id', IncomeLevelController.delete);

export default router;
