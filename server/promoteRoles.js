const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Promote author@gmail.com to Chair
        const author = await User.findOneAndUpdate(
            { email: 'author@gmail.com' },
            { role: 'Chair' },
            { new: true }
        );

        if (author) {
            console.log(`Promoted ${author.email} to ${author.role}`);
        } else {
            console.log('User author@gmail.com not found');
        }

        // Promote another user to Reviewer if exists
        const reviewer = await User.findOneAndUpdate(
            { email: 'user@example.com' },
            { role: 'Reviewer' },
            { new: true }
        );

        if (reviewer) {
            console.log(`Promoted ${reviewer.email} to ${reviewer.role}`);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
