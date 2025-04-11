import express from 'express';
import RankController from '../controllers/RankController.mjs';

const router = express.Router();

router.post('/createRank', RankController.create);
router.get('/getAllRank', RankController.findAll);
router.get('/getRankById:id', RankController.findById);
router.put('/updateRank:id', RankController.update);
router.delete('/deleteRank:id', RankController.delete);

export default router;
