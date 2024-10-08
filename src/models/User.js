import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    verificationCode: { type: String },
    verificationExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    provider: { type: String }, // Track authentication provider
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
