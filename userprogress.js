const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    targetBand: {
        type: Number,
        required: true,
        min: 1,
        max: 9
    },
    currentBand: {
        type: Number,
        required: true,
        min: 1,
        max: 9
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    lastTestDate: {
        type: Date
    },
    lastTestScore: {
        listening: Number,
        reading: Number,
        writing: Number,
        speaking: Number,
        overall: Number
    },
    weakAreas: [{
        type: String,
        enum: ['listening', 'reading', 'writing', 'speaking', 'vocabulary', 'grammar']
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);
