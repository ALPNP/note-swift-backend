var express = require('express');
var root = express.Router();
var User = require('./../../../models/user');

root.get('/', function (req, res) {
    res.send('API note-swift');
});

root.get('/setup', function (req, res) {

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

module.exports = root;