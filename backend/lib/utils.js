import jwt from "jsonwebtoken";

/**
 * Generate Access Token (short-lived - 15 minutes)
 * Used for API requests and protected routes
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

/**
 * Generate Refresh Token (long-lived - 7 days)
 * Stored in secure HTTP-only cookie
 * Used to regenerate access tokens
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Generate both tokens and set refresh token in cookie
 * Access token is returned in response for frontend storage
 */
export const generateTokens = (userId, res) => {
  // Generate access token (15 minutes)
  const accessToken = generateAccessToken(userId);

  // Generate refresh token (7 days)
  const refreshToken = generateRefreshToken(userId);

  // Set refresh token in HTTP-only cookie (secure)
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return { accessToken, refreshToken };
};

/**
 * Legacy function for backward compatibility
 * Maps to new generateTokens function
 */
export const generateToken = (userId, res) => {
  const { accessToken } = generateTokens(userId, res);
  return accessToken;
};
