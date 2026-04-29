const StatisticService = require("../services/statistic.service");
const { successResponse, errorResponse } = require("../utils/response");

class StatisticController {
  static async getUserStatistics(req, res) {
    try {
      const statistics = await StatisticService.getUserStatistics(req.user.id);
      successResponse(res, statistics, "berhasil mengambil statistik pengguna");
    } catch (error) {
      errorResponse(res, "gagal mengambil statistik pengguna", 500, error.message);
    }
  }
}

module.exports = StatisticController;