const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const helmet = require("helmet"); // A collection of 13 middleware functions for setting HTTP response headers
const mongoSanitize = require('express-mongo-sanitize'); // Sanitize user input to protect the system from a MongoDB operator injection
const rateLimit = require ('express-rate-limit'); // Protect the system against brute force
require ("dotenv").config(); // Loads environment variables from .env file

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

mongoose.connect(`mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_SERVER}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use(helmet());

// By default, $ and . characters are removed completely from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query

// To remove data using these defaults:
app.use(mongoSanitize());

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message : "Vous avez atteint le nombre de requête maximum, merci de réessayer dans un instant."
})

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', apiLimiter, userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;