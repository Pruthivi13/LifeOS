import express from 'express';
import { getHabits, createHabit, toggleHabitCompletion, deleteHabit, updateHabit } from '../controllers/habitController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/')
    .get(protect, getHabits)
    .post(protect, createHabit);

router.route('/:id')
    .put(protect, updateHabit)
    .delete(protect, deleteHabit);

router.put('/:id/complete', protect, toggleHabitCompletion);

export default router;
