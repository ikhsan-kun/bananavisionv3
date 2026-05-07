const DiseaseService = require("../services/disease.service");
const { successResponse, errorResponse } = require("../utils/response");

// Disease data hanya bisa dibaca — perubahan dilakukan via seed script
class DiseaseController {
  static async getDiseaseById(req, res) {
    try {
      const { id } = req.params;
      const disease = await DiseaseService.getDiseaseById(id);
      return successResponse(res, disease, "Disease retrieved successfully");
    } catch (error) {
      return errorResponse(
        res,
        error.message || "Failed to retrieve disease",
        404,
      );
    }
  }

  static async getDiseases(req, res) {
    try {
      const { category } = req.query;
      const filters = category ? { category } : {};
      const diseases = await DiseaseService.getDiseases(filters);
      return successResponse(res, diseases, "Diseases retrieved successfully");
    } catch (error) {
      return errorResponse(
        res,
        error.message || "Failed to retrieve diseases",
        500,
      );
    }
  }
}

module.exports = DiseaseController;
