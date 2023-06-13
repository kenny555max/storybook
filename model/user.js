const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    displayName: String,
    firstName: String,
    lastName: String,
    profileImage: String,
});

const user = mongoose.model('StoryUser', userSchema);

module.exports = user;