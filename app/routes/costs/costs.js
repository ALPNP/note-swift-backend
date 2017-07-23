var express = require('express');
var router = express.Router();
var moment = require('./../../libs/moment');
var Cost = require('./../../models/cost');

router.get('/costs', function (req, res) {

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

router.post('/costs', function (req, res) {

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

router.get('/costs/chart', function (req, res) {

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

module.exports = router;
