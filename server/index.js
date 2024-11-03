require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const gameRoutes = require('./routes/gameRoutes')

app.use(cors());
app.use(express.json());

// mongoose.connect(process.env.MONGODB_URI)
mongoose.connect('mongodb://localhost:27017/lotteryGame')
    .then(() => console.log('MongoDB connect'))
    .catch(err => console.log('MongoDB not connected', err));

app.get('/', (req, res) => {
    res.send('lolo')
})

app.use('/api', gameRoutes)

// const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
    console.log('Server is running prot 5000')
})
