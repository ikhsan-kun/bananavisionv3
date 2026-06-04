const prisma = require("../../config/database");

class MlModelModel {
  static async create(data) {
    return await prisma.mlModel.create({
      data,
    });
  }

  static async findById(id) {
    return await prisma.mlModel.findUnique({
      where: { id },
    });
  }

  static async findActive() {
    return await prisma.mlModel.findFirst({
      where: { isActive: true },
    });
  }

  static async findByFilename(filename) {
    return await prisma.mlModel.findFirst({
      where: { filename },
    });
  }

  static async findAll() {
    return await prisma.mlModel.findMany({
      orderBy: { uploadedAt: "desc" },
    });
  }

  static async update(id, data) {
    return await prisma.mlModel.update({
      where: { id },
      data,
    });
  }

  static async deactivateAllExcept(activeId) {
    const whereClause = { isActive: true };
    if (activeId) {
      whereClause.id = { not: activeId };
    }
    return await prisma.mlModel.updateMany({
      where: whereClause,
      data: { isActive: false },
    });
  }

  static async delete(id) {
    return await prisma.mlModel.delete({
      where: { id },
    });
  }
}

module.exports = MlModelModel;
