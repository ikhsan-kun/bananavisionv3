const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error(
    "JWT_SECRET is required for token generation and verification",
  );
}

const generateToken = (payload) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    throw error;
  }
};

module.exports = { generateToken, verifyToken };
