const mongoose = require('mongoose');

const conferenceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    submissionDeadline: {
        type: Date
    },
    location: {
        type: String,
        trim: true
    },
    mode: {
        type: String,
        enum: ['In-Person', 'Online', 'Hybrid'],
        default: 'In-Person'
    },
    themes: {
        type: String,
        trim: true
    },
    acceptanceNotification: {
        type: Date
    },
    registrationFees: {
        ugPgStudents: { type: Number, default: 0 },
        facultyResearchScholars: { type: Number, default: 0 },
        externalOnlinePresentation: { type: Number, default: 0 },
        industryPersonnel: { type: Number, default: 0 }
    },
    contactEmail: {
        type: String,
        trim: true
    },
    contactPhone: {
        type: String,
        trim: true
    },
    convenors: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Conference', conferenceSchema);
