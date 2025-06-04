const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['cambridge', 'writing', 'speaking', 'vocabulary', 'grammar', 'tests']
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: String,
        required: true
    },
    downloadLink: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resource', ResourceSchema);
