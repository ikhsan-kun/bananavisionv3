const fs = require("fs");
const path = require("path");

function getModelStorageDir() {
  if (process.env.MODEL_STORAGE_PATH) {
    return process.env.MODEL_STORAGE_PATH;
  }
  return path.resolve(__dirname, "../../../python");
}

function ensureModelDir() {
  const dir = getModelStorageDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Model storage directory created: ${dir}`);
  }
  return dir;
}

function confirmModelSaved(uploadedFilePath, filename) {
  const modelDir = getModelStorageDir();
  const expectedPath = path.join(modelDir, filename);

  if (!fs.existsSync(expectedPath)) {
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.copyFileSync(uploadedFilePath, expectedPath);
      console.log(`Model file copied to storage: ${expectedPath}`);
    } else {
      throw new Error(`Model file not found: ${expectedPath}`);
    }
  } else {
    console.log(`Model file saved at: ${expectedPath}`);
  }

  return expectedPath;
}

function deleteModelFile(filename) {
  const modelDir = getModelStorageDir();
  const filePath = path.join(modelDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`Model file not found: ${filePath}`);
    return true;
  }

  try {
    fs.unlinkSync(filePath);
    console.log(`Model file deleted: ${filePath}`);
    return true;
  } catch (err) {
    console.error(`Failed to delete model file ${filePath}:`, err.message);
    return false;
  }
}

function listModelFiles() {
  const modelDir = getModelStorageDir();
  try {
    const files = fs.readdirSync(modelDir);
    return files.filter((f) => f.endsWith(".keras"));
  } catch (err) {
    console.error("Failed to list model files:", err.message);
    return [];
  }
}

module.exports = {
  getModelStorageDir,
  ensureModelDir,
  confirmModelSaved,
  deleteModelFile,
  listModelFiles,
};
