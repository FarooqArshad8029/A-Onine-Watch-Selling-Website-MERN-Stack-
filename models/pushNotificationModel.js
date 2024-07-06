import mongoose from "mongoose";
const pushNotificatinSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("pushNotification", pushNotificatinSchema);
