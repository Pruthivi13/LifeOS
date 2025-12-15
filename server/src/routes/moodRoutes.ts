import express from 'express';
import { getMoods, logMood } from '../controllers/moodController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/')
    .get(protect, getMoods)
    .post(protect, logMood);

export default router;
