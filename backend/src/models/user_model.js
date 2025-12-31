import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    u_id: {
      type: String,
      // required: [true, "please enter firebase u_id"],
    },

    personal_info: {
      fullname: {
        type: String,
        lowercase: true,
        required: [true, "please enter fullname"],
        minlength: [3, "fullname must be 3 letters long"], // validation in database too
      },
      email: {
        type: String,
        required: [true, "please enter email"],
        lowercase: true,
        unique: [true, "email already exist"],
        // validate:
      },
      password: {
        type: String,
      },
      lastLogin: {
        type: Date,
        default: Date.now,
      },
      isVerified: {
        // checks if the user is verified or not, when user sign ups for the first time, they are not verified users, they will recieve a link in the email to verify thier account.
        type: Boolean,
        default: false,
      },

      resetPasswordToken: String,
      resetPasswordExpiresAt: Date,
      verificationToken: String,
      verificationTokenExpiresAt: Date,
    },

    google_auth: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

const User = mongoose.model("User", schema);
export default User;
