// models/gameHistory.js
const mongoose = require('mongoose');

const gameHistorySchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    user1Grid: [[Number]],
    user2Grid: [[Number]],
    generatedNumbers: [Number],
    winner: { type: String, required: true }
});

module.exports = mongoose.model('GameHistory', gameHistorySchema);
