var Cost = require('./../models/cost');
var utilities = require('./../utilities/utilitites');
var url = require('url');

var costsController = {
    addCost: function (req, res) {
        var cost = new Cost({
            date: req.body.date,
            formatDate: utilities.formatDate(req.body.date),
            type: req.body.type,
            amount: req.body.amount,
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
        Cost.find({
            '_id': req['body']['_id']
        }).remove().exec(function (err, cost) {
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
        const parsedUrl = url.parse(req.url, true);
        var result = {};

        if (parsedUrl.query['startDate'] !== 'null') {
            var dateInterval = {
                startDate: new Date(parsedUrl.query['startDate']),
                endDate: (function () {
                    return (parsedUrl.query['endDate'] !== 'null') ? new Date(parsedUrl.query['endDate']) : new Date(utilities.getDate());
                })()
            };

            Cost.find({
                date: {
                    $gte: dateInterval.startDate,
                    $lte: dateInterval.endDate
                }
            }).sort({date: -1}).exec(function (err, costs) {
                if (err) {
                    res.json(err);
                }

                result = {
                    content: costs,
                    daysCount: null
                };

                res.json(result);
            });
        } else {
            var currentDay = utilities.getDate();
            var startDate = utilities.getDateByDateByDaysCount(currentDay, 7);

            Cost.find({
                date: {
                    $gte: startDate,
                    $lte: currentDay
                }
            }).sort({date: -1}).exec(function (err, costs) {
                if (err) {
                    res.json(err);
                }

                result = {
                    content: costs,
                    daysCount: 7
                };

                res.json(result);
            });
        }
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
    getCostsStatisticDataByInterval: function (req, res) {
        const parsedUrl = url.parse(req.url, true);
        const defaultDaysCount = 7;
        var result = {};

        if (parsedUrl.query['startDate'] !== 'null') {
            var dateInterval = {
                startDate: new Date(parsedUrl.query['startDate']),
                endDate: null
            };

            dateInterval.endDate = (parsedUrl.query['endDate'] !== 'null') ? new Date(parsedUrl.query['endDate']) : new Date(utilities.getDate());

            Cost.find({
                date: {
                    $gte: dateInterval.startDate,
                    $lte: dateInterval.endDate
                }
            }).exec(function (err, costs) {
                if (err) {
                    res.json(err);
                }

                result.content = utilities.createStatisticData(costs, dateInterval.startDate, dateInterval.endDate);
                res.json(result);
            });
        } else {
            var currentDay = utilities.getDate();
            var startDate = utilities.getDateByDateByDaysCount(currentDay, defaultDaysCount);

            Cost.find({
                date: {
                    $gte: startDate,
                    $lte: currentDay
                }
            }).exec(function (err, costs) {
                if (err) {
                    res.json(err);
                }

                result.daysCount = defaultDaysCount;
                result.content = utilities.createStatisticData(costs, startDate, currentDay);
                res.json(result);
            });
        }
    }
};

module.exports = costsController;