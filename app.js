const mongoose = require('mongoose');
const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const config = require('./config/app').get(process.env.NODE_ENV);
const apiRouter = require('./routes/api');
const port = process.env.PORT || 3000;
const app = express();

// Static File Configuration
app.use('/css', express.static(path.join(__dirname, 'public/assets/css')));
app.use('/images', express.static(path.join(__dirname, 'public/assets/images')));
app.use('/js', express.static(path.join(__dirname, 'public/assets/js')));

// View Configuration
app.set('views', './views');
app.set('view engine', 'pug');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

// Main Page
app.get('/', function (req, res) {
    res.render('index');
});

// API Routes
app.use('/api', apiRouter);

// Use bluebird for mongoose promises
mongoose.Promise = bluebird;

// If not in test mode
if(process.env.NODE_ENV !== 'test') {
    mongoose.connect(config.database, {
        useMongoClient: true
    });

    app.listen(port, () => {
        console.log('Listening on port '+port);
    });
}

// For testing
module.exports = app;