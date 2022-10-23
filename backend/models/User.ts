const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    last_name: { type: String, required: true, maxLength: 100 },
    username: { type: String, required: true, maxLength: 40, unique: true, uniqueCaseInsensitive: true },
    joined: { type: Date, required: true },
    bio: { type: String, required: false, maxLength: 240 },
    password: { type: String, required: true },
    access_token: { type: String, required: true }
});

UserSchema.plugin(uniqueValidator, {
    message: 'Error, {PATH} must be unique.'
});

module.exports = mongoose.model('UserSchema', UserSchema);