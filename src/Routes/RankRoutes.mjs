import express from 'express';
import RankController from '../controllers/RankController.mjs';

const router = express.Router();

router.post('/createRank', RankController.create);
router.get('/getAllRank', RankController.findAll);
router.get('/getRankById/:rankId', RankController.findById);
router.put('/updateRank/:rankId', RankController.update);
router.delete('/deleteRank/:rankId', RankController.delete);

export default router;
