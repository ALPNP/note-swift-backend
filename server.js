var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('./app/libs/mongoose');
var root = require('./app/routes/public/root/root');
var guard = require('./app/guards/auth.guard.js');
var costs = require('./app/routes/secured/api/costs');
var users = require('./app/routes/secured/api/users');
var auth = require('./app/routes/public/auth/auth');
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', root);
app.use('/', auth);

app.use('/api', guard);
app.use('/api', users);
app.use('/api', costs);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);