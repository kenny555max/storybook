const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title: { type: String, require, trim: true },
    status: {
        type: String,
        default: 'Public',
        enum: ['Public', 'Private']
    },
    message: { type: String, require },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoryUser'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const story = mongoose.model('story', storySchema);

module.exports = story;