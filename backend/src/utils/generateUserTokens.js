import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const generateTokenAndSetCookie = (res, userId) => {
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets are not defined in environment variables");
  }

  // short-lived access token
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  // long-lived refresh token
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  // Send refresh token in HttpOnly cookie
  res.cookie("__secure_rt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return accessToken;
};

export const generateNewAccessToken = (refreshToken) => {
  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // Generate a new access token using the userId from the decoded refresh token
    const newAccessToken = jwt.sign(
      { userId: decodedToken.userId },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );

    return newAccessToken;
  } catch (error) {
    throw new Error("Invalid refresh token or internal error");
  }
};

export const generateResetToken = (userId) => {
  // generate a JWT reset token (valid for 1 hour)
  const resetToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });

  return resetToken;
};

export const generateVerificationToken = (userId) => {
  // console.log(userId);
  const verificationToken = jwt.sign(
    {
      userId,
      jti: uuidv4(), // Unique identifier for the token
      iat: Date.now(), //issuedAt
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "24h" }
  );
  // console.log(verificationToken);
  return verificationToken;
};
