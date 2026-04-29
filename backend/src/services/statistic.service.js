const StatisticModel = require("../models/statisticModel");

class StatisticService {
  static async getUserStatistics(userId) {
    try {
      const statistics = await StatisticModel.getUserStatistics(userId);
      return statistics;
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      throw new Error("Could not fetch user statistics");
    }
  }
}

module.exports = StatisticService;