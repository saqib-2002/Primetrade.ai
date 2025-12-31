import express from "express";
import {
  signup,
  signin,
  googleAuth,
  logout,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
  verifyEmail,
  refreshAccessToken,
} from "../controller/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

router.route("/google-auth").post(googleAuth);

// protecting api urls with authenticate middleware.
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:tokenId", resetPassword);

router.route("/verify-email/:tokenId").post(verifyEmail);

router
  .route("/resend-verification-email")
  .post(authenticate, resendVerificationEmail);

router.route("/refresh-access-token").get(refreshAccessToken);
export default router;
