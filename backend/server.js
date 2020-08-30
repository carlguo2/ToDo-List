// bring packages in
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
var secrets = require('./config/secrets');

// Create our express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

// connect to a MongoDB
mongoose.connect(secrets.mongo_connection, { useNewUrlParser: true })

// allow CORS so backend and frontend can be on different servers
app.use(cors())
// use body-parser in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// use routes as a module 
require('./routes')(app, router);

// start the server
app.listen(port);
console.log('Server is running on port: ' + port);
