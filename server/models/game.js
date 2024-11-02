const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    generatedNumbers: {
        type: [Number],
        default: []
    },
    winner: {
        type: String,
        default: "" // Set an empty string as the default value
    },
    date: {
        type: String,
        default: () => new Date().toLocaleString() // Set the current date as default
    },
    winningTime: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Game', gameSchema);
