import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify connection configuration
try {
    transporter.verify(function (error, success) {
        if (error) {
            console.error('❌ Email Service Error (Verify):', error);
        } else {
            console.log('✅ Email Service is ready to send messages');
        }
    });
} catch (err) {
    console.error('❌ Transporter verify crashed:', err);
}

// Your email to receive feedback
const FEEDBACK_RECIPIENT = process.env.FEEDBACK_EMAIL || 'mail.to.pruthivi@gmail.com';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Cannot send email: EMAIL_USER or EMAIL_PASS is missing.');
        throw new Error('Email service is not configured (missing credentials)');
    }

    // Log masked credentials for debugging (DO NOT LOG ACTUAL PASSWORD)
    console.log(`Debug: Using Email User: ${process.env.EMAIL_USER}`);
    console.log(`Debug: Email Pass length: ${process.env.EMAIL_PASS?.length}`);

    try {
        console.log(`📧 Attempting to send email to: ${options.to} | Subject: ${options.subject}`);

        // Add timeout to prevent hanging (increased to 30s for Vercel/Cloud)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Email sending timed out after 30s')), 30000)
        );

        const sendPromise = transporter.sendMail({
            from: `"LifeOS" <${process.env.EMAIL_USER}>`, // sender address
            to: options.to,
            subject: options.subject,
            html: options.html,
        });

        const info = (await Promise.race([sendPromise, timeoutPromise])) as any;
        console.log('✅ Email sent successfully via Nodemailer:', info.messageId);
    } catch (error) {
        console.error('❌ Failed to send email via Nodemailer:', error);
        throw error;
    }
};

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">LifeOS</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Password Reset Request</p>
            </div>
            <div style="background: #1a1a2e; padding: 40px 30px; border-radius: 0 0 16px 16px; color: #e0e0e0;">
                <p style="font-size: 16px; margin-bottom: 20px;">You requested to reset your password. Use the OTP below to proceed:</p>
                <div style="background: #16213e; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #888; margin-top: 20px;">This OTP is valid for <strong>10 minutes</strong>.</p>
                <p style="font-size: 14px; color: #888;">If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
                <p style="font-size: 12px; color: #666; text-align: center;">© ${new Date().getFullYear()} LifeOS. All rights reserved.</p>
            </div>
        </div>
    `;

    await sendEmail({
        to: email,
        subject: 'LifeOS - Password Reset OTP',
        html,
    });
};

export const sendLoginOTPEmail = async (email: string, otp: string): Promise<void> => {
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">LifeOS</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Sign In Request</p>
            </div>
            <div style="background: #1a1a2e; padding: 40px 30px; border-radius: 0 0 16px 16px; color: #e0e0e0;">
                <p style="font-size: 16px; margin-bottom: 20px;">Use this code to sign in to your LifeOS account:</p>
                <div style="background: #16213e; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #888; margin-top: 20px;">This code is valid for <strong>10 minutes</strong>.</p>
                <p style="font-size: 14px; color: #888;">If you didn't request this, someone may be trying to access your account.</p>
                <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
                <p style="font-size: 12px; color: #666; text-align: center;">© ${new Date().getFullYear()} LifeOS. All rights reserved.</p>
            </div>
        </div>
    `;

    await sendEmail({
        to: email,
        subject: 'LifeOS - Your Sign In Code',
        html,
    });
};

export const sendRegistrationOTPEmail = async (email: string, otp: string, name: string): Promise<void> => {
    console.log(`📝 Preparing registration email for ${email}`);
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to LifeOS! 🎉</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Verify Your Email</p>
            </div>
            <div style="background: #1a1a2e; padding: 40px 30px; border-radius: 0 0 16px 16px; color: #e0e0e0;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name}! 👋</p>
                <p style="font-size: 16px; margin-bottom: 20px;">Use this code to complete your registration:</p>
                <div style="background: #16213e; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #888; margin-top: 20px;">This code is valid for <strong>10 minutes</strong>.</p>
                <p style="font-size: 14px; color: #888;">If you didn't create an account, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
                <p style="font-size: 12px; color: #666; text-align: center;">© ${new Date().getFullYear()} LifeOS. All rights reserved.</p>
            </div>
        </div>
    `;

    await sendEmail({
        to: email,
        subject: 'LifeOS - Verify Your Email',
        html,
    });
};

export const sendFeedbackEmail = async (
    name: string,
    email: string,
    subject: string,
    message: string
): Promise<void> => {
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">LifeOS Feedback</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">New message received</p>
            </div>
            <div style="background: #1a1a2e; padding: 40px 30px; border-radius: 0 0 16px 16px; color: #e0e0e0;">
                <div style="background: #16213e; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <p style="margin: 0 0 10px 0;"><strong style="color: #667eea;">From:</strong> ${name}</p>
                    <p style="margin: 0 0 10px 0;"><strong style="color: #667eea;">Email:</strong> ${email}</p>
                    <p style="margin: 0;"><strong style="color: #667eea;">Subject:</strong> ${subject}</p>
                </div>
                <div style="background: #16213e; padding: 20px; border-radius: 12px;">
                    <p style="margin: 0 0 10px 0; color: #667eea;"><strong>Message:</strong></p>
                    <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
                </div>
                <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
                <p style="font-size: 12px; color: #666; text-align: center;">
                    Reply directly to this email to respond to ${name}
                </p>
            </div>
        </div>
    `;

    await sendEmail({
        to: FEEDBACK_RECIPIENT,
        subject: `[LifeOS Feedback] ${subject}`,
        html,
    });
};
