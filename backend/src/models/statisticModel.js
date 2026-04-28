const prisma = require("../../config/database");

class StatisticModel {
  static async getUserStatistics(userId) {
    const totalAnalyses = await prisma.analysis.count({
      where: { userId },
    });

    const diseaseCounts = await prisma.analysis.groupBy({
      by: ["detectedDisease"],
      where: { userId },
      _count: {
        detectedDisease: true,
      },
    });

    return {
      totalAnalyses,
      diseaseCounts: diseaseCounts.reduce((acc, curr) => {
        acc[curr.detectedDisease] = curr._count.detectedDisease;
        return acc;
      }, {}),
    };
  }
}
module.exports = StatisticModel;
