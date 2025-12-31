import bcrypt from "bcrypt";

import admin from "../firebase/firebase_config.js";
import {
  generateNewAccessToken,
  generateTokenAndSetCookie,
  generateResetToken,
  generateVerificationToken,
} from "../utils/generateUserTokens.js";

import User from "../models/user_model.js";

// validating email addresses and passwords - regx validation.
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z]).{6,20}$/;

// @desc    Register/signup a new user
// route    POST api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body; // fetching data from the body.

    // Checking if fullname, email and password are provided
    if (!email || !fullname || !password) {
      throw new Error("All fields are required");
    }

    // server-side validations
    if (fullname.length < 3) {
      return res.status(400).json({
        error: "Fullname must be atleast 3 letters long",
        field: "fullname",
      });
    }
    if (!email.length) {
      return res.status(400).json({ error: "Enter email", field: "email" });
    }
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "Email is invalid", field: "email" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        // error:"Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
        error:
          "Password should be 6 to 20 characters long with atleast 1 number",
        field: "password",
      });
    }

    // Checking into the dB if the email already exists in the dB.
    const existingUser = await User.findOne({ "personal_info.email": email });
    // console.log(existingUser);

    if (existingUser) {
      console.log("user already exists");
      return res.status(400).json({
        success: false,
        error: "Email already exists",
        field: "email",
      });
    }

    // hash password
    const hashed_password = await bcrypt.hash(password, 10); // bcrypting the password.

    // creating a collection into the dB
    const user = new User({
      personal_info: {
        fullname,
        email,
        password: hashed_password,
        verificationTokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1hrs
        isVerified: false,
      },
    });
    // console.log(user);

    // generating verification tokenId
    const verificationToken = generateVerificationToken(user._id); // jwt based tokenId generation
    // console.log("verification tokenId: ", verificationToken);

    user.personal_info.verificationToken = verificationToken;
    await user.save();

    // jwt - authenticate in client side. generate login jwt - 7d
    const accessToken = generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      success: true,
      accessToken,
      user: {
        ...user.toObject(),
        personal_info: {
          ...user.personal_info.toObject(),
          password: undefined, // Explicitly remove the password field
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: err.message,
    });
  }
};

// @desc    Auth/signin user
// route    POST api/auth/signin
// @access  Public
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    // finding user from the db.
    const user = await User.findOne({ "personal_info.email": email });

    if (
      !user ||
      (user.personal_info.password &&
        !(await bcrypt.compare(password, user.personal_info.password)))
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email or password" });
    }

    // Check if account is Google-authenticated
    if (user.google_auth) {
      return res.status(403).json({
        success: false,
        error: "Account was created using Google. Try logging in with Google",
      });
    }

    // set tokenId and update the last login.
    const accessToken = generateTokenAndSetCookie(res, user._id);
    user.personal_info.lastLogin = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        ...user.toObject(),
        personal_info: {
          ...user.personal_info.toObject(),
          password: undefined, // Explicitly remove the password field
        },
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

