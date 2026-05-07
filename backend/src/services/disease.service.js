const DiseaseModel = require("../models/diseaseModel");

// Disease data dikelola via seed — service hanya menyediakan read operations
class DiseaseService {
  static async getDiseaseById(id) {
    try {
      const disease = await DiseaseModel.getDiseaseById(id);
      if (!disease) {
        throw new Error("Disease not found");
      }
      return disease;
    } catch (error) {
      throw error;
    }
  }

  static async getDiseases(filters = {}) {
    try {
      return await DiseaseModel.getDiseases(filters);
    } catch (error) {
      throw error;
    }
  }

  static async getCategories() {
    try {
      return await DiseaseModel.getAllCategories();
    } catch (error) {
      throw error;
    }
  }

  // Digunakan internal oleh AnalysisService untuk lookup disease saat analisis
  static async getDiseaseByName(name) {
    try {
      return await DiseaseModel.getDiseaseByName(name);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DiseaseService;
