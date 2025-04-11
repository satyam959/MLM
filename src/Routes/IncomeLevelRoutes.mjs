import express from 'express';
import IncomeLevelController from '../controllers/IncomeLevelController.mjs';

const router = express.Router();

router.post('/createIncomeLevel', IncomeLevelController.create);
router.get('/incomeLevels', IncomeLevelController.getAllIncome);
router.get('/getById/:id', IncomeLevelController.getById);
router.put('/update/:id', IncomeLevelController.update);
router.delete('/delete/:id', IncomeLevelController.delete);

export default router;