// @desc    Logout user
// route    POST api/auth/logout
// @access  Public
const logout = async (req, res) => {
  try {
    // checking if tokenId exists in coookies.
    if (!req.cookies["__secure_rt"]) {
      return res
        .status(400)
        .json({ success: false, message: "No active session" });
    }

    // Clear the tokenId cookie
    res.clearCookie("__secure_rt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Google Authentication
// route    api/auth/google-auth
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { id_token } = req.body;

    if (!id_token) {
      return res.status(400).json({ error: "No ID tokenId provided" });
    }

    let decodedUser;
    try {
      decodedUser = await admin.auth().verifyIdToken(id_token);
    } catch (verifyError) {
      console.error("Token verification error:", verifyError);
      return res
        .status(401)
        .json({ error: "Invalid tokenId", details: verifyError.message });
    }
    // console.log("Decoded User: ", decodedUser);
    const { email, name, picture } = decodedUser;
    let updatedPicture = picture.replace("s96-c", "s384-c");

    let user = await User.findOne({ "personal_info.email": email }).select(
      "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
    );

    if (!user) {
      let username = email.split("@")[0]; // Generate username from email
      user = new User({
        personal_info: {
          fullname: name,
          email,
          profile_img: updatedPicture,
          username,
        },
        google_auth: true,
      });

      user.personal_info.lastLogin = Date.now();
      await user.save();
    }
    const accessToken = generateTokenAndSetCookie(res, user._id);
    console.log(accessToken);
    res.status(200).json({ success: true, data: user, accessToken });
  } catch (err) {
    console.error("Google auth error:", err);
    res
      .status(500)
      .json({ error: "Failed to authenticate", details: err.message });
  }
};

// @desc  verify Email Address
// route  api/auth/verify-email
// @access private
const verifyEmail = async (req, res) => {
  try {
    const { tokenId } = req.params; // Extract verification tokenId from request body

    if (!tokenId) {
      return res
        .status(400)
        .json({ success: false, error: "Verification tokenId is required" });
    }

    // Find user by verification tokenId and check expiration
    const user = await User.findOne({
      "personal_info.verificationToken": tokenId,
      "personal_info.verificationTokenExpiresAt": { $gt: Date.now() },
    });

    // Check if user is already verified
    const verifiedUser = await User.findOne({
      "personal_info.verificationToken": tokenId,
    });

    // console.log("verified user : ", verifiedUser);

    if (verifiedUser?.personal_info.isVerified) {
      return res.status(400).json({
        success: false,
        error: "Email is already verified",
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired verification link",
      });
    }

    // Mark user as verified
    user.personal_info.isVerified = true;
    // user.personal_info.verificationToken = undefined;
    user.personal_info.verificationTokenExpiresAt = Date.now();

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error("Error verifying email:", err);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

// resend verification email route
const resendVerificationEmail = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // If user is already verified, return response
    if (user.personal_info.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already verified" });
    }

    // Generate a new verification tokenId and expiration time
    const newVerificationToken = generateVerificationToken(user._id);
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${newVerificationToken}`;

    user.personal_info.verificationToken = newVerificationToken;
    user.personal_info.verificationTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    // Save the updated user data
    await user.save();

    // Send verification email
    await SendEmail(
      user.personal_info.email,
      "Verify Your Email",
      `Your email verification tokenId: ${verificationUrl}\n\nUse this tokenId to verify your email.`
    );

    res.status(200).json({
      success: true,
      message: "Verification email resent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// forgot password link send
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const user = await User.findOne({ "personal_info.email": email });
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found.",
      });
    }

    // generating a jwt reset tokenId
    const reset_token = generateResetToken(user._id);
    console.log(reset_token);

    // Store the hashed tokenId in the database (optional)
    user.personal_info.resetPasswordToken = reset_token;
    user.personal_info.resetPasswordExpiresAt = Date.now() + 3600000; // 1 hour
    await user.save();

    // create reset url
    const resetUrl = `/reset-password/${reset_token}`;
    // send email with reset link

    await SendEmail(
      user.personal_info.email,
      "Password Reset Request",
      `Your password reset link: ${process.env.FRONTEND_URL}${resetUrl}\n\nUse this tokenId to reset your password.`
    );

    res
      .status(200)
      .json({ success: true, message: "Password reset link sent to email." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// reset password
const resetPassword = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { newPassword, confirmPassword } = req.body;

    // check if password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });
    }

    // find user by reset tokenId
    const user = await User.findOne({
      "personal_info.resetPasswordToken": tokenId,
    });

    // check if the user tokenId is valid or not.
    if (
      !user ||
      user.personal_info.resetPasswordToken !== tokenId ||
      user.personal_info.resetPasswordExpiresAt < Date.now()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired tokenId." });
    }

    // hash new password
    const hashed_password = await bcrypt.hash(newPassword, 10);

    // update password and clear reset tokenId.
    user.personal_info.password = hashed_password;
    user.personal_info.resetPasswordToken = undefined;
    user.personal_info.resetPasswordExpiresAt = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// @desc    Get user profile
// route    GET api/auth/profile
// @access  Private
const getCurrentUserProfile = async (req, res) => {
  try {
    // no need for this check, will remove it in future
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: No user found." });
    }

    const user = await User.findById(req.user._id).select("personal_info");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.status(200).json({
      _id: user._id,
      fullname: user.personal_info.fullname,
      email: user.personal_info.email,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// @desc    Update user profile
// route    PUT api/auth/profile
// @access  Private
const updateCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    let profileUpdated = false;
    let passwordChanged = false;

    // updating fullname
    if (
      req.body.fullname &&
      req.body.fullname !== user.personal_info.fullname
    ) {
      user.personal_info.fullname = req.body.fullname;
      profileUpdated = true;
    }

    // updating email and checking for duplicates
    if (req.body.email && req.body.email !== user.personal_info.email) {
      const existingUser = await User.findOne({
        "personal_info.email": req.body.email,
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, error: "Email already in use." });
      }

      user.personal_info.email = req.body.email;
      profileUpdated = true;
    }

    // Password update logic
    if (
      req.body.oldPassword ||
      req.body.newPassword ||
      req.body.confirmNewPassword
    ) {
      if (
        !req.body.oldPassword ||
        !req.body.newPassword ||
        !req.body.confirmNewPassword
      ) {
        return res
          .status(400)
          .json({ success: false, error: "All password fields are required." });
      }

      // Check if old password is correct
      const isMatch = await bcrypt.compare(
        req.body.oldPassword,
        user.personal_info.password
      );
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, error: "Incorrect old password." });
      }

      // Check if new password and confirm new password match
      if (req.body.newPassword !== req.body.confirmNewPassword) {
        return res.status(400).json({
          success: false,
          error: "New password and confirm password do not match.",
        });
      }

      // Hash the new password and update
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      user.personal_info.password = hashedPassword;
      passwordChanged = true;
    }

    // Save updated user details only if changes were made
    if (profileUpdated || passwordChanged) {
      await user.save();
      // console.log("changes saved successfully");
    }

    res.json({
      success: true,
      _id: user._id,
      fullname: user.personal_info.fullname,
      email: user.personal_info.email,

      password: passwordChanged
        ? "password changed successfully"
        : profileUpdated
        ? "Profile updated successfully"
        : "No changes were made",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

// @desc    refreshAccessToken
// route    GET /refresh-access-token
// @access  Public
const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies["__secure_rt"];
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const newAccessToken = generateNewAccessToken(token);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
export {
  signup,
  signin,
  googleAuth,
  verifyEmail,
  resendVerificationEmail,
  logout,
  forgotPassword,
  resetPassword,
  // getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  refreshAccessToken,
};
