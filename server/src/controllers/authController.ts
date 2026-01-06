import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User';
import { sendOTPEmail, sendLoginOTPEmail, sendRegistrationOTPEmail } from '../utils/emailService';
import { verifyFirebaseToken, getFirebaseUser } from '../config/firebaseAdmin';

// Generate JWT
const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: 'Please add all fields' });
            return;
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password as string))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: any, res: Response) => {
    try {
        res.json(req.user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            // Accept avatar URL directly from body (for predefined avatars)
            if (req.body.avatar !== undefined) {
                user.avatar = req.body.avatar;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                token: generateToken(updatedUser.id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot password - generate OTP and send email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: 'No user found with that email' });
            return;
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP before storing
        user.resetOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        // Set expire to 10 minutes
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        // Send OTP via email
        try {
            console.log(`Sending OTP ${otp} to ${email}`);
            await sendOTPEmail(email, otp);
            console.log(`OTP email sent successfully to ${email}`);
            res.json({
                success: true,
                message: 'OTP sent to your email address',
            });
        } catch (emailError: any) {
            console.error('Email sending failed:', emailError.message || emailError);
            // Clear OTP if email fails
            user.resetOTP = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(500).json({ message: 'Failed to send email. Please try again.' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            res.status(400).json({ message: 'Email, OTP, and new password are required' });
            return;
        }

        // Hash OTP to compare
        const hashedOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email,
            resetOTP: hashedOTP,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear OTP fields
        user.resetOTP = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({
            success: true,
            message: 'Password reset successful',
            token: generateToken(user.id),
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// OTP-BASED LOGIN (No Password Required)
// ============================================

// @desc    Send login OTP to existing user
// @route   POST /api/auth/send-login-otp
// @access  Public
export const sendLoginOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            res.status(404).json({ message: 'No account found with this email' });
            return;
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP before storing
        user.loginOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        // Set expire to 10 minutes
        user.loginOTPExpire = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        // Send OTP via email
        try {
            await sendLoginOTPEmail(email, otp);
            res.json({
                success: true,
                message: 'Login code sent to your email',
            });
        } catch (emailError: any) {
            console.error('Email sending failed:', emailError.message || emailError);
            user.loginOTP = undefined;
            user.loginOTPExpire = undefined;
            await user.save();
            res.status(500).json({ message: 'Failed to send email. Please try again.' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify login OTP and authenticate
// @route   POST /api/auth/verify-login-otp
// @access  Public
export const verifyLoginOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).json({ message: 'Email and OTP are required' });
            return;
        }

        // Hash OTP to compare
        const hashedOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email: email.toLowerCase(),
            loginOTP: hashedOTP,
            loginOTPExpire: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired code' });
            return;
        }

        // Clear OTP fields
        user.loginOTP = undefined;
        user.loginOTPExpire = undefined;
        await user.save();

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user.id),
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// OTP-BASED REGISTRATION (No Password Required)
// ============================================

// Temporary storage for pending registrations (in production, use Redis)
const pendingRegistrations = new Map<string, { name: string; email: string; otp: string; expires: Date }>();

// @desc    Send registration OTP to new user
// @route   POST /api/auth/send-register-otp
// @access  Public
export const sendRegisterOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            res.status(400).json({ message: 'Name and email are required' });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({ message: 'An account with this email already exists' });
            return;
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP before storing
        const hashedOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        // Store pending registration
        pendingRegistrations.set(email.toLowerCase(), {
            name,
            email: email.toLowerCase(),
            otp: hashedOTP,
            expires: new Date(Date.now() + 10 * 60 * 1000),
        });

        // Clean up expired entries
        for (const [key, value] of pendingRegistrations) {
            if (value.expires < new Date()) {
                pendingRegistrations.delete(key);
            }
        }

        // Send OTP via email
        try {
            console.log(`🚀 Controller: Calling sendRegistrationOTPEmail for ${email}`);
            await sendRegistrationOTPEmail(email, otp, name);

            console.log(`✅ Registration OTP email sent to ${email}`);
            res.json({
                success: true,
                message: 'Verification code sent to your email',
            });
        } catch (emailError: any) {
            console.error('❌ Registration email sending failed:', emailError.message || emailError);
            pendingRegistrations.delete(email.toLowerCase());
            res.status(500).json({ message: 'Failed to send email. Please try again.' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP and create account
// @route   POST /api/auth/verify-register-otp
// @access  Public
export const verifyRegisterOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).json({ message: 'Email and OTP are required' });
            return;
        }

        const pending = pendingRegistrations.get(email.toLowerCase());

        if (!pending) {
            res.status(400).json({ message: 'No pending registration found. Please start over.' });
            return;
        }

        if (pending.expires < new Date()) {
            pendingRegistrations.delete(email.toLowerCase());
            res.status(400).json({ message: 'Verification code expired. Please request a new one.' });
            return;
        }

        // Hash OTP to compare
        const hashedOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        if (pending.otp !== hashedOTP) {
            res.status(400).json({ message: 'Invalid verification code' });
            return;
        }

        // Create user (no password needed)
        const user = await User.create({
            name: pending.name,
            email: pending.email,
        });

        // Clean up
        pendingRegistrations.delete(email.toLowerCase());

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            token: generateToken(user.id),
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// PHONE-BASED LOGIN (Firebase Phone Auth)
// ============================================

// @desc    Login with phone using Firebase ID token
// @route   POST /api/auth/phone-login
// @access  Public
export const phoneLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            res.status(400).json({ message: 'Firebase ID token is required' });
            return;
        }

        // Verify Firebase token
        const decodedToken = await verifyFirebaseToken(idToken);
        if (!decodedToken) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }

        // Get phone number from Firebase
        const firebaseUser = await getFirebaseUser(decodedToken.uid);
        if (!firebaseUser || !firebaseUser.phoneNumber) {
            res.status(400).json({ message: 'Could not get phone number from Firebase' });
            return;
        }

        const phone = firebaseUser.phoneNumber;

        // Find or create user by phone
        let user = await User.findOne({ phone });

        if (!user) {
            res.status(404).json({
                message: 'No account found with this phone number',
                needsRegistration: true,
                phone
            });
            return;
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            token: generateToken(user.id),
        });
    } catch (error: any) {
        console.error('Phone login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register with phone using Firebase ID token
// @route   POST /api/auth/phone-register
// @access  Public
export const phoneRegister = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idToken, name } = req.body;

        if (!idToken || !name) {
            res.status(400).json({ message: 'Firebase ID token and name are required' });
            return;
        }

        // Verify Firebase token
        const decodedToken = await verifyFirebaseToken(idToken);
        if (!decodedToken) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }

        // Get phone number from Firebase
        const firebaseUser = await getFirebaseUser(decodedToken.uid);
        if (!firebaseUser || !firebaseUser.phoneNumber) {
            res.status(400).json({ message: 'Could not get phone number from Firebase' });
            return;
        }

        const phone = firebaseUser.phoneNumber;

        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            res.status(400).json({ message: 'An account with this phone number already exists' });
            return;
        }

        // Create new user with phone
        const user = await User.create({
            name,
            phone,
        });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            token: generateToken(user.id),
        });
    } catch (error: any) {
        console.error('Phone registration error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ============================================
// GOOGLE SIGN-IN (Firebase Google Auth)
// ============================================

// @desc    Login/Register with Google using Firebase ID token
// @route   POST /api/auth/google-login
// @access  Public
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idToken, name, photoURL } = req.body;

        if (!idToken) {
            res.status(400).json({ message: 'Firebase ID token is required' });
            return;
        }

        // Verify Firebase token
        const decodedToken = await verifyFirebaseToken(idToken);
        if (!decodedToken) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }

        // Get email from decoded token
        const email = decodedToken.email;
        if (!email) {
            res.status(400).json({ message: 'Could not get email from Google account' });
            return;
        }

        // Find or create user by email
        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Create new user with Google data
            user = await User.create({
                name: name || decodedToken.name || 'User',
                email: email.toLowerCase(),
                avatar: photoURL || null,
            });
            console.log('✅ Created new user via Google Sign-In:', email);
        } else {
            // Update avatar if user doesn't have one
            if (!user.avatar && photoURL) {
                user.avatar = photoURL;
                await user.save();
            }
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            token: generateToken(user.id),
        });
    } catch (error: any) {
        console.error('Google login error:', error);
        res.status(500).json({ message: error.message });
    }
};

