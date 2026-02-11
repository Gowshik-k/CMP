const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    abstract: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        required: true
    },
    filePath: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Under Review', 'Accepted', 'Rejected'],
        default: 'Under Review'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Submission', submissionSchema);
