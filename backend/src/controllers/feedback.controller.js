const feedbackService =   require('../services/feedback.service');
const {successResponse, errorResponse} = require('../utils/response');

class FeedbackController {
  static async createFeedback(req, res) {
    try {
      const feedback = await feedbackService.createFeedback(req.body);
      successResponse(res, feedback, 201);
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  }

  static async getFeedbacks(req, res) {
    try {
      const feedbacks = await feedbackService.getFeedbacks();
      successResponse(res, feedbacks);
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  }

  static async getFeedbackById(req, res) {
    try {
      const feedback = await feedbackService.getFeedbackById(req.params.id);
      if (!feedback) {
        return errorResponse(res, "Feedback not found", 404);
      }
      successResponse(res, feedback);
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  }

  static async getFeedbacksByUserId(req, res) {
    try {
      const feedbacks = await feedbackService.getFeedbacksByUserId(req.params.userId);
      successResponse(res, feedbacks);
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  }

  static async updateFeedback(req, res) {
    try {
      const feedback = await feedbackService.updateFeedback(req.params.id, req.body);
      if (!feedback) {
        return errorResponse(res, "Feedback not found", 404);
      }
      successResponse(res, feedback);
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  }

  static async deleteFeedback(req, res) {
    try {
      const feedback = await feedbackService.deleteFeedback(req.params.id);
      if (!feedback) {
        return errorResponse(res, "Feedback not found", 404);
      }
      successResponse(res, null, 204);
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  }
}

module.exports = FeedbackController;