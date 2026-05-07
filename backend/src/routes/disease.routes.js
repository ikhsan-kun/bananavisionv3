const express = require("express");
const router = express.Router();
const diseaseController = require("../controllers/disease.controller");

// Public routes - read only (data dikelola via seed)
router.get("/", diseaseController.getDiseases);
router.get("/:id", diseaseController.getDiseaseById);

module.exports = router;
