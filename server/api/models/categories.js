const mongoose = require('mongoose');

module.exports = mongoose.model('Category', new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: 255,
        required: true
    },
    description: {
        type: String,
        maxlength: 500,
        required: true
    }
}));