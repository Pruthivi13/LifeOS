import { Response } from 'express';
import Mood from '../models/Mood';

// @desc    Get mood history
// @route   GET /api/moods
// @access  Private
export const getMoods = async (req: any, res: Response) => {
    try {
        const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 });
        res.json(moods);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Log mood entry
// @route   POST /api/moods
// @access  Private
export const logMood = async (req: any, res: Response) => {
    try {
        const { mood, note, date } = req.body;

        if (!mood) {
            res.status(400).json({ message: 'Mood score is required' });
            return;
        }

        const newMood = await Mood.create({
            user: req.user.id,
            mood,
            note,
            date: date || new Date()
        });

        res.status(201).json(newMood);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
