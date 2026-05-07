const express = require("express");
const router = express.Router();
const analysisController = require("../controllers/analysis.controller");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

// Analisis gambar baru
router.post("/analyze", analysisController.analyzeImage);

// Ambil semua riwayat analisis user yang login
router.get("/", analysisController.getAnalyses);

// Dashboard stats & trends
router.get("/dashboard/stats", analysisController.getDashboardStats);
router.get("/dashboard/trends", analysisController.getDashboardTrends);

// Ambil & hapus analisis spesifik (hanya milik user sendiri)
router.get("/:id", analysisController.getAnalysisById);
router.delete("/:id", analysisController.deleteAnalysis);

module.exports = router;
