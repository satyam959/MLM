import express from 'express';
import IncomeLevelController from '../controllers/IncomeLevelController.mjs';

const router = express.Router();

// ✅ DO NOT use parentheses after controller methods
router.get('/all', IncomeLevelController.getAllIncome);
router.get('/:id', IncomeLevelController.getById);
router.post('/createIncomeLevel', IncomeLevelController.create);
router.put('/update/:incomeId', IncomeLevelController.update);
router.delete('/delete/:id', IncomeLevelController.delete);

export default router;
