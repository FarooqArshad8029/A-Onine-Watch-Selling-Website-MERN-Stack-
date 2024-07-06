/////////////////////////// Farooq Arshad /////////////////////////////////
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import cron from "node-cron";
import http from "http"; // Import http module
import { configureSocket } from "./controllers/socketController.js";

import { deleteExpiredOtps } from "./controllers/authController.js"; // Import the function
// schedule the task to run once every week
cron.schedule("0 0 * * 0", deleteExpiredOtps);

const app = express();
dotenv.config();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
//database config
connectDB();
//import routes
app.use(authRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
// app.use("api/v1/auth",authRoutes);
const PORT = process.env.PORT || 8080;

//server for socket.i0 config
const server = http.createServer(app); // Create a server instance
//socket.io code runs
configureSocket(server);

app.get("/", (req, res) => {
  res.end("Hello, World!");
});
//run listen
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on ${PORT}`);
});
