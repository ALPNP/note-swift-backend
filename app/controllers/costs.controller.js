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

            _.forEachRight(currentWeekDays, function (day) {
                chartLabels.push(day.date);
            });

            _.forEach(chartLabels, function (label) {
                var filtered = _.filter(costs, function (cost) {
                    return cost.formatDate === label;
                });

                _.forEach(filtered, function (filteredItem) {
                    var add, remove;
                    
                });
            });

            // _.forEach(currentWeekDays, function (value) {
            //     var searchDay = value;
            //     var searchDate = value.date;
            //     _.forEach(costs, function (value) {
            //         if (value.formatDate === searchDate) {
            //             searchDay.costs.push(value);
            //         }
            //     });
            // });

            var result = {
                content: {
                    currentDay: currentDay,
                    chartLabels: chartLabels,
                    chartData: chartData
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

            console.log('Cost Saved');
            return res.json({success: true});
        });
    }
};

module.exports = costsController;


