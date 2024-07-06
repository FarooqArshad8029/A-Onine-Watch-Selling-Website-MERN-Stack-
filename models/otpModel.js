import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      //  required: true
    },
    code: {
      type: Number,
      // require: true,
    },
    expireIn: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("otp", otpSchema);
