const fs = require("fs");
const path = require("path");

/**
 * Direktori penyimpanan model .keras di server.
 * Bisa dikonfigurasi via env MODEL_STORAGE_PATH.
 * Default-nya: folder python/ di dalam monorepo (development),
 * atau /opt/bananavision/models di production server.
 */
function getModelStorageDir() {
  if (process.env.MODEL_STORAGE_PATH) {
    return process.env.MODEL_STORAGE_PATH;
  }
  // Fallback ke folder python/ di root proyek (untuk development lokal)
  return path.resolve(__dirname, "../../../python");
}

/**
 * Pastikan direktori penyimpanan model tersedia.
 */
function ensureModelDir() {
  const dir = getModelStorageDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Model storage directory created: ${dir}`);
  }
  return dir;
}

/**
 * Salin (atau pindah) file model yang sudah diupload ke direktori penyimpanan.
 * Karena multer sudah menyimpan langsung ke MODEL_STORAGE_PATH,
 * fungsi ini hanya memvalidasi keberadaan file dan mengembalikan path-nya.
 * @param {string} uploadedFilePath - Path file yang sudah disimpan multer
 * @param {string} filename - Nama file
 * @returns {string} - Path absolut file model yang tersimpan
 */
function confirmModelSaved(uploadedFilePath, filename) {
  const modelDir = getModelStorageDir();
  const expectedPath = path.join(modelDir, filename);

  if (!fs.existsSync(expectedPath)) {
    // File mungkin ada di path lain (upload temp), coba salin
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.copyFileSync(uploadedFilePath, expectedPath);
      console.log(`✅ Model file copied to storage: ${expectedPath}`);
    } else {
      throw new Error(`File model tidak ditemukan setelah upload: ${expectedPath}`);
    }
  } else {
    console.log(`✅ Model file saved at: ${expectedPath}`);
  }

  return expectedPath;
}

/**
 * Hapus file model dari penyimpanan lokal.
 * @param {string} filename - Nama file model
 * @returns {boolean} - true jika berhasil dihapus atau tidak ada, false jika error
 */
function deleteModelFile(filename) {
  const modelDir = getModelStorageDir();
  const filePath = path.join(modelDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`ℹ️ Model file not found (already deleted or never existed): ${filePath}`);
    return true;
  }

  try {
    fs.unlinkSync(filePath);
    console.log(`🗑️ Model file deleted: ${filePath}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to delete model file ${filePath}:`, err.message);
    return false;
  }
}

/**
 * List semua file .keras yang ada di direktori penyimpanan.
 * @returns {string[]} - Array of filename strings
 */
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
