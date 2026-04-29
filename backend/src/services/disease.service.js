const DiseaseModel = require("../models/diseaseModel");

class DiseaseService {
  static async createDisease(data) {
    try {
      const existing = await DiseaseModel.getDiseaseByName(data.name);
      if (existing) {
        throw new Error("Disease with this name already exists");
      }
      return await DiseaseModel.createDisease(data);
    } catch (error) {
      throw error;
    }
  }

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

  static async updateDisease(id, data) {
    try {
      return await DiseaseModel.updateDisease(id, data);
    } catch (error) {
      throw error;
    }
  }

  static async deleteDisease(id) {
    try {
      return await DiseaseModel.deleteDisease(id);
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
}

module.exports = DiseaseService;
