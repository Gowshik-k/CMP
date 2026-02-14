const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['Attendee', 'Author', 'Reviewer', 'Chair', 'Admin'],
        default: 'Attendee'
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailCode: {
        type: String,
        default: ''
    },
    affiliation: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    socialLinks: {
        linkedin: { type: String, default: '' },
        orcid: { type: String, default: '' },
        twitter: { type: String, default: '' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        // If password is already hashed (imported from PendingUser), skip hashing
        if (this.password.startsWith('$2')) {
            return next();
        }

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
