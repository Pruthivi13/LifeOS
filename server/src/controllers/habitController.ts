import { Response } from 'express';
import Habit from '../models/Habit';

// @desc    Get all habits
// @route   GET /api/habits
// @access  Private
export const getHabits = async (req: any, res: Response) => {
    try {
        const habits = await Habit.find({ user: req.user.id });
        res.json(habits);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a habit
// @route   POST /api/habits
// @access  Private
export const createHabit = async (req: any, res: Response) => {
    try {
        const { name, frequency } = req.body;

        if (!name) {
            res.status(400).json({ message: 'Name is required' });
            return;
        }

        const habit = await Habit.create({
            user: req.user.id,
            name,
            frequency,
        });

        res.status(201).json(habit);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark habit as completed for a specific date
// @route   PUT /api/habits/:id/complete
// @access  Private
export const toggleHabitCompletion = async (req: any, res: Response) => {
    try {
        const { date } = req.body; // Expects an ISO date string
        const toggleDate = date ? new Date(date) : new Date();

        // Normalize to midnight to avoid time issues
        toggleDate.setHours(0, 0, 0, 0);

        const habit = await Habit.findById(req.params.id);

        if (!habit) {
            res.status(404).json({ message: 'Habit not found' });
            return;
        }

        if (habit.user.toString() !== req.user.id) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        // Check if date already exists in completedDates
        const dateIndex = habit.completedDates.findIndex(
            (d: Date) => new Date(d).setHours(0, 0, 0, 0) === toggleDate.getTime()
        );

        if (dateIndex > -1) {
            // Remove date (toggle off)
            habit.completedDates.splice(dateIndex, 1);

            // Simple streak logic adjustment (naive, ideally recalculate streak properly)
            if (habit.streakCount > 0) habit.streakCount--;

        } else {
            // Add date (toggle on)
            habit.completedDates.push(toggleDate);
            habit.streakCount++;
            // Note: Streak calculation should ideally verify consecutive days
        }

        await habit.save();
        res.json(habit);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = async (req: any, res: Response) => {
    try {
        const habit = await Habit.findById(req.params.id);

        if (!habit) {
            res.status(404).json({ message: 'Habit not found' });
            return;
        }

        if (habit.user.toString() !== req.user.id) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        await habit.deleteOne();
        res.json({ id: req.params.id });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
export const updateHabit = async (req: any, res: Response) => {
    try {
        const habit = await Habit.findById(req.params.id);

        if (!habit) {
            res.status(404).json({ message: 'Habit not found' });
            return;
        }

        if (habit.user.toString() !== req.user.id) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        habit.name = req.body.name || habit.name;
        habit.frequency = req.body.frequency || habit.frequency;

        const updatedHabit = await habit.save();
        res.json(updatedHabit);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
