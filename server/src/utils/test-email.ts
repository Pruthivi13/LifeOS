
import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const apiKey = process.env.RESEND_API_KEY;
console.log('Script - API Key:', apiKey ? apiKey.substring(0, 5) + '...' : 'MISSING');

if (!apiKey) {
    console.error('Please set RESEND_API_KEY in server/.env');
    process.exit(1);
}

const resend = new Resend(apiKey);

async function sendTest() {
    console.log('Attempting to send test email...');
    try {
        const data = await resend.emails.send({
            from: 'LifeOS <onboarding@resend.dev>',
            to: 'coolbuddy139@gmail.com', // Using the email from the screenshot
            subject: 'Test Email from Debug Script',
            html: '<p>This is a test email to verify Resend configuration.</p>',
        });
        console.log('Success:', data);
    } catch (err) {
        console.error('Error:', err);
    }
}

sendTest();
