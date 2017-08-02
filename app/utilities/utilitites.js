var moment = require('./../libs/moment');

var utilities = {
    formatDate: function (date) {
        return moment(date).format('L');
    }
};

module.exports = utilities;
