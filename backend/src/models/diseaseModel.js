const prisma = require("../../config/database");

class DiseaseModel {
  static async createDisease(data) {
    return await prisma.disease.create({
      data,
    });
  }

  static async getDiseaseById(id) {
    return await prisma.disease.findUnique({
      where: { id },
    });
  }

  static async getDiseaseByName(name) {
    return await prisma.disease.findFirst({
      where: { name: name },
    });
  }

  static async getDiseases(filters = {}) {
    return await prisma.disease.findMany({
      where: {
        isActive: true,
        ...filters,
      },
      orderBy: { name: "asc" },
    });
  }

  static async updateDisease(id, data) {
    return await prisma.disease.update({
      where: { id },
      data,
    });
  }

  static async deleteDisease(id) {
    return await prisma.disease.update({
      where: { id },
      data: { isActive: false },
    });
  }

  static async getAllCategories() {
    const diseases = await prisma.disease.findMany({
      where: { isActive: true },
      distinct: ["category"],
      select: { category: true },
    });
    return diseases.map((d) => d.category);
  }
}

module.exports = DiseaseModel;
