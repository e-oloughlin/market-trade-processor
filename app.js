const url = require('url');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config/app').get(process.env.NODE_ENV);
const apiRouter = require('./routes/api');
const port = process.env.PORT || 3000;

// Start socket.io
require('./socket/index').listen(http);

// Use bluebird for mongoose promises
mongoose.Promise = bluebird;

// Static File Configuration
app.use('/css', express.static(path.join(__dirname, 'public/assets/css')));
app.use('/fonts', express.static(path.join(__dirname, 'public/assets/fonts')));
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

function getFormattedUrl(req) {
    return url.format({
        protocol: req.protocol,
        host: req.get('host')
    });
}

// Main Page
app.get('/', (req, res) => {
    res.render('index');
});

// API Routes
app.use('/api', apiRouter);

app.get('/post-new-message', (req, res) => {
    if(req.query.user === 'eoghan') {
        const request = require('./mock/request');

        let url = `${getFormattedUrl(req)}/api/message`;

        request(url);

        res.send('<p> Done </p>');
    }
});

app.get('/clear-db', (req, res) => {
    if(req.query.user === 'eoghan') {
        const Message = require('./model/message');

        Message.remove({}, function() {
            console.log('DB cleared');
        });
    }

    res.redirect('/');
});

// If not in test mode
if(process.env.NODE_ENV !== 'test') {
    mongoose.connect(config.database, {
        useMongoClient: true
    });

    http.listen(port, () => {
        console.log('Listening on port '+port);
    });
}

// For API testing
exports.app = app;