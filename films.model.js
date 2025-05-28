const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    img: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Film', filmSchema);