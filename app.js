let mongoose = require('mongoose');
let bluebird = require('bluebird');
let bodyParser = require('body-parser');
let express = require('express');

let config = require('./config').get(process.env.NODE_ENV);
let apiRouter = require('./routes/api');
let port = process.env.PORT || 3000;

let app = express();

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