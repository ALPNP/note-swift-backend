var mongoose = require('mongoose');
var config = require('./../../config');

mongoose.connect(config.database);

module.exports = mongoose;