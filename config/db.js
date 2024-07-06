import mongoose from "mongoose";
import { readNotificationController } from "../controllers/authController";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect("mongodb://0.0.0.0:27017/Clicky");
    console.log(`connected to monngoDB database ${connect.connection.host}`);
  } catch (err) {
    console.log(`Error in MongoDB ${err}`);
  }
};


export default connectDB;
