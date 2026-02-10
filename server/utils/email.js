const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        // Create a transporter using environment variables
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to your email provider
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // If credentials are missing, we log the email content to console (for development)
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('--- DEVELOPMENT MODE: EMAIL LOG ---');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body: ${text}`);
            console.log('-----------------------------------');
            return true;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

module.exports = sendEmail;
