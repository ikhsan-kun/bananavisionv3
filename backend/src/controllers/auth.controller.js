const AuthService = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/response");

class AuthController {
  static async loginWithGoogle(req, res) {
    try {
      const { idToken } = req.body;

      const result = await AuthService.loginWithGoogle(idToken);

      return successResponse(res, result, "Login berhasil", 200);
    } catch (error) {
      console.error("Login error:", error);
      return errorResponse(res, "login gagal", 401, error.message);
    }
  }
  static async getProfile(req, res) {
    try {
      const user = await AuthService.getUserProfile(req.user.id);

      return successResponse(res, { user }, "berhasil mengambil data profile user");
    } catch (error) {
      console.error("error saat mengambil data profil user", error);
      return errorResponse(res, "gagal mengambil data profile user", 404, error.message);
    }
  }

  static async updateProfile(req, res) {
    try {
      const { name, avatar, notifications, language } = req.body;

      const user = await AuthService.updateProfile(req.user.id, {
        ...(name && { name }),
        ...(avatar && { avatar }),
        ...(notifications !== undefined && { notifications }),
        ...(language && { language }),
      });

      return successResponse(res, { user }, "berhasil memperbarui data profile user");
    } catch (error) {
      console.error("Update profile error:", error);
      return errorResponse(
        res,
        "gagal memperbarui data profile user",
        400,
        error.message
      );
    }
  }

  static async verifyToken(req, res) {
    try {
      const user = await AuthService.getUserProfile(req.user.id);

      return successResponse(res, { user, valid: true }, "Token is valid");
    } catch (error) {
      return errorResponse(res, "Invalid token", 401, error.message);
    }
  }
}

module.exports = AuthController;
