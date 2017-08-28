var moment = require('./../libs/moment');
var _ = require('lodash');

var utilities = {
    formatDate: function (date) {
        return moment(date).format('L');
    },
    filterItemsByLastDaysCount: function (items, daysCount) {
        var currentIntervalDays = [];
        var searchResult = [];

        for (var i = 0; i < daysCount; i++) {
            var day = (function () {
                return moment(moment().add(-[i], 'd')).format('L');
            })();

            currentIntervalDays.push(day);
        }

        _.forEach(currentIntervalDays, function (day) {
            _.forEach(items, function (item) {
                if (item.formatDate === day) {
                    searchResult.push(item);
                }
            });
        });

        return searchResult;
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
    createStatisticDataWithCurrentDayByLastDaysCount: function(items, daysCount) {

        var currentDay = moment();
        var currentDays = [];
        var addSummary = 0;
        var removeSummary = 0;

        for (var i = 0; i < daysCount; i++) {
            var day = {
                date: (function () {
                    var date = moment().add(-[i], 'd');
                    return moment(date).format('L');
                })()
            };

            currentDays.push(day);
        }

        _.forEach(currentDays, function (value) {
            var searchDate = value.date;
            _.forEach(items, function (value) {
                if (value.formatDate === searchDate) {
                    if (value.type === 'add') {
                        addSummary += value.amount;
                    } else if (value.type === 'remove') {
                        removeSummary += value.amount;
                    }
                }
            });
        });

        return {
            addSummary: addSummary,
            removeSummary: removeSummary,
            currentDay: currentDay,
            startDay: currentDays[0].date,
            endDay: currentDays[currentDays.length - 1].date
        };
    }
};

module.exports = utilities;
