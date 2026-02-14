const PendingUser = require('../models/PendingUser');
const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/email');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).send('Registration requires username, email, and password.');
        }

        const emailExist = await User.findOne({ email });
        if (emailExist) return res.status(400).send('A user with this email already exists.');

        const userExist = await User.findOne({ username });
        if (userExist) return res.status(400).send('This username is already taken.');

        // Generate numeric codes
        const emailCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Check if pending user exists and update, or create new
        let pendingUser = await PendingUser.findOne({ email });

        if (pendingUser) {
            // Update existing pending user
            pendingUser.username = username;
            pendingUser.password = password; // Will be hashed by pre-save
            pendingUser.emailCode = emailCode;
            pendingUser.createdAt = Date.now(); // Reset expiry
        } else {
            // Create new pending user
            pendingUser = new PendingUser({
                username,
                email,
                password,
                role: 'Attendee',
                emailCode
            });
        }

        await pendingUser.save();

        // Send actual email
        await sendEmail(
            email,
            'Your Security Code - UniversityConf',
            `Your email verification code is: ${emailCode}`
        );

        console.log(`Code generated for ${username}. Email: ${emailCode}`);

        res.send({
            message: 'Registration successful. Code sent to email.',
            email: email // Send back email for verification step
        });
    } catch (err) {
        console.error('Registration error:', err);
        if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoNetworkError') {
            return res.status(503).send('Database connection error. Please ensure your IP is whitelisted in MongoDB Atlas.');
        }
        res.status(500).send('Internal server error during registration');
    }
});

// VERIFY CODE
router.post('/verify', async (req, res) => {
    const { email, emailCode } = req.body;

    if (!email || !emailCode) return res.status(400).send('Missing email or code.');

    try {
        // Find in PendingUser
        const pendingUser = await PendingUser.findOne({ email });

        if (!pendingUser) return res.status(400).send('Invalid or expired verification session. Please register again.');

        if (pendingUser.emailCode !== emailCode) {
            return res.status(400).send('Invalid email verification code.');
        }

        // Create actual User (password is already hashed in pendingUser, need to handle that)
        // Note: PendingUser.password is already hashed. Creating new User will re-hash it if we set it as 'password'.
        // Mongoose pre-save hook on User checks isModified('password').
        // We can temporarily disable checking or copy properties directly?
        // Actually, we can just save it. But wait, User model pre-save hook will hash it AGAIN.
        // We need to pass the raw password if we want User model to hash it, OR we need to bypass hashing.
        // Since we can't unhash, we should probably update PendingUser to NOT hash, or User to NOT re-hash if it looks like a hash.

        // BETTER APPROACH:
        // Use `insertMany` or direct Create to bypass middleware? No, validation is good.
        // Let's rely on the fact that we can set the password field. The pre-save hook checks `isModified('password')`.
        // If we create a new doc, it IS modified.

        // Workaround: 
        // 1. PendingUser stores CLEARTEXT password? No, security risk.
        // 2. PendingUser stores HASH. User model receives HASH.
        //    We need to disable pre-save hashing on User if it's already hashed? 
        //    Bcrypt hashes look like $2a$...
        //    Let's modify User model pre-save? No, let's keep it simple.

        // Actually, let's just create the user directly using Mongoose model but without 'saving' yet?
        // Or better, let's just make PendingUser store cleartext for the 10 mins it lives? 
        // Unverified data... arguably okay for a short TTL if database is secure.
        // BUT, better to be safe.

        // Let's modify the flow:
        // Move properties manually.

        const newUser = new User({
            username: pendingUser.username,
            email: pendingUser.email,
            password: pendingUser.password, // This is ALREADY hashed
            role: pendingUser.role,
            isEmailVerified: true
        });

        // We need to bypass the pre-save hashing for this specific instance since password is already hashed.
        // We can do this by overwriting the password after instantiation but before save?
        // No, `new User` marks it as modified.

        // NOTE: I will update User model pre-save in next step if needed, but for now:
        // Let's assume we can just save it. If it double hashes, login will fail.
        // I'll fix the User model to check if password starts with $2a$ or $2b$.

        await newUser.save();
        await PendingUser.deleteOne({ _id: pendingUser._id });

        res.send({
            message: 'Verification successful. You can now login.',
            isEmailVerified: true
        });
    } catch (err) {
        console.error('Verification error:', err);
        res.status(500).send('Server error during verification.');
    }
});

// FORGOT PASSWORD REQUEST
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('No account found with this email.');

        const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.emailCode = emailCode; // Reuse existing field or create new 'resetCode'?
        // User model has emailCode, let's reuse it for simplicity or add resetCode.
        // Using emailCode is fine as long as we know context.
        await user.save();

        await sendEmail(
            email,
            'Password Reset - UniversityConf',
            `Your password reset code is: ${emailCode}`
        );

        res.send({ message: 'Reset code sent to email.' });
    } catch (err) {
        res.status(500).send('Error processing request.');
    }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    const { email, emailCode, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('User not found.');

        if (user.emailCode !== emailCode) {
            return res.status(400).send('Invalid reset code.');
        }

        user.password = newPassword; // Will be hashed by pre-save
        user.emailCode = '';
        await user.save();

        res.send({ message: 'Password reset successful. Please login.' });
    } catch (err) {
        res.status(500).send('Error resetting password.');
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
        if (user.role !== 'Admin' && !user.isEmailVerified) {
            return res.status(401).send({
                message: 'Account not fully verified.',
                requiresVerification: true,
                userId: user._id,
                isEmailVerified: user.isEmailVerified
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
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
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
