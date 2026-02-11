const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            family: 4
        });
        const users = await User.find({}, 'username email role isEmailVerified isPhoneVerified');
        console.log('--- Current Users in Database ---');
        console.log(JSON.stringify(users, null, 2));
        console.log('---------------------------------');
        process.exit();
    } catch (error) {
        console.error('Error listing users:', error);
        process.exit(1);
    }
};

listUsers();
