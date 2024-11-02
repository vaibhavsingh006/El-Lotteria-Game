const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();
const gameRoutes = require('./routes/gameRoutes')

app.use(cors());
app.use(express.json());

app.options('/api/start-game', cors()); 

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://el-lotteria-game-nsub.onrender.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cors({
  origin: '*', // This allows all origins
}));

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve the React app for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});


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
