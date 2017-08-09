var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('./app/libs/mongoose');
var root = require('./app/routes/public/root/root');
var guardService = require('./app/guards/auth.guard.js');
var costsRouter = require('./app/routes/secured/api/costsRouter');
var usersRouter = require('./app/routes/secured/api/usersRouter');
var auth = require('./app/routes/public/auth/auth');
var port = process.env.PORT || 8085;
var socket = require('socket.io')(server);

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

socket.on('connection', function (socket) {

    console.log('Client connected');

    socket.on('token', function (token) {

        socket.emit('event2', 'token it perfectly');

        socket.on('event', function (eventMsg) {
            console.log(eventMsg);
            socket.emit('event2', 'hi app with angular 2');
        });
    });

    socket.on('disconnect', function () {
        console.log('Client disconnected');
    });
});

app.use('/api', guardService);
app.use('/api', usersRouter);
app.use('/api', costsRouter);

server.listen(port);
console.log('Magic happens at http://localhost:' + port);