const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Game = require('../models/game');
const GameHistory = require('../models/gameHistory'); // Import the GameHistory model

// Start Game Endpoint
router.post('/start-game', async (req, res) => {
    const { user1Grid, user2Grid } = req.body;

    // Reset Game (clears the users and previous game data)
    await User.deleteMany({});
    await Game.deleteMany({ isActive: true });

    // Create Users
    const user1 = new User({ name: 'User 1', grid: user1Grid, cutNumbers: Array(3).fill([false, false, false]) });
    const user2 = new User({ name: 'User 2', grid: user2Grid, cutNumbers: Array(3).fill([false, false, false]) });
    await user1.save();
    await user2.save();

    // Initialize a new Game instance
    const game = new Game({ isActive: true, generatedNumbers: [] });
    await game.save();

    res.json({ message: 'Game started' });
});

// Generate Random Number Endpoint
router.get('/generate-number', async (req, res) => {
    const game = await Game.findOne({ isActive: true });

    if (!game) {
        return res.status(400).json({ message: 'Game not active' });
    }

    let number;
    do {
        number = Math.floor(Math.random() * 9) + 1;
    } while (game.generatedNumbers.includes(number));

    game.generatedNumbers.push(number);
    await game.save();

    const users = await User.find();
    for (const user of users) {
        user.grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === number) {
                    user.cutNumbers[rowIndex][colIndex] = true;
                }
            });
        });
        await user.save();
    }

    let winner = null;
    for (const user of users) {
        for (let i = 0; i < 3; i++) {
            if (user.cutNumbers[i].every(val => val) || user.cutNumbers.map(row => row[i]).every(val => val)) {
                winner = user.name;
                break;
            }
        }
        if (winner) break;
    }

    if (winner) {
        game.isActive = false;
        await game.save();

        // Save game history when a winner is found
        const gameHistory = new GameHistory({
            date: new Date(),
            user1Grid: users[0].grid,
            user2Grid: users[1].grid,
            generatedNumbers: game.generatedNumbers,
            winner: winner
        });
        await gameHistory.save();

        return res.json({ number, winner });
    }

    res.json({ number });
});

// Get Game History Endpoint
router.get('/game-history', async (req, res) => {
    try {
        const history = await GameHistory.find().sort({ date: -1 }); // Sort by most recent first
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch game history' });
    }
});

module.exports = router;
