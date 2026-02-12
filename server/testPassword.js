const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const testPassword = async (email, plainPassword) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }
        console.log('Testing password for:', email);
        console.log('Stored Hash:', user.password);

        try {
            const isMatch = await user.comparePassword(plainPassword);
            console.log('Match result:', isMatch);
        } catch (innerErr) {
            console.error('Inner Exception during comparePassword:', innerErr);
        }

        process.exit(0);
    } catch (error) {
        console.error('Outer Exception:', error);
        process.exit(1);
    }
};

// Test with a known user. I know 'name1@gmail.com' exists. 
// I don't know the password, but even if it fails it shouldn't 500.
testPassword('name1@gmail.com', 'somepassword');
