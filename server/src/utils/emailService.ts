import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    const mailOptions = {
        from: `"LifeOS" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    };

    await transporter.sendMail(mailOptions);
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
