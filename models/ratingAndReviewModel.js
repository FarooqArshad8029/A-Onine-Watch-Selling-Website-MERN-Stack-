import mongoose from "mongoose";
const ratingSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
},
{ timestamps: true }
);

export default mongoose.model("RatingAndReview", ratingSchema);
