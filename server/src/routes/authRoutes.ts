import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    forgotPassword,
    resetPassword,
    sendLoginOTP,
    verifyLoginOTP,
    sendRegisterOTP,
    verifyRegisterOTP,
    phoneLogin,
    phoneRegister,
    googleLogin
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Sanitize filename: remove spaces and special characters
        const sanitizedName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
        cb(null, `${Date.now()}-${sanitizedName}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Images only!'));
        }
    },
});

// Legacy password-based routes (keeping for backwards compatibility)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// OTP-based authentication (passwordless)
router.post('/send-login-otp', sendLoginOTP);
router.post('/verify-login-otp', verifyLoginOTP);
router.post('/send-register-otp', sendRegisterOTP);
router.post('/verify-register-otp', verifyRegisterOTP);

// Phone-based authentication (Firebase)
router.post('/phone-login', phoneLogin);
router.post('/phone-register', phoneRegister);

// Google authentication (Firebase)
router.post('/google-login', googleLogin);

// Account management
router.delete('/delete-account', protect, async (req: any, res) => {
    try {
        const User = require('../models/User').default;
        const Task = require('../models/Task').default;
        const Habit = require('../models/Habit').default;
        const Mood = require('../models/Mood').default;

        const userId = req.user.id;

        // Delete all user data
        await Promise.all([
            Task.deleteMany({ user: userId }),
            Habit.deleteMany({ user: userId }),
            Mood.deleteMany({ user: userId }),
            User.findByIdAndDelete(userId),
        ]);

        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error: any) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Failed to delete account' });
    }
});

export default router;
