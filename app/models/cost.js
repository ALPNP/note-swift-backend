var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = mongoose.model('Cost', new Schema({
    date: Date,
    type: String,
    amount: Number,
    username: String,
    formatDate: String
}));