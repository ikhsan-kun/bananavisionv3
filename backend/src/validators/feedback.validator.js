const { body } = require("express-validator");

// userId tidak perlu divalidasi dari body karena diinjeksi dari req.user oleh middleware auth
const createFeedbackValidator = [
  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isString()
    .withMessage("Message must be a string")
    .isLength({ min: 3, max: 500 })
    .withMessage("Message must be between 3 and 500 characters"),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
];

const updateFeedbackValidator = [
  body("message")
    .optional()
    .notEmpty()
    .withMessage("Message cannot be empty")
    .isLength({ min: 3, max: 500 })
    .withMessage("Message must be between 3 and 500 characters"),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
];

module.exports = {
  createFeedbackValidator,
  updateFeedbackValidator,
};
