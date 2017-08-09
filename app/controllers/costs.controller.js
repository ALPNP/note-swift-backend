var Cost = require('./../models/cost');
var moment = require('./../libs/moment');
var utilities = require('./../utilities/utilitites');

var costsController = {
    getCost: function (req, res) {
        Cost.findById(req.params.id || 0, function (err, cost) {

            console.log(cost);

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
                    res.json(err)
                } else {
                    res.json(cost);
                }
            });
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
    getCost: function (req, res) {
        Cost.findById(req.params.id || 0, function (err, cost) {

            if (cost) {
                res.json(cost);
            } else {
                res.json({
                    success: false,
                    message: 'Записей не найдено'
                });
            }
        });
    },
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
                    res.json(err)
                } else {
                    res.json(cost);
                }
            });
        });
    },
    deleteCost: function (req, res) {
        Cost.find({'_id': req['body']['_id']}).remove().exec(function (err, cost) {
            if (err) {
                res.json(err);
            }

            if (cost.result.n == 1) {
                res.json({success: true});
            } else {
                res.json({success: false});
            }
        });
    }
};

module.exports = costsController;