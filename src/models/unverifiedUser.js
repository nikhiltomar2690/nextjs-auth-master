import mongoose from "mongoose";
const { Schema } = mongoose;

const unverifieduserSchema = new Schema(
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

export default mongoose.models.unverifiedUser ||
  mongoose.model("unverifiedUser", unverifieduserSchema);
