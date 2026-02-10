const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@university.edu';
        const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';
        const adminUsername = process.env.ADMIN_USERNAME || 'admin_master';

        const adminExists = await User.findOne({ email: adminEmail });
        if (adminExists) {
            console.log('Admin user already exists with this email:', adminEmail);
            process.exit();
        }

        const adminUser = new User({
            username: adminUsername,
            email: adminEmail,
            password: adminPassword, // Will be hashed by pre-save hook
            role: 'Admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@university.edu');
        console.log('Password: adminpassword123');

        process.exit();
    } catch (error) {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
