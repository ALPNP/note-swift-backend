var express = require('express');
var usersRouter = express.Router();
var User = require('./../../../models/user');

usersRouter.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

module.exports = usersRouter;
