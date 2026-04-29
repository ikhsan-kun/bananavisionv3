const { authenticate } = require("../middleware/auth");
const express = require("express");
const FeedbackController = require("../controllers/feedback.controller");

const router = express.Router();

router.post("/", authenticate, FeedbackController.createFeedback);
router.get("/", FeedbackController.getAllFeedbacks);
router.get("/user/:userId", FeedbackController.getFeedbacksByUserId);
router.put("/:id", authenticate, FeedbackController.updateFeedback);
router.delete("/:id", authenticate, FeedbackController.deleteFeedback);

module.exports = router;
