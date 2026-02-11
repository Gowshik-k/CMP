const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/email');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;

        // Basic validation
        if (!username || !email || !password || !phoneNumber) {
            return res.status(400).send('Registration requires username, email, password, and phone number.');
        }

        const emailExist = await User.findOne({ email });
        if (emailExist) return res.status(400).send('A user with this email already exists.');

        const userExist = await User.findOne({ username });
        if (userExist) return res.status(400).send('This username is already taken.');

        // Generate numeric codes
        const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
        const phoneCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Create user
        const user = new User({
            username,
            email,
            password,
            phoneNumber,
            role: 'Attendee',
            emailCode,
            phoneCode,
            isEmailVerified: false,
            isPhoneVerified: false
        });

        await user.save();

        // Send actual email
        await sendEmail(
            email,
            'Your Security Code - UniversityConf',
            `Your email verification code is: ${emailCode}`
        );

        console.log(`Dual codes generated for ${username}. Email: ${emailCode}, Phone: ${phoneCode}`);

        res.send({
            message: 'Registration successful. Codes sent to email and mobile.',
            userId: user._id,
            debug_phone_code: phoneCode // Logged/displayed for development
        });
    } catch (err) {
        console.error('Registration error:', err);
        if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoNetworkError') {
            return res.status(503).send('Database connection error. Please ensure your IP is whitelisted in MongoDB Atlas.');
        }
        res.status(500).send('Internal server error during registration');
    }
});

// VERIFY DUAL CODES
router.post('/verify', async (req, res) => {
    const { userId, emailCode, phoneCode } = req.body;
    if (!userId) return res.status(400).send('Missing User ID.');

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User account not found.');

        let updated = false;

        // Verify email code if not already verified
        if (emailCode && !user.isEmailVerified) {
            if (user.emailCode === emailCode) {
                user.isEmailVerified = true;
                user.emailCode = '';
                updated = true;
            } else {
                return res.status(400).send('Invalid email verification code.');
            }
        }

        // Verify phone code if not already verified
        if (phoneCode && !user.isPhoneVerified) {
            if (user.phoneCode === phoneCode) {
                user.isPhoneVerified = true;
                user.phoneCode = '';
                updated = true;
            } else {
                return res.status(400).send('Invalid mobile verification code.');
            }
        }

        if (updated) await user.save();

        res.send({
            message: 'Verification status updated.',
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified
        });
    } catch (err) {
        console.error('Verification error:', err);
        res.status(500).send('Server error during verification.');
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send('Please provide both email and password.');
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('No account found with this email.');

        // Check verification (Both MUST be true for non-admins)
        if (user.role !== 'Admin' && (!user.isEmailVerified || !user.isPhoneVerified)) {
            return res.status(401).send({
                message: 'Account not fully verified.',
                requiresVerification: true,
                userId: user._id,
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified
            });
        }

        const validPass = await user.comparePassword(password);
        if (!validPass) return res.status(401).send('Incorrect password.');

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);

        res.header('auth-token', token).send({
            token: token,
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoNetworkError') {
            return res.status(503).send('Database connection error. Please ensure your IP is whitelisted in MongoDB Atlas.');
        }
        res.status(500).send('Internal server error during login.');
    }
});

module.exports = router;
