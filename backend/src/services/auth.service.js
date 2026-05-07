const admin = require("../../config/firebase");
const UserModel = require("../models/authModel");
const { generateToken } = require("../utils/jwt");


class AuthService {
  static async verifyFirebaseToken(idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new Error("Invalid Firebase token");
    }
  }

  static async loginWithGoogle(idToken) {
    try {
      const decodedToken = await this.verifyFirebaseToken(idToken);

      const { uid, email, name, picture } = decodedToken;

      if (!email) {
        throw new Error("Email not found in token");
      }

      let user = await UserModel.findByProviderId(uid);

      if (!user) {
        user = await UserModel.findByEmail(email);
      }

      if (!user) {
        user = await UserModel.create({
          email,
          name: name || email.split("@")[0],
          avatar: picture || null,
          provider: "google",
          providerId: uid,
        });
      } else {
        await UserModel.updateLastLogin(user.id);

        if (!user.providerId) {
          user = await UserModel.update(user.id, {
            providerId: uid,
          });
        }
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
      });

      return {
        user,
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getUserProfile(userId) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userId, data) {
    try {
      const user = await UserModel.update(userId, data);
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
