const { authenticate } = require("../middleware/auth");
const express = require("express");
const FeedbackController = require("../controllers/feedback.controller");
const {
  createFeedbackValidator,
  updateFeedbackValidator,
} = require("../validators/feedback.validator");
const { validate } = require("../validators/auth.validator");

const router = express.Router();

router.post("/", authenticate, createFeedbackValidator, validate, FeedbackController.createFeedback);
router.get("/", FeedbackController.getAllFeedbacks);
router.get("/user/:userId", FeedbackController.getFeedbacksByUserId);
router.put("/:id", authenticate, updateFeedbackValidator, validate, FeedbackController.updateFeedback);
router.delete("/:id", authenticate, FeedbackController.deleteFeedback);

module.exports = router;
