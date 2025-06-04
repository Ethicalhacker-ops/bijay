const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    sections: {
        listening: { type: Boolean, default: true },
        reading: { type: Boolean, default: true },
        writing: { type: Boolean, default: true },
        speaking: { type: Boolean, default: true }
    },
    fileUrl: {
        type: String,
        required: true
    },
    answerKey: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Test', TestSchema);
