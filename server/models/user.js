const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,  // 'User 1' or 'User 2'
    grid: [[Number]],  // 3x3 grid of numbers (1-9, unique per user)
    cutNumbers: [[Boolean]],  // 3x3 Boolean array to track cuts
    winner: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
