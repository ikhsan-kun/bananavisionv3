const { body } = require("express-validator");

const createFeedbackValidator = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("message").notEmpty().withMessage("Message is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
];

const updateFeedbackValidator = [
  body("message").optional().notEmpty().withMessage("Message cannot be empty"),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
];

module.exports = {
  createFeedbackValidator,
  updateFeedbackValidator,
};
