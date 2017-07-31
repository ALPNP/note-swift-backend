var Cost = require('./../models/cost');
var moment = require('./../libs/moment');
var _ = require('lodash');

var costsController = {
    getCostsChartData: function (req, res) {
        Cost.find({}, function (err, costs) {

            var currentDay = moment().format('L');
            var currentWeekDays = [];
            var chartLabels = [];
            var chartData = [
                {data: [], label: 'Доходы'},
                {data: [], label: 'Расходы'}
            ];

            for (var i = 0; i < 7; i++) {
                var day = {
                    date: (function () {
                        var date = moment().add(-[i], 'd');
                        return moment(date).format('L');
                    })(),
                    costs: []
                };

                currentWeekDays.push(day);
            }

            _.forEach(currentWeekDays, function (value) {
                var searchDay = value;
                var searchDate = value.date;
                _.forEach(costs, function (value) {
                    if (value.formatDate === searchDate) {
                        searchDay.costs.push(value);
                    }
                });
            });

            _.forEachRight(currentWeekDays, function (day) {
                chartLabels.push(day.date);
            });

            _.forEach(chartLabels, function (label) {
                var filtered = _.filter(costs, function (cost) {
                    return cost.formatDate === label;
                });

                var add = 0,
                    remove = 0;

                if (filtered.length === 0) {
                    chartData[0].data.push(add);
                    chartData[1].data.push(remove);
                } else {
                    _.forEach(filtered, function (filteredItem) {
                        if (filteredItem.type === 'add') {
                            add = filteredItem.amount + add;
                        } else if (filteredItem.type === 'remove') {
                            remove = filteredItem.amount + remove;
                        }
                    });

                    chartData[0].data.push(add);
                    chartData[1].data.push(remove);
                }
            });

            var result = {
                content: {
                    currentDay: currentDay,
                    chart: {
                        chartLabels: chartLabels,
                        chartData: chartData
                    }
                }
            };

            return res.json(result);
        });
    },
    getCosts: function (req, res) {
        var sort = {date: -1};

        Cost.find({}).sort(sort).exec(function (err, costs) {
            if (err) {
                throw err;
            }

            var result = {
                content: costs
            };

            return res.json(result);
        });
    },
    addCost: function (req, res) {
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

            return res.json({success: true});
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