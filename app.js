const mongoose = require('mongoose');
const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const express = require('express');

const config = require('./config').get(process.env.NODE_ENV);
const apiRouter = require('./routes/api');
const port = process.env.PORT || 3000;

const app = express();

// Use bluebird for mongoose promises
mongoose.Promise = bluebird;

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

// API Routes
app.use('/api', apiRouter);

app.listen(port);

// For testing
module.exports = app;