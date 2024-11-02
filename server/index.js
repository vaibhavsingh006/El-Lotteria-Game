const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const gameRoutes = require('./routes/gameRoutes')

const allowedOrigins = [
    'https://el-lotteria-game-2pwu.onrender.com', // Add your frontend URL here
];

const corsOptions = {
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
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
