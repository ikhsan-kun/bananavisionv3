const routes = require("express").Router();
const StatisticController = require("../controllers/statistic.controller");
const { authenticate } = require("../middleware/auth");

routes.get("/user", authenticate, StatisticController.getUserStatistics);

module.exports = routes;