const FeedbackModel =   require("../models/feedbackModel");

class FeedbackService {
  static async createFeedback(data) {
    return await FeedbackModel.createFeedback(data);
  }

  static async getFeedbacks() {
    return await FeedbackModel.getFeedbacks();
  }

  static async getFeedbackById(id) {
    return await FeedbackModel.getFeedbackById(id);
  }

  static async getFeedbacksByUserId(userId) {
    return await FeedbackModel.getFeedbacksByUserId(userId);
  }

  static async updateFeedback(id, data) {
    return await FeedbackModel.updateFeedback(id, data);
  }

  static async deleteFeedback(id) {
    return await FeedbackModel.deleteFeedback(id);
  }
}

module.exports = FeedbackService;