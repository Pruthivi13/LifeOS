import { Router, Request, Response } from 'express';
import { sendFeedbackEmail } from '../utils/emailService';

const router = Router();

// @desc    Send feedback email
// @route   POST /api/feedback
// @access  Public
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }

        // Send feedback email
        await sendFeedbackEmail(name, email, subject, message);

        res.json({
            success: true,
            message: 'Feedback sent successfully!'
        });
    } catch (error: any) {
        console.error('Feedback error:', error);
        res.status(500).json({
            message: 'Failed to send feedback. Please try again later.'
        });
    }
});

export default router;
