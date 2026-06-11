const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin.controller");
const AdminDiseaseController = require("../controllers/adminDisease.controller");
const MlModelController = require("../controllers/mlModel.controller");
const { authenticateAdmin } = require("../middleware/adminAuth");
const { getModelStorageDir, ensureModelDir } = require("../utils/localModelStorage");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer Storage Configuration for .keras models
// Menyimpan langsung ke MODEL_STORAGE_PATH (di server) atau python/ folder (development)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Pastikan direktori tersedia
    const dest = ensureModelDir();
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // Validasi ekstensi
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".keras") {
      return cb(new Error("Hanya file model dengan ekstensi .keras yang diperbolehkan!"));
    }
    // Sanitasi nama file: hilangkan path traversal (mis. ../../malicious.keras → malicious.keras)
    const safeName = path.basename(file.originalname);
    cb(null, safeName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max (ResNet50 bisa besar)
});

// --- Public Admin Routes ---
router.post("/login", AdminController.login);

// --- Protected Admin Routes ---
router.get("/profile", authenticateAdmin, AdminController.getProfile);
router.get("/stats", authenticateAdmin, AdminController.getDashboardStats);

// --- Disease CRUD Routes ---
router.get("/diseases", authenticateAdmin, AdminDiseaseController.getDiseases);
router.post("/diseases", authenticateAdmin, AdminDiseaseController.createDisease);
router.put("/diseases/:id", authenticateAdmin, AdminDiseaseController.updateDisease);
router.delete("/diseases/:id", authenticateAdmin, AdminDiseaseController.deleteDisease);
router.put("/diseases/:id/toggle", authenticateAdmin, AdminDiseaseController.toggleActive);

// --- ML Model Routes ---
router.get("/models", authenticateAdmin, MlModelController.getModels);
// Rute statis SEBELUM rute dinamis (:id)
router.get("/models/health", authenticateAdmin, MlModelController.getHealth);
router.post(
  "/models/upload",
  authenticateAdmin,
  upload.single("modelFile"),
  MlModelController.uploadModel
);
router.put("/models/:id/activate", authenticateAdmin, MlModelController.activateModel);
router.delete("/models/:id", authenticateAdmin, MlModelController.deleteModel);

// Public endpoint — no auth required — digunakan Python server saat startup untuk auto-recover
router.get("/models/active-info", MlModelController.getActiveModelInfo);

module.exports = router;
