var express = require('express');
var costsRouter = express.Router();
var moment = require('./../../../libs/moment');
var costsController = require('./../../../controllers/costs.controller');

costsRouter.get('/costs', function (req, res) {
    costsController.getCosts(req, res);
});

costsRouter.post('/costs', function (req, res) {
    costsController.addCost(req, res);
});

costsRouter.get('/costs/chart', function (req, res) {
    costsController.getCostsChartData(req, res);
});

costsRouter.delete('/costs', function (req, res) {
    costsController.deleteCost(req, res);
});

costsRouter.get('/costs/:id', function (req, res) {
    costsController.getCost(req, res);
});

costsRouter.put('/costs', function (req, res) {
    costsController.updateCost(req, res);
});

module.exports = costsRouter;
