const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// REGISTER
router.post('/register', async (req, res) => {
    // Validate data before creating user (Basic validation)
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).send('Please enter all fields');
    }

    // Check if user already exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    const userExist = await User.findOne({ username: req.body.username });
    if (userExist) return res.status(400).send('Username already exists');

    // Create a new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password, // Hashing is handled in User model pre-save hook
        role: req.body.role || 'Attendee'
    });

    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    // Check if email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found');

    // Check if password is correct
    const validPass = await user.comparePassword(req.body.password);
    if (!validPass) return res.status(400).send('Invalid password');

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.header('auth-token', token).send({ token: token, user: { username: user.username, email: user.email, role: user.role } });
});

module.exports = router;
