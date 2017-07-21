var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User = require('./app/models/user'); // get our mongoose model
var Cost = require('./app/models/cost');

var moment = require('moment');
moment.locale('ru');

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

app.get('/', function (req, res) {
    res.send('API note-swift');
});

app.get('/setup', function (req, res) {

    var provide = req.headers.provide,
        password = req.headers.password;

    if (provide && password === '2344961') {

        var admin = new User({
            name: 'alex',
            password: 12345678,
            admin: true
        });

        admin.save(function (err) {
            if (err) {
                throw err;
            }

            console.log('User Saved');
            res.json({success: true});
        });
    } else {
        res.json({success: false})
    }
});

var apiRoutes = express.Router();

apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.post('/auth', function (req, res) {
    User.findOne({
        name: req.body.name
    }, function (err, user) {
        if (err) {
            throw err;
        }

        if (!user) {
            res.json({success: false, message: 'Authentication failed. User not found.'});
        } else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                res.json({success: false, message: 'Authentication failed. Wrong password.'});
            } else {
                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});

apiRoutes.use(function (req, res, next) {
    if (req.method !== 'OPTIONS') {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['authorization'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    } else {
        next();
    }
});

apiRoutes.post('/costs', function (req, res) {

    var cost = new Cost({
        date: req.body.date,
        formatDate: (function () {
            return moment(req.body.date).format('L');
        })(),
        type: req.body.type,
        amount: req.body.amount,
        username: req.body.username
    });

    cost.save(function (err) {
        if (err) {
            throw err;
        }

        console.log('Cost Saved');
        res.json({success: true});
    });
});

apiRoutes.get('/costs', function (req, res) {

    var sort = {date: -1};

    Cost.find({}).sort(sort).exec(function (err, costs) {
        if (err) {
            throw err;
        }

        var result = {
            content: costs
        };

        res.json(result);
    });
});

apiRoutes.get('/costs/chart', function (req, res) {

    var currentDay = moment().format('L');
    var currentWeekDays = [];

    for (var i = 0; i < 7; i++) {
        var day = {
            date: (function () {
                var date = moment().add(-[i], 'd');
                return moment(date).format('L');
            })(),
            costs: []
        };

        Cost.find({formatDate: day.date}, function (err, costs) {
            if (costs.length > 0) {
                // console.log(currentWeekDays[i2]);
                console.log(costs);
                day['costs'] = costs;
            }
        });

        currentWeekDays.push(day);
    }

    var result = {
        content: {
            currentDay: currentDay,
            currentWeekDays: currentWeekDays
        }
    };

    res.json(result);
});

apiRoutes.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

app.use('/api', apiRoutes);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);