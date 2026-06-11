const prisma = require("./config/database");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environmental variables
dotenv.config();

const modelStoragePath = process.env.MODEL_STORAGE_PATH || path.join(__dirname, "../models");

const modelsToRegister = [
  {
    name: "model mobilenetv2",
    filename: "model_mobilenetv2_final.keras",
    modelType: "mobilenetv2",
  },
  {
    name: "model resnet50",
    filename: "model_resnet50_final.keras",
    modelType: "resnet50",
  }
];

async function main() {
  console.log("Scanning models directory:", modelStoragePath);

  for (const m of modelsToRegister) {
    const filePath = path.join(modelStoragePath, m.filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const fileSize = stats.size;

      console.log(`Found model file ${m.filename} (${(fileSize / (1024 * 1024)).toFixed(2)} MB). Registering to DB...`);

      // Check if already exists in DB
      const existing = await prisma.mlModel.findFirst({
        where: { filename: m.filename }
      });

      if (existing) {
        await prisma.mlModel.update({
          where: { id: existing.id },
          data: {
            name: m.name,
            modelType: m.modelType,
            fileSize: fileSize,
            updatedAt: new Date()
          }
        });
        console.log(`Updated existing model metadata in MongoDB: ${m.filename}`);
      } else {
        await prisma.mlModel.create({
          data: {
            name: m.name,
            filename: m.filename,
            modelType: m.modelType,
            isActive: false,
            fileSize: fileSize,
            uploadedAt: new Date(),
            updatedAt: new Date()
          }
        });
        console.log(`Created new model metadata in MongoDB: ${m.filename}`);
      }
    } else {
      console.warn(`Model file not found on disk, skipped: ${filePath}`);
    }
  }

  console.log("Done syncing models.");
  process.exit(0);
}

main().catch(err => {
  console.error("Error during sync:", err);
  process.exit(1);
});
