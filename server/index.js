const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();
const gameRoutes = require('./routes/gameRoutes')

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve the React app for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

const allowedOrigins = [
    'https://el-lotteria-game-nsub.onrender.com/', // Add your frontend URL here
];

const corsOptions = {
    origin: allowedOrigins,
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow credentials if needed
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/lotteryGame')
    .then(() => console.log('MongoDB connect'))
    .catch(err => console.log('MongoDB not connected', err));

app.get('/', (req, res) => {
    res.send('lolo')
})

app.use('/api', gameRoutes)

app.listen(5000, () => {
    console.log('Server is running prot 5000')
})
