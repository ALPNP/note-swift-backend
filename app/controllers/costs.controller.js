var Cost = require('./../models/cost');
var moment = require('./../libs/moment');
var utilities = require('./../utilities/utilitites');

var costsController = {
    addCost: function (req, res) {
        var cost = new Cost({
            date: req.body.date,
            formatDate: utilities.formatDate(req.body.date),
            type: req.body.type,
            amount: req.body.amount,
            username: req.body.username,
            description: req.body.description
        });

        cost.save(function (err) {
            if (err) {
                throw err;
            }

            return res.json({success: true});
        });
    },
    getCost: function (req, res) {
        Cost.findById(req.params.id || 0, function (err, cost) {
            if (err) {
                throw err;
            }

            if (cost) {
                res.json(cost);
            } else {
                res.json({
                    success: false,
                    message: 'Записей не найдено'
                })
            }
        });
    },
    deleteCost: function (req, res) {
        Cost.find({'_id': req['body']['_id']}).remove().exec(function (err, cost) {
            if (err) {
                throw err;
            }

            if (cost.result.n == 1) {
                res.json({success: true});
            } else {
                res.json({success: false});
            }
        });
    },
    updateCost: function (req, res) {

        var costForSave = req.body;

        Cost.findById(costForSave['_id'] || 0, function (err, cost) {

            cost.amount = costForSave.amount;
            cost.date = costForSave.date;
            cost.description = costForSave.description;
            cost.formatDate = utilities.formatDate(costForSave.date);
            cost.type = costForSave.type;

            cost.save(function (err) {
                if (err) {
                    throw err;
                } else {
                    res.json(cost);
                }
            });
        });
    },
    getCosts: function (req, res) {

        var daysCount = req.headers.dayscount || 7;
        var sort = {date: -1};

        Cost.find({}).sort(sort).exec(function (err, costs) {
            if (err) {
                throw err;
            }

            var result = {
                content: utilities.filterItemsByLastDaysCount(costs, daysCount),
                daysCount: daysCount
            };

            return res.json(result);
        });
    },
    getCostsChartData: function (req, res) {

        var daysCount = req.headers.dayscount || 7;

        Cost.find({}, function (err, costs) {
            if (err) {
                throw err;
            }

            var result = {
                content: utilities.createChartDataWithCurrentDayByLastDaysCount(costs, daysCount),
                daysCount: daysCount
            };

            return res.json(result);
        });
    },
    getCostsStatisticData: function (req, res) {

        var daysCount = req.headers.daysCount || 7;

        Cost.find({}, function (err, costs) {
            if (err) {
                throw err;
            }

            var result = {
                content: utilities.createStatisticDataWithCurrentDayByLastDaysCount(costs, daysCount),
                daysCount: daysCount
            };

            res.json(result);
        });
    }
};

module.exports = costsController;