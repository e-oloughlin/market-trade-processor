const mongoose = require('mongoose');
const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const config = require('./config/app').get(process.env.NODE_ENV);
const apiRouter = require('./routes/api');
const port = process.env.PORT || 3000;
const app = express();

const MessageController = require('./controller/message');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

// Static File Configuration
app.use('/css', express.static(path.join(__dirname, 'public/assets/css')));
app.use('/images', express.static(path.join(__dirname, 'public/assets/images')));
app.use('/js', express.static(path.join(__dirname, 'public/assets/js')));
app.use('/lib', express.static(path.join(__dirname, 'public/assets/lib')));

// View Configuration
app.set('views', './views');
app.set('view engine', 'pug');

// Main Page
app.get('/', function (req, res) {
    const Message = require('./model/message');

    Message.find({}, (err, messages) => {
        if (err) return res.json(err);

        res.render('index', { messages });
    });
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

    app.listen(port);
}

// For testing
module.exports = app;