import * as brevo from '@getbrevo/brevo';

// Initialize Brevo API
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

if (process.env.BREVO_API_KEY) {
    console.log('✅ Brevo Email Service initialized');
} else {
    console.error('❌ BREVO_API_KEY not found in environment variables');
}

// Sender email - use your verified sender email from Brevo
const FROM_EMAIL = process.env.FROM_EMAIL || 'mail.to.pruthivi@gmail.com';
const FROM_NAME = 'LifeOS';

// Your email to receive feedback
const FEEDBACK_RECIPIENT = process.env.FEEDBACK_EMAIL || 'mail.to.pruthivi@gmail.com';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    if (!process.env.BREVO_API_KEY) {
        console.error('❌ Cannot send email: BREVO_API_KEY is missing.');
        throw new Error('Email service is not configured (missing BREVO_API_KEY)');
    }

    try {
        console.log(`📧 Attempting to send email to: ${options.to} | Subject: ${options.subject}`);

        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = options.subject;
        sendSmtpEmail.htmlContent = options.html;
        sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
        sendSmtpEmail.to = [{ email: options.to }];

        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Email sent successfully via Brevo:', result.body);
    } catch (error: any) {
        console.error('❌ Failed to send email via Brevo:', error?.body || error?.message || error);
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
