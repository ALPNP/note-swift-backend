var express = require('express');
var router = express.Router();
var moment = require('./../../../libs/moment');
var costsController = require('./../../../controllers/costs.controller');

router.get('/costs', function (req, res) {
    costsController.getCosts(req, res);
});

router.post('/costs', function (req, res) {
    costsController.addCost(req, res);
});

router.get('/costs/chart', function (req, res) {
    costsController.getCostsChartData(req, res);
});

router.delete('/costs', function (req, res) {
    costsController.deleteCost(req, res);
});

router.get('/costs/:id', function (req, res) {
    costsController.getCost(req, res);
});

router.put('/costs', function (req, res) {
    costsController.updateCost(req, res);
});

module.exports = router;
