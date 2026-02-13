const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Confirmed'
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    intendToSubmit: {
        type: Boolean,
        default: false
    }
});

// Compound index to prevent duplicate registrations for the same user and conference
registrationSchema.index({ user: 1, conference: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
