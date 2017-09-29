var moment = require('./../libs/moment');
var _ = require('lodash');

var utilities = {
    formatDate: function (date) {
        return moment(date).format('L');
    },
    getDate: function (date, format) {
        if (date) {
            return (format) ? moment(date).format(format) : moment(date);
        }

        if (format) {
            return moment().format(format);
        }

        return moment();
    },
    getDateByDateByDaysCount: function (date, daysCount) {
        return moment(moment(date).add(-daysCount, 'd'));
    },
    createChartDataWithCurrentDayByLastDaysCount: function (items, daysCount) {
        var currentDay = moment().format('L');
        var currentDays = [];
        var chartLabels = [];
        var chartData = [
            {data: [], label: 'Доходы'},
            {data: [], label: 'Расходы'}
        ];

        for (var i = 0; i < daysCount; i++) {
            var day = {
                date: (function () {
                    var date = moment().add(-[i], 'd');
                    return moment(date).format('L');
                })(),
                costs: []
            };

            currentDays.push(day);
        }

        _.forEach(currentDays, function (value) {
            var searchDay = value;
            var searchDate = value.date;
            _.forEach(items, function (value) {
                if (value.formatDate === searchDate) {
                    searchDay.costs.push(value);
                }
            });
        });

        _.forEachRight(currentDays, function (day) {
            chartLabels.push(day.date);
        });

        _.forEach(chartLabels, function (label) {
            var filtered = _.filter(items, function (cost) {
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

        return {
            currentDay: currentDay,
            chart: {
                chartLabels: chartLabels,
                chartData: chartData
            }
        };
    },
    createStatisticData: function (costs, startDay, endDay) {
        var addSummary = 0;
        var removeSummary = 0;

        _.forEach(costs, function (cost) {
            if (cost.type === 'add') {
                addSummary += cost.amount;
            } else if (cost.type === 'remove') {
                removeSummary += cost.amount;
            }
        });

        return {
            addSummary: addSummary,
            removeSummary: removeSummary,
            currentDay: moment(),
            startDay: moment(startDay).format('L'),
            endDay: moment(endDay).format("L")
        };
    }
};

module.exports = utilities;