var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = mongoose.model('Cost', new Schema({
    date: Date,
    type: String,
    amount: Number,
    userId: Number,
    // you must remove this bad choise
    formatDate: String,
    description: String
}));