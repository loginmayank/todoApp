const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

//Config 
var config = require("./server/config");

// API file for interacting with MongoDB
const api = require('./server/routes/api');

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-type,Accept,X-Access-Token,X-Key');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Angular dist o/p folder
app.use(express.static(path.join(__dirname, '/dist')));

// API location
app.use('/api', api);

// Send all other request to the angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Mongodb connect
mongoose.connect(config.database, (err) => {
    if (err) {
        console.log("Unable to conect to database...");
        console.log("... " + config.database);
    } else {
        console.log("Connected to DB");
    }
});

const http = require('http').Server(app);

// Server
http.listen(config.port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Listening on port  ${config.port}`);
    }
